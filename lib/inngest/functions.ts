import { inngest } from "@/lib/inngest/client";
import { NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT } from "@/lib/inngest/prompts";
import { sendNewsSummaryEmail, sendWelcomeEmail } from "@/lib/nodemailer";
import { connectToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.model";
import { getNews } from "@/lib/actions/finnhub.actions";

// Gemini responses come back as { candidates: [{ content: { parts: [{ text }] } }] }
function extractText(response: unknown, fallback: string): string {
  const parts = (response as { candidates?: { content?: { parts?: { text?: string }[] } }[] })
    ?.candidates?.[0]?.content?.parts;
  const text = parts?.map((p) => p.text ?? "").join("").trim();
  return text || fallback;
}

export const sendSignUpEmail = inngest.createFunction(
  { id: "sign-up-email" },
  { event: "app/user.created" },
  async ({ event, step }) => {
    const { email, name, country, investmentGoals, riskTolerance, preferredIndustry } = event.data as {
      email: string;
      name: string;
      country: string;
      investmentGoals: string;
      riskTolerance: string;
      preferredIndustry: string;
    };

    const userProfile = `- Country: ${country}
- Investment goals: ${investmentGoals}
- Risk tolerance: ${riskTolerance}
- Preferred industry: ${preferredIndustry}`;

    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace("{{userProfile}}", userProfile);

    const response = await step.ai.infer("generate-welcome-intro", {
      model: step.ai.models.gemini({ model: "gemini-2.5-flash-lite" }),
      body: { contents: [{ role: "user", parts: [{ text: prompt }] }] },
    });

    await step.run("send-welcome-email", async () => {
      const intro = extractText(
        response,
        "Thanks for joining Signalist. You now have the tools to track the market and make smarter moves."
      );
      await sendWelcomeEmail({ email, name, intro });
    });

    return { success: true, message: "Welcome email sent" };
  }
);

export const sendDailyNewsSummary = inngest.createFunction(
  { id: "daily-news-summary" },
  [{ event: "app/send.daily.news" }, { cron: "0 12 * * *" }],
  async ({ step }) => {
    // 1. All users
    const users = await step.run("get-all-users", async () => {
      const mongoose = await connectToDatabase();
      const db = mongoose.connection.db;
      if (!db) throw new Error("MongoDB connection not found");
      const docs = await db
        .collection("user")
        .find({ email: { $exists: true, $ne: null } }, { projection: { _id: 1, id: 1, email: 1, name: 1 } })
        .toArray();
      return docs
        .filter((u) => u.email && u.name)
        .map((u) => ({ id: String(u.id ?? u._id), email: String(u.email), name: String(u.name) }));
    });

    if (!users.length) return { success: false, message: "No users found" };

    // 2. News per user (watchlist symbols, else general market news)
    const perUser = await step.run("fetch-user-news", async () => {
      await connectToDatabase();
      const out: { user: { id: string; email: string; name: string }; articles: unknown[] }[] = [];
      for (const user of users) {
        try {
          const items = await Watchlist.find({ userId: user.id }, { symbol: 1 }).lean();
          const symbols = items.map((i) => String(i.symbol));
          let articles = await getNews(symbols);
          articles = articles.slice(0, 6);
          if (!articles.length) articles = (await getNews()).slice(0, 6);
          out.push({ user, articles });
        } catch (err) {
          console.error("news fetch failed for", user.email, err);
        }
      }
      return out;
    });

    // 3. Summarize with AI
    const summaries: { user: { id: string; email: string; name: string }; html: string }[] = [];
    for (const { user, articles } of perUser) {
      if (!articles.length) continue;
      const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace("{{newsData}}", JSON.stringify(articles, null, 2));
      const response = await step.ai.infer(`summarize-news-${user.email}`, {
        model: step.ai.models.gemini({ model: "gemini-2.5-flash-lite" }),
        body: { contents: [{ role: "user", parts: [{ text: prompt }] }] },
      });
      summaries.push({ user, html: extractText(response, "No market news available today.") });
    }

    // 4. Send emails
    await step.run("send-news-emails", async () => {
      const date = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      await Promise.all(
        summaries.map(({ user, html }) => sendNewsSummaryEmail({ email: user.email, date, newsContent: html }))
      );
    });

    return { success: true, message: `Daily news summary sent to ${summaries.length} users` };
  }
);

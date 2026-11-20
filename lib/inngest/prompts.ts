export const PERSONALIZED_WELCOME_EMAIL_PROMPT = `Write a warm, personalized welcome message (2-3 sentences, plain text, no markdown, no greeting line, no sign-off) for a new user of Signalist, a stock tracking app.

User profile:
{{userProfile}}

Mention one thing from their profile (for example their goal or preferred industry) so it feels personal, and say what Signalist can help them do. Do not give financial advice.`;

export const NEWS_SUMMARY_EMAIL_PROMPT = `Write the body of a daily market news email as clean HTML fragments (no <html>, <head> or <body> tags, no markdown).

Articles (JSON):
{{newsData}}

Rules:
- Group by topic. For each item use: <h3 style="margin:20px 0 6px 0;color:#ffffff;font-size:17px;">Headline</h3> followed by <p style="margin:0 0 6px 0;color:#CCDADC;">One or two sentence summary</p> and <a href="URL" style="color:#fdd458;">Read more</a>.
- Keep summaries factual and short. Do not invent information that is not in the articles.
- Do not give financial advice.
Return only the HTML.`;

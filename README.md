# Signalist - Real-Time Stock Market App

Built from the structure and chapters of JavaScript Mastery's
"Build and Deploy a Real-Time Stock Market App" (Next.js, Better Auth, Inngest).

## Features

- Dashboard with live TradingView widgets (market overview, heatmap, top stories, market data)
- Email + password authentication (Better Auth, MongoDB)
- Sign-up collects investing preferences (goals, risk tolerance, industry)
- Stock search command palette (Finnhub) - open with the Search link or Ctrl/Cmd + K
- Stock details page: price header, candlestick and baseline charts, technicals, profile, financials
- Watchlist: add / remove from search or stock page, plus a `/watchlist` page (the video's CRUD challenge)
- Inngest automation: AI-written welcome email on sign-up and a daily personalized news summary email

## Stack

Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, MongoDB + Mongoose,
Better Auth, Inngest (with Gemini), Nodemailer, Finnhub API, TradingView widgets.

## Setup

1. Install dependencies

   ```bash
   npm install
   ```

2. Create your env file and fill it in

   ```bash
   cp .env.example .env
   ```

   | Variable | Where to get it |
   | --- | --- |
   | `MONGODB_URI` | MongoDB Atlas free cluster (or a local MongoDB) |
   | `BETTER_AUTH_SECRET` | Any long random string (`openssl rand -base64 32`) |
   | `BETTER_AUTH_URL` | `http://localhost:3000` locally, your domain in production |
   | `FINNHUB_API_KEY` | Free key from https://finnhub.io |
   | `GEMINI_API_KEY` | Google AI Studio (used by Inngest for email text) |
   | `NODEMAILER_EMAIL` / `NODEMAILER_PASSWORD` | Gmail address + an app password |

3. Run the app

   ```bash
   npm run dev
   ```

4. (Optional) Run the Inngest dev server in a second terminal to test the email workflows

   ```bash
   npm run inngest
   ```

   Open http://localhost:8288, and trigger `app/send.daily.news` manually to test the daily summary.

## Project structure

```
app/
  (auth)/sign-in, sign-up       Auth pages
  (root)/page.tsx               Dashboard
  (root)/stocks/[symbol]        Stock details
  (root)/watchlist              Watchlist page
  api/auth/[...all]             Better Auth handler
  api/inngest                   Inngest handler
components/                     Header, NavItems, SearchCommand, TradingViewWidget, ...
database/                       Mongoose connection + Watchlist model
lib/actions/                    Server actions (auth, finnhub, watchlist)
lib/better-auth/                Auth config
lib/inngest/                    Client, functions, prompts
lib/nodemailer/                 Transport + email templates
middleware.ts                   Redirects signed-out users to /sign-in
```

## Deploying

Deploy to Vercel, add the same environment variables, and set `BETTER_AUTH_URL` and
`NEXT_PUBLIC_BASE_URL` to your production URL. Register your `/api/inngest` endpoint in the
Inngest dashboard so the daily cron runs.

To stop the daily emails (for example while testing), disable the `daily-news-summary`
function in the Inngest dashboard.

## Notes

- Without `MONGODB_URI` the app builds but pages that need the database show an error at runtime.
- Search needs `FINNHUB_API_KEY`; without it only the popular-stocks list appears.

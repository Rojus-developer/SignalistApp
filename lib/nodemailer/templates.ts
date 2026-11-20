const shell = (inner: string) => `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:24px;background:#050505;font-family:Arial,Helvetica,sans-serif;color:#ffffff;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#141414;border:1px solid #30333a;border-radius:8px;">
    <tr><td style="padding:28px 32px 0 32px;font-size:22px;font-weight:700;color:#fdd458;">Signalist</td></tr>
    <tr><td style="padding:16px 32px 32px 32px;font-size:15px;line-height:1.6;color:#CCDADC;">${inner}</td></tr>
  </table>
</body>
</html>`;

export const WELCOME_EMAIL_TEMPLATE = shell(`
  <h1 style="font-size:24px;margin:0 0 16px 0;color:#ffffff;">Welcome aboard, {{name}}!</h1>
  <p style="margin:0 0 16px 0;">{{intro}}</p>
  <p style="margin:0 0 8px 0;">Here is what you can do right now:</p>
  <ul style="margin:0 0 20px 18px;padding:0;">
    <li>Add stocks to your watchlist</li>
    <li>Explore live charts and company details</li>
    <li>Get a personalized market news summary every day</li>
  </ul>
  <a href="${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}" style="display:inline-block;background:#fdd458;color:#000;text-decoration:none;font-weight:700;padding:12px 24px;border-radius:6px;">Go to dashboard</a>
`);

export const NEWS_SUMMARY_EMAIL_TEMPLATE = shell(`
  <h1 style="font-size:22px;margin:0 0 4px 0;color:#ffffff;">Market News Summary</h1>
  <p style="margin:0 0 20px 0;color:#9095a0;">{{date}}</p>
  {{newsContent}}
  <p style="margin:24px 0 0 0;font-size:12px;color:#9095a0;">You are receiving this because you signed up for Signalist.</p>
`);

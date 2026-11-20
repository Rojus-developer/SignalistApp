import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Signalist",
  description:
    "Track real-time stock prices, get personalized alerts and explore detailed company insights.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}

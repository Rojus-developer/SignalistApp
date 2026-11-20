import nodemailer from "nodemailer";
import { NEWS_SUMMARY_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "@/lib/nodemailer/templates";

const getTransporter = () => {
  const user = process.env.NODEMAILER_EMAIL;
  const pass = process.env.NODEMAILER_PASSWORD;
  if (!user || !pass) throw new Error("NODEMAILER_EMAIL / NODEMAILER_PASSWORD are not set");
  return nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
};

export const sendWelcomeEmail = async ({
  email,
  name,
  intro,
}: {
  email: string;
  name: string;
  intro: string;
}) => {
  const html = WELCOME_EMAIL_TEMPLATE.replace("{{name}}", name).replace("{{intro}}", intro);
  await getTransporter().sendMail({
    from: `"Signalist" <${process.env.NODEMAILER_EMAIL}>`,
    to: email,
    subject: "Welcome to Signalist - your stock market toolkit is ready!",
    text: "Thanks for joining Signalist",
    html,
  });
};

export const sendNewsSummaryEmail = async ({
  email,
  date,
  newsContent,
}: {
  email: string;
  date: string;
  newsContent: string;
}) => {
  const html = NEWS_SUMMARY_EMAIL_TEMPLATE.replace("{{date}}", date).replace("{{newsContent}}", newsContent);
  await getTransporter().sendMail({
    from: `"Signalist News" <${process.env.NODEMAILER_EMAIL}>`,
    to: email,
    subject: `Market News Summary Today - ${date}`,
    text: "Today's market news summary from Signalist",
    html,
  });
};

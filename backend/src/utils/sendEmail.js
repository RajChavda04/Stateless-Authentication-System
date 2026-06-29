import nodemailer from "nodemailer";
import config from "../config/env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});

export async function sendEmail(
  to,
  subject,
  text,
  html
) {
  return transporter.sendMail({
    from: config.EMAIL_USER,
    to,
    subject,
    text,
    html,
  });
}
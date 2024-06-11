import "dotenv/config";
import { nanoid } from "nanoid";
import nodemailer from "nodemailer";


console.log("MAILTRAP_USERNAME:", process.env.MAILTRAP_USERNAME);
console.log("MAILTRAP_PASSWORD:", process.env.MAILTRAP_PASSWORD);

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

const verificationToken = nanoid();
const message = {
  to: ["mark1234567@gmail.com"],
  from: "goit_nodejs@meta.ua",
  subject: "Email Verification",
  html: "",
  html: `<p>Click <a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">here</a> to verify your email.</p>`,
  text: `Click here to verify your email.`,
};



function sendMail({ to, from, subject, text }, verificationToken) {
  const html = `<p>Click <a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">here</a> to verify your email.</p>`;

  const message = {
    to,
    from,
    subject,
    text,
    html,
  };
  return transport.sendMail(message);
}

export default { sendMail };
transport.sendMail(message).then(console.log).catch(console.error);




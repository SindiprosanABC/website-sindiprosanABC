import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtps.uol.com.br",
  port: 465,
  secure: true,
  auth: {
    user: "sindiprosan-abc@sindiprosan-abc.org.br",
    pass: "Sindiprosan2011",
  },
});

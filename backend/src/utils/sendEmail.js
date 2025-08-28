import nodemailer from "nodemailer";
import Mailgen from "mailgen"

export const sendEmail = async (email, otp) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Testing App",
      link: "https://mailgen.js/",
    },
  });
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  const emailOps = {
    from: "mail.notetakingapp@example.com", // sender address
    to: email, // list of receivers
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`

  };
  try {
    await transporter.sendMail(emailOps)
  } catch (error) {
    console.log("Error in sending Email: ",error)
  }
};

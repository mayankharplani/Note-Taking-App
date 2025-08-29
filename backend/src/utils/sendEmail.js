import nodemailer from "nodemailer";

export const sendEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    secure: true,
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const decorationEmail = {
    from: "mharp1603@gmail.com",
    to: email,
    subject: "HD App - Your OTP Code",
    html: `<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;">
              <h2>HD App - Your OTP</h2>
              <p>Use the code below to continue:</p>
          <div style="font-size:24px;font-weight:bold;letter-spacing:4px;">${otp}</div>
            <p>This code expires in 5 minutes. If you didn’t request it, you can ignore this email.</p>
           </div>`,
    text: `Your HD App OTP is ${otp}`
  };

  try {
    await transporter.sendMail(decorationEmail);
  } catch (error) {
    console.log("Error in sending Email: ", error);
  }
};

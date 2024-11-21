import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  service:"gmail",
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
export const sendEmail=async(subject:string,html:string)=> {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER, 
    to: process.env.EMAIL_USER,
    subject: subject, 
    text: "Mã OTP của bạn là", 
    html: html, 
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}


// Import nodemailer package
import nodemailer from "nodemailer";

// Import dotenv package
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("SMTP_PORT:", process.env.SMTP_PORT);
console.log("SMTP_USER exists:", !!process.env.SMTP_USER);
console.log("SMTP_PASS exists:", !!process.env.SMTP_PASS);
console.log("EMAIL:", process.env.EMAIL);

// Create Brevo SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // smtp-relay.brevo.com
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP Error:", error);
  } else {
    console.log("SMTP Ready");
  }
});

// Function to send OTP email
const sendMail = async (to, otp) => {
  console.log("Reached sendMail");

  const info = await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "Reset Your Password",
    html: `<p>Your OTP for password reset is <b>${otp}</b>. It expires in 5 minutes.</p>`,
  });

  console.log("Message ID:", info.messageId);
  console.log("OTP Mail Sent Successfully");
};

// Export sendMail function
export default sendMail;
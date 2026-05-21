// Import nodemailer package
import nodemailer from "nodemailer"

// Import dotenv package
import dotenv from "dotenv"

// Load environment variables from .env file
dotenv.config()

// Create transporter for sending emails
const transporter = nodemailer.createTransport({

  // Use Gmail service
  service: "Gmail",

  // Secure SMTP port
  port: 465,

  // true because port 465 uses SSL
  secure: true,

  // Authentication details
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send OTP email
const sendMail = async (to, otp) => {

  // Send email
  await transporter.sendMail({

    // Sender email
    from: `${process.env.EMAIL}`,

    // Receiver email
    to,

    // Email subject
    subject: "Reset Your Password",

    // HTML email content
    html: `<p>Your OTP for password reset is <b>${otp}</b>. It expires in 5 minutes.</p>`
  })
}

// Export sendMail function
export default sendMail
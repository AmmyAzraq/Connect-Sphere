// Import nodemailer package
import nodemailer from "nodemailer"

// Import dotenv package
import dotenv from "dotenv"

// Load environment variables from .env file
dotenv.config()
console.log("EMAIL:", process.env.EMAIL)
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS)

// Create transporter for sending emails
const transporter = nodemailer.createTransport({

  // Use Gmail service
  host: "smtp.gmail.com",

  // Secure SMTP port
  port: 587,

  // true because port 465 uses SSL
  secure: false,

  // Authentication details
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
    
  },
  
});

transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP Error:", error)
  } else {
    console.log("SMTP Ready")
  }
})

// Function to send OTP email
const sendMail = async (to, otp) => {
  console.log("Reached sendMail");
  // Send email
  const info=await transporter.sendMail({

    // Sender email
    from: `${process.env.EMAIL}`,

    // Receiver email
    to,

    // Email subject
    subject: "Reset Your Password",

    // HTML email content
    html: `<p>Your OTP for password reset is <b>${otp}</b>. It expires in 5 minutes.</p>`
  })
    console.log("Message ID:", info.messageId);
  console.log("OTP Mail Sent Successfully")
}

// Export sendMail function
export default sendMail
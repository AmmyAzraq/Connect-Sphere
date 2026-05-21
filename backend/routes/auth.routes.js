// Import express package
import express from "express"

// Import authentication controller functions
import { resetPassword, sendOtp, signIn, signOut, signUp, verifyOtp } from "../controllers/auth.controllers.js"

// Create express router
const authRouter=express.Router()

// Route for user signup
authRouter.post("/signup",signUp)

// Route for user signin
authRouter.post("/signin",signIn)

// Route for sending OTP
authRouter.post("/sendOtp",sendOtp)

// Route for verifying OTP
authRouter.post("/verifyOtp",verifyOtp)

// Route for resetting password
authRouter.post("/resetPassword",resetPassword)

// Route for user signout
authRouter.get("/signout",signOut)

// Export router
export default authRouter
// Import sendMail function for sending OTP emails
import sendMail from "../config/Mail.js"

// Import genToken function for generating JWT token
import genToken from "../config/token.js"

// Import User model
import User from "../models/user.model.js"

// Import bcrypt for password hashing and comparison
import bcrypt from "bcryptjs"

// Sign up controller
export const signUp=async (req,res)=>{
    try {

        // Get user details from request body
        const {name,email,password,userName}=req.body

        // Check if email already exists
        const findByEmail=await User.findOne({email})
        if(findByEmail){
            return res.status(400).json({message:"Email already exist !"})
        }

        // Check if username already exists
         const findByUserName=await User.findOne({userName})
        if(findByUserName){
            return res.status(400).json({message:"UserName already exist !"})
        }

        // Check password length
        if(password.length<6){
            return res.status(400).json({message:"password must be atleast 6 characters "})
        }

        // Hash password before saving
        const hashedPassword=await bcrypt.hash(password,10)

        // Create new user
        const user=await User.create({
            name,
            userName,
            email,
            password:hashedPassword
        })

        // Generate token for user
        const token=await genToken(user._id)

        // Store token in cookie
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:10*365*24*60*60*1000,
            secure:false,
            sameSite:"Strict"
        })

        // Send created user response
        return res.status(201).json(user)

    } catch (error) {

        // Handle signup error
        return res.status(500).json({message:`signup error ${error}`})
    }
}

// Sign in controller
export const signIn=async (req,res)=>{
    try {

        // Get login details from request body
        const {password,userName}=req.body
       
        // Find user by username
         const user=await User.findOne({userName})
        if(!user){
            return res.status(400).json({message:"User not found !"})
        }

        // Compare entered password with saved hashed password
     const isMatch=await bcrypt.compare(password,user.password)

       if(!isMatch){
         return res.status(400).json({message:"Incorrect Password !"})
       }

        // Generate token after successful login
        const token=await genToken(user._id)

        // Store token in cookie
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:10*365*24*60*60*1000,
            secure:false,
            sameSite:"Strict"
        })

        // Send logged in user response
        return res.status(200).json(user)

    } catch (error) {

        // Handle signin error
        return res.status(500).json({message:`signin error ${error}`})
    }
}


// Sign out controller
export const signOut=async (req,res)=>{
    try {

        // Clear token cookie
        res.clearCookie("token")

        // Send success response
        return res.status(200).json({message:"sign out successfully"})

    } catch (error) {

        // Handle signout error
        return res.status(500).json({message:`signout error ${error}`})
    }
}

// Send OTP controller
export const sendOtp=async (req,res)=>{
    try {

        // Get email from request body
        const {email}=req.body

        // Find user by email
        const user =await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"User not found"})
        }

        // Generate 4 digit OTP
        const otp=Math.floor(1000 + Math.random() * 9000).toString()

        // Save OTP in user document
        user.resetOtp=otp,

        // Set OTP expiry time for 5 minutes
        user.otpExpires=Date.now() + 5*60*1000

        // Mark OTP as not verified
        user.isOtpVerified=false

       // Save user with OTP details
       await user.save()

       // Send OTP email
       await sendMail(email,otp)

       // Send success response
       return res.status(200).json({message:"email successfully send"})

    } catch (error) {

         // Handle send OTP error
         return res.status(500).json({message:`send otp error ${error}`})
    }
}


// Verify OTP controller
export const verifyOtp=async (req,res)=>{
    try {

       // Get email and OTP from request body
       const {email,otp}=req.body

     // Find user by email
     const user =await User.findOne({email})

     // Check if OTP is invalid or expired
     if(!user || user.resetOtp!==otp || user.otpExpires < Date.now() ){
        return res.status(400).json({message:"invalid/expired otp"})
     }

     // Mark OTP as verified
     user.isOtpVerified=true

     // Remove OTP after verification
     user.resetOtp=undefined

     // Remove OTP expiry after verification
     user.otpExpires=undefined

// Save updated user
await user.save()

// Send success response
return res.status(200).json({message:"otp verified"})
    } catch (error) {

         // Handle verify OTP error
         return res.status(500).json({message:`verify otp error ${error}`})
    }
}

// Reset password controller
export const resetPassword=async (req,res)=>{
    try {

        // Get email and new password from request body
        const {email,password}=req.body

        // Find user by email
        const user =await User.findOne({email})

        // Check if user exists and OTP is verified
        if(!user || !user.isOtpVerified){
            return res.status(400).json({message:"otp verfication required"})
        }

        // Hash new password
        const hashedPassword=await bcrypt.hash(password,10)

        // Update user password
        user.password=hashedPassword

        // Reset OTP verification status
        user.isOtpVerified=false

// Save updated user
await user.save()

// Send success response
return res.status(200).json({message:"password reset successfully"})

    } catch (error) {

         // Handle reset password error
         return res.status(500).json({message:`reset otp error ${error}`})
    }
}
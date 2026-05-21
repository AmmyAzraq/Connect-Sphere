// Import jsonwebtoken package
import jwt from "jsonwebtoken"

// Authentication middleware
 const isAuth=async (req,res,next)=>{
    try {

        // Get token from cookies
        const token=req.cookies.token

        // Check if token exists
        if(!token){
            return res.status(400).json({message:"token is not found"})
        }

   // Verify token using JWT secret
   const verifyToken=await jwt.verify(token,process.env.JWT_SECRET)  
   
   // Store user id inside request object
   req.userId=verifyToken.userId

   // Move to next middleware/controller
   next()

    } catch (error) {

        // Handle authentication error
        return res.status(500).json({message:`is auth error ${error}`})
    }
 }

 // Export middleware
 export default isAuth
// Import express package
import express from "express"

// Import authentication middleware
import isAuth from "../middlewares/isAuth.js"

// Import user controller functions
import { editProfile, follow, followingList, getAllNotifications, getCurrentUser, getProfile, markAsRead, search, suggestedUsers } from "../controllers/user.controllers.js"

// Import multer upload middleware
import { upload } from "../middlewares/multer.js"


// Create express router
const userRouter=express.Router()

// Route to get current logged in user
userRouter.get("/current",isAuth,getCurrentUser)

// Route to get suggested users
userRouter.get("/suggested",isAuth,suggestedUsers)

// Route to get user profile by username
userRouter.get("/getProfile/:userName",isAuth,getProfile)

// Route to follow or unfollow user
userRouter.get("/follow/:targetUserId",isAuth,follow)

// Route to get following list
userRouter.get("/followingList",isAuth,followingList)

// Route to search users
userRouter.get("/search",isAuth,search)

// Route to get all notifications
userRouter.get("/getAllNotifications",isAuth,getAllNotifications)

// Route to mark notifications as read
userRouter.post("/markAsRead",isAuth,markAsRead)

// Route to search users
userRouter.get("/search",isAuth,search)

// Route to edit user profile with profile image upload
userRouter.post("/editProfile",isAuth,upload.single("profileImage"),editProfile)

// Export router
export default userRouter
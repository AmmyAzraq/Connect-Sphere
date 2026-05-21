// Import express package
import express from "express"

// Import authentication middleware
import isAuth from "../middlewares/isAuth.js"

// Import multer upload middleware
import { upload } from "../middlewares/multer.js"

// Import post controller functions
import {
    comment,
    deletePost, // Post delete controller import
    getAllPosts,
    like,
    saved,
    uploadPost
} from "../controllers/post.controllers.js"

// Create express router
const postRouter = express.Router()

// Route to upload post with media
postRouter.post(
    "/upload",
    isAuth,
    upload.single("media"),
    uploadPost
)

// Route to get all posts
postRouter.get(
    "/getAll",
    isAuth,
    getAllPosts
)

// Route to like or unlike post
postRouter.get(
    "/like/:postId",
    isAuth,
    like
)

// Route to save or unsave post
postRouter.get(
    "/saved/:postId",
    isAuth,
    saved
)

// Route to comment on post
postRouter.post(
    "/comment/:postId",
    isAuth,
    comment
)

// Route to delete post
// Sirf post owner hi delete kar sakta hai
postRouter.delete(
    "/delete/:postId",
    isAuth,
    deletePost
)

// Export router
export default postRouter
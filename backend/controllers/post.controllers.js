// Import function to upload media on Cloudinary
import uploadOnCloudinary from "../config/cloudinary.js";

// Import Notification model
import Notification from "../models/notification.model.js";

// Import Post model
import Post from "../models/post.model.js";

// Import User model
import User from "../models/user.model.js";

// Import socket functions for real-time updates
import { getSocketId, io } from "../socket.js";

// Controller to upload post
export const uploadPost = async (req, res) => {
    try {

        // Get caption and media type from request body
        const { caption, mediaType } = req.body

        // Variable to store uploaded media URL
        let media;

        // Check if media file exists
        if (req.file) {

            // Upload media to Cloudinary
            media = await uploadOnCloudinary(req.file.path)

        } else {

            // Return error if media is missing
            return res.status(400).json({ message: "media is required" })
        }

        // Create new post
        const post = await Post.create({
            caption, media, mediaType, author: req.userId
        })

        // Find current user
        const user = await User.findById(req.userId)

        // Add post id in user's posts array
        user.posts.push(post._id)

        // Save updated user
        await user.save()

        // Populate author details
        const populatedPost = await Post.findById(post._id).populate("author", "name userName profileImage")

        // Send created post response
        return res.status(201).json(populatedPost)

    } catch (error) {

        // Handle upload post error
        return res.status(500).json({ message: `uploadPost error ${error}` })
    }
}


// Controller to get all posts
export const getAllPosts = async (req, res) => {
    try {

        // Find all posts with author and comment author details
        const posts = await Post.find({})
            .populate("author", "name userName profileImage")
            .populate("comments.author", "name userName profileImage")
            .sort({ createdAt: -1 })

        // Send all posts response
        return res.status(200).json(posts)

    } catch (error) {

        // Handle get all posts error
        return res.status(500).json({ message: `getallpost error ${error}` })
    }
}

// Controller to like or unlike a post
export const like = async (req, res) => {
    try {

        // Get post id from params
        const postId = req.params.postId

        // Find post by id
        const post = await Post.findById(postId)

        // Check if post exists
        if (!post) {
            return res.status(400).json({ message: "post not found" })
        }

        // Check if current user already liked the post
        const alreadyLiked = post.likes.some(id => id.toString() == req.userId.toString())

        // If already liked, remove like
        if (alreadyLiked) {

            post.likes = post.likes.filter(id => id.toString() != req.userId.toString())

        } else {

            // Add like
            post.likes.push(req.userId)

            // Send notification if user likes someone else's post
            if (post.author._id != req.userId) {

                // Create like notification
                const notification = await Notification.create({
                    sender: req.userId,
                    receiver: post.author._id,
                    type: "like",
                    post: post._id,
                    message: "liked your post"
                })

                // Populate notification details
                const populatedNotification = await Notification.findById(notification._id).populate("sender receiver post")

                // Get receiver socket id
                const receiverSocketId = getSocketId(post.author._id)

                // Send real-time notification if receiver is online
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("newNotification", populatedNotification)
                }

            }
        }


        // Save updated post
        await post.save()

        // Populate author details
        await post.populate("author", "name userName profileImage")

        // Emit updated likes to all users
        io.emit("likedPost", {
            postId: post._id,
            likes: post.likes
        })

        // Send updated post response
        return res.status(200).json(post)

    } catch (error) {

        // Handle like post error
        return res.status(500).json({ message: `likepost error ${error}` })
    }
}

// Controller to comment on post
export const comment = async (req, res) => {
    try {

        // Get comment message from request body
        const { message } = req.body

        // Get post id from params
        const postId = req.params.postId

        // Find post by id
        const post = await Post.findById(postId)

        // Check if post exists
        if (!post) {
            return res.status(400).json({ message: "post not found" })
        }

        // Add comment to comments array
        post.comments.push({
            author: req.userId,
            message
        })

        // Send notification if user comments on someone else's post
        if (post.author._id != req.userId) {

            // Create comment notification
            const notification = await Notification.create({
                sender: req.userId,
                receiver: post.author._id,
                type: "comment",
                post: post._id,
                message: "commented on your post"
            })

            // Populate notification details
            const populatedNotification = await Notification.findById(notification._id).populate("sender receiver post")

            // Get receiver socket id
            const receiverSocketId = getSocketId(post.author._id)

            // Send real-time notification if receiver is online
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newNotification", populatedNotification)
            }

        }

        // Save updated post
        await post.save()

        // Populate author details
        await post.populate("author", "name userName profileImage"),

            // Populate comment author details
            await post.populate("comments.author")

        // Emit updated comments to all users
        io.emit("commentedPost", {
            postId: post._id,
            comments: post.comments
        })

        // Send updated post response
        return res.status(200).json(post)

    } catch (error) {

        // Handle comment post error
        return res.status(500).json({ message: `comment post error ${error}` })
    }
}

// Controller to save or unsave post
export const saved = async (req, res) => {
    try {

        // Get post id from params
        const postId = req.params.postId

        // Find current user
        const user = await User.findById(req.userId)


        // Check if post is already saved
        const alreadySaved = user.saved.some(id => id.toString() == postId.toString())

        // If already saved, remove from saved array
        if (alreadySaved) {

            user.saved = user.saved.filter(id => id.toString() != postId.toString())

        } else {

            // Add post to saved array
            user.saved.push(postId)
        }

        // Save updated user
        await user.save()

        // Populate saved posts
        user.populate("saved")

        // Send updated user response
        return res.status(200).json(user)

    } catch (error) {

        // Handle save post error
        return res.status(500).json({ message: `saved  error ${error}` })
    }
}

// Post delete controller
export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params

        const post = await Post.findById(postId)

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            })
        }

        if (post.author.toString() !== req.userId) {
            return res.status(403).json({
                message: "You can delete only your own post"
            })
        }

        await Post.findByIdAndDelete(postId)

        // User ke posts array se post id remove
        await User.findByIdAndUpdate(req.userId, {
            $pull: { posts: postId }
        })

        return res.status(200).json({
            message: "Post deleted successfully"
        })

    } catch (error) {
        return res.status(500).json({
            message: `delete post error ${error}`
        })
    }
}
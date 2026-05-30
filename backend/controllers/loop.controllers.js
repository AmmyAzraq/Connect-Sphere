// Import function to upload media on Cloudinary
import uploadOnCloudinary from "../config/cloudinary.js";

// Import Loop model
import Loop from "../models/loop.model.js";

// Import Notification model
import Notification from "../models/notification.model.js";

// Import User model
import User from "../models/user.model.js";

// Import socket functions for real-time updates
import { getSocketId, io } from "../socket.js";

// Controller to upload loop
export const uploadLoop = async (req, res) => {
    try {
        // Get caption from request body
        const { caption } = req.body

        // Variable to store uploaded media URL
        let media;

        // Check if media file exists
        if (req.file) {
            // Upload file to Cloudinary
            media = await uploadOnCloudinary(req.file.path)
        } else {
            // Return error if media is missing
            return res.status(400).json({ message: "media is required" })
        }

        // Create new loop
        const loop = await Loop.create({
            caption, media, author: req.userId
        })

        // Find current user
        const user = await User.findById(req.userId)

        // Add loop id to user's loops array
        user.loops.push(loop._id)

        // Save updated user
        await user.save()

        // Get loop with author details
        const populatedLoop = await Loop.findById(loop._id).populate("author", "name userName profileImage")

        // Send created loop response
        return res.status(201).json(populatedLoop)
    } catch (error) {
        // Handle upload loop error
        return res.status(500).json({ message: `uploadloop error ${error}` })
    }
}

// Controller to like or unlike a loop
export const like = async (req, res) => {
    try {
        // Get loop id from params
        const loopId = req.params.loopId

        // Find loop by id
        const loop = await Loop.findById(loopId)

        // Check if loop exists
        if (!loop) {
            return res.status(400).json({ message: "loop not found" })
        }

        // Check if current user already liked this loop
        const alreadyLiked = loop.likes.some(id => id.toString() == req.userId.toString())

        // If already liked, remove like
        if (alreadyLiked) {
            loop.likes = loop.likes.filter(id => id.toString() != req.userId.toString())
        } else {
            // If not liked, add like
            loop.likes.push(req.userId)

            // Send notification if user likes someone else's loop
            if (loop.author._id != req.userId) {
                // Create like notification
                const notification = await Notification.create({
                    sender: req.userId,
                    receiver: loop.author._id,
                    type: "like",
                    loop: loop._id,
                    message: "liked your loop"
                })

                // Populate notification data
                const populatedNotification = await Notification.findById(notification._id).populate("sender receiver loop")

                // Get receiver socket id
                const receiverSocketId = getSocketId(loop.author._id)

                // Send real-time notification if receiver is online
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("newNotification", populatedNotification)
                }

            }
        }

        // Save updated loop
        await loop.save()

        // Populate author details
        await loop.populate("author", "name userName profileImage")

        // Emit updated likes to all connected users
        io.emit("likedLoop", {
            loopId: loop._id,
            likes: loop.likes
        })

        // Send updated loop response
        return res.status(200).json(loop)
    } catch (error) {
        // Handle like loop error
        return res.status(500).json({ message: `like loop error ${error}` })
    }
}

// Controller to comment on a loop
export const comment = async (req, res) => {
    try {
        // Get comment message from body
        const { message } = req.body

        // Get loop id from params
        const loopId = req.params.loopId

        // Find loop by id
        const loop = await Loop.findById(loopId)

        // Check if loop exists
        if (!loop) {
            return res.status(400).json({ message: "loop not found" })
        }

        // Add comment in comments array
        loop.comments.push({
            author: req.userId,
            message
        })

        // Send notification if user comments on someone else's loop
        if (loop.author._id != req.userId) {
            // Create comment notification
            const notification = await Notification.create({
                sender: req.userId,
                receiver: loop.author._id,
                type: "comment",
                loop: loop._id,
                message: "commented on your loop"
            })

            // Populate notification data
            const populatedNotification = await Notification.findById(notification._id).populate("sender receiver loop")

            // Get receiver socket id
            const receiverSocketId = getSocketId(loop.author._id)

            // Send real-time notification if receiver is online
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newNotification", populatedNotification)
            }

        }

        // Save updated loop
        await loop.save()

        // Populate loop author details
        await loop.populate("author", "name userName profileImage"),

            // Populate comment authors
            await loop.populate("comments.author")

        // Emit updated comments to all connected users
        io.emit("commentedLoop", {
            loopId: loop._id,
            comments: loop.comments
        })

        // Send updated loop response
        return res.status(200).json(loop)
    } catch (error) {
        // Handle comment loop error
        return res.status(500).json({ message: `comment loop error ${error}` })
    }
}

// Controller to get all loops
export const getAllLoops = async (req, res) => {
    try {
        // Find all loops and populate author and comment author details
        const loops = await Loop.find({}).populate("author", "name userName profileImage")
            .populate("comments.author")

        // Send loops response
        return res.status(200).json(loops)
    } catch (error) {
        // Handle get all loops error
        return res.status(500).json({ message: `get all loop error ${error}` })
    }
}

// Loop/Reel delete controller
export const deleteLoop = async (req, res) => {
    try {

        // URL se loopId le raha hai
        const { loopId } = req.params

        // Database me loop find kar raha hai
        const loop = await Loop.findById(loopId)

        // Agar loop nahi mili
        if (!loop) {
            return res.status(404).json({
                message: "Loop not found"
            })
        }

        // Sirf owner hi apni reel delete kar sakta hai
        if (loop.author.toString() !== req.userId) {
            return res.status(403).json({
                message: "You can delete only your own loop"
            })
        }

        // Loop delete kar raha hai
        await Loop.findByIdAndDelete(loopId)

        // User ke loops array se bhi loop id remove kar raha hai
        await User.findByIdAndUpdate(req.userId, {
            $pull: { loops: loopId }
        })

        // Success response
        return res.status(200).json({
            message: "Loop deleted successfully"
        })

    } catch (error) {

        return res.status(500).json({
            message: `delete loop error ${error}`
        })

    }
}
// Import function to upload media on Cloudinary
import uploadOnCloudinary from "../config/cloudinary.js"

// Import Story model
import Story from "../models/story.model.js"

// Import User model
import User from "../models/user.model.js"

// Controller to upload story
export const uploadStory = async (req, res) => {
    try {

        // Find current user
        const user = await User.findById(req.userId)

        // If user already has a story, delete old story
        if (user.story) {
            await Story.findByIdAndDelete(user.story)

            // Remove old story reference from user
            user.story = null
        }

        // Get media type from request body
        const { mediaType } = req.body

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

        // Create new story
        const story = await Story.create({
            author: req.userId, mediaType, media
        })

        // Save story id in user document
        user.story = story._id

        // Save updated user
        await user.save()

        // Populate story author and viewers details
        const populatedStory = await Story.findById(story._id).populate("author", "name userName profileImage")
            .populate("viewers", "name userName profileImage")

        // Send uploaded story response
        return res.status(200).json(populatedStory)

    } catch (error) {

        // Handle story upload error
        return res.status(500).json({ message: "story upload error" })
    }
}

// Controller to view story
export const viewStory = async (req, res) => {
    try {

        // Get story id from params
        const storyId = req.params.storyId

        // Find story by id
        const story = await Story.findById(storyId)

        // Check if story exists
        if (!story) {
            return res.status(400).json({ message: "story not found" })
        }

        // Convert viewers ids into string array
        const viewersIds = story.viewers.map(id => id.toString())

        // Add current user in viewers if not already viewed
        if (!viewersIds.includes(req.userId.toString())) {
            story.viewers.push(req.userId)

            // Save updated story
            await story.save()
        }

        // Populate story author and viewers details
        const populatedStory = await Story.findById(story._id).populate("author", "name userName profileImage")
            .populate("viewers", "name userName profileImage")

        // Send viewed story response
        return res.status(200).json(populatedStory)

    } catch (error) {

        // Handle story view error
        return res.status(500).json({ message: "story view error" })
    }
}


// Controller to get story by username
export const getStoryByUserName=async (req,res)=>{
    try {

        // Get username from params
        const userName=req.params.userName

        // Find user by username
        const user=await User.findOne({userName})

        // Check if user exists
        if(!user){
             return res.status(400).json({ message: "user not found" })
        }

        // Find stories of that user
        const story=await Story.find({
            author:user._id
        }).populate("viewers author")

         // Send user's stories response
         return res.status(200).json(story)

    } catch (error) {

         // Handle get story by username error
         return res.status(500).json({ message: "story get by userName error" })
    }
}

// Controller to get all stories of following users
export const getAllStories=async (req,res)=>{
    try {

        // Find current user
        const currentUser=await User.findById(req.userId)

        // Get ids of users that current user follows
        const followingIds=currentUser.following

        // Find stories uploaded by following users
        const stories=await Story.find({
            author:{$in:followingIds}
        }).populate("viewers author")
           .sort({createdAt:-1})

           // Send all following users stories
           return res.status(200).json(stories)


    } catch (error) {

           // Handle get all stories error
           return res.status(500).json({ message: "All story get error" })
    }
}

// Story delete controller
export const deleteStory = async (req, res) => {
    try {

        // URL se storyId le raha hai
        const { storyId } = req.params

        // Database me story find kar raha hai
        const story = await Story.findById(storyId)

        // Agar story nahi mili
        if (!story) {
            return res.status(404).json({
                message: "Story not found"
            })
        }

        // Sirf owner hi story delete kar sakta hai
        if (story.author.toString() !== req.userId) {
            return res.status(403).json({
                message: "You can delete only your own story"
            })
        }

        // Story delete kar raha hai
        await Story.findByIdAndDelete(storyId)

        // User ke stories array se bhi story id remove kar raha hai
        await User.findByIdAndUpdate(req.userId, {
            $pull: { stories: storyId }
        })

        // Success response
        return res.status(200).json({
            message: "Story deleted successfully"
        })

    } catch (error) {

        return res.status(500).json({
            message: `delete story error ${error}`
        })

    }
}
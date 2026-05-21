// Import models
import User from "../models/user.model.js"
import Post from "../models/post.model.js"
import Loop from "../models/loop.model.js"
import Story from "../models/story.model.js"

// Delete account controller
export const deleteAccount = async (req, res) => {
    try {

        // Logged in user id
        const userId = req.userId

        // User ki sari posts delete
        await Post.deleteMany({ author: userId })

        // User ki sari loops/reels delete
        await Loop.deleteMany({ author: userId })

        // User ki sari stories delete
        await Story.deleteMany({ author: userId })

        // User account delete
        await User.findByIdAndDelete(userId)

        // Logout cookie remove
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })

        // Success response
        return res.status(200).json({
            message: "Account deleted successfully"
        })

    } catch (error) {

        return res.status(500).json({
            message: `delete account error ${error}`
        })

    }
}
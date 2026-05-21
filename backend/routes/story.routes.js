// Import express package
import express from "express"

// Import authentication middleware
import isAuth from "../middlewares/isAuth.js"

// Import multer upload middleware
import { upload } from "../middlewares/multer.js"

// Import story controller functions
import {
    deleteStory, // Story delete controller import
    getAllStories,
    getStoryByUserName,
    uploadStory,
    viewStory
} from "../controllers/story.controllers.js"

// Create express router
const storyRouter = express.Router()

// Route to upload story with media
storyRouter.post(
    "/upload",
    isAuth,
    upload.single("media"),
    uploadStory
)

// Route to get stories by username
storyRouter.get(
    "/getByUserName/:userName",
    isAuth,
    getStoryByUserName
)

// Route to get all stories from following users
storyRouter.get(
    "/getAll",
    isAuth,
    getAllStories
)

// Route to view story
storyRouter.get(
    "/view/:storyId",
    isAuth,
    viewStory
)

// Route to delete story
// Sirf story owner hi delete kar sakta hai
storyRouter.delete(
    "/delete/:storyId",
    isAuth,
    deleteStory
)

// Export router
export default storyRouter
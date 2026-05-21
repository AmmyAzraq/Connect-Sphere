// Import express package
import express from "express"

// Import authentication middleware
import isAuth from "../middlewares/isAuth.js"

// Import multer upload middleware
import { upload } from "../middlewares/multer.js"

// Import loop controller functions
import {
    comment,
    deleteLoop, // Loop delete controller import
    getAllLoops,
    like,
    uploadLoop
} from "../controllers/loop.controllers.js"

// Create express router
const loopRouter = express.Router()

// Route to upload loop with media
loopRouter.post(
    "/upload",
    isAuth,
    upload.single("media"),
    uploadLoop
)

// Route to get all loops
loopRouter.get(
    "/getAll",
    isAuth,
    getAllLoops
)

// Route to like or unlike loop
loopRouter.get(
    "/like/:loopId",
    isAuth,
    like
)

// Route to comment on loop
loopRouter.post(
    "/comment/:loopId",
    isAuth,
    comment
)

// Route to delete loop/reel
// Sirf loop owner hi delete kar sakta hai
loopRouter.delete(
    "/delete/:loopId",
    isAuth,
    deleteLoop
)

// Export router
export default loopRouter
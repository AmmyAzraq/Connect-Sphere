// Import express package
import express from "express"

// Import authentication middleware
import isAuth from "../middlewares/isAuth.js"

// Import multer upload middleware
import { upload } from "../middlewares/multer.js"

// Import message controller functions
import {
    deleteMessage,
    getAllMessages,
    getPrevUserChats,
    sendMessage
} from "../controllers/message.controllers.js"


// Create express router
const messageRouter = express.Router()


// Route to send message with optional image
messageRouter.post(
    "/send/:receiverId",
    isAuth,
    upload.single("image"),
    sendMessage
)


// Route to get all messages between users
messageRouter.get(
    "/getAll/:receiverId",
    isAuth,
    getAllMessages
)


// Route to get previous chat users
messageRouter.get(
    "/prevChats",
    isAuth,
    getPrevUserChats
)


// Route to delete message
messageRouter.delete(
    "/delete/:messageId",
    isAuth,
    deleteMessage
)


// Export router
export default messageRouter
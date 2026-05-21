// Import function to upload image on Cloudinary
import uploadOnCloudinary from "../config/cloudinary.js";

// Import Conversation model
import Conversation from "../models/conversation.model.js";

// Import Message model
import Message from "../models/message.model.js";

// Import socket functions for real-time messaging
import { getSocketId, io } from "../socket.js";

// Controller to send message
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.userId
        const receiverId = req.params.receiverId
        const { message } = req.body

        let image;

        if (req.file) {
            image = await uploadOnCloudinary(req.file.path)
        }

        const newMessage = await Message.create({
            sender: senderId,
            receiver: receiverId,
            message,
            image
        })

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
                messages: [newMessage._id]
            })
        } else {
            conversation.messages.push(newMessage._id)
            await conversation.save()
        }

        const receiverSocketId = getSocketId(receiverId)

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        return res.status(200).json(newMessage)

    } catch (error) {
        return res.status(500).json({ message: `send Message error ${error}` })
    }
}

// Controller to get all messages between two users
export const getAllMessages = async (req, res) => {
    try {
        const senderId = req.userId
        const receiverId = req.params.receiverId

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages")

        return res.status(200).json(conversation?.messages || [])

    } catch (error) {
        return res.status(500).json({ message: `get Message error ${error}` })
    }
}

// Controller to delete message
export const deleteMessage = async (req, res) => {
    try {
        const currentUserId = req.userId
        const { messageId } = req.params

        const message = await Message.findById(messageId)

        if (!message) {
            return res.status(404).json({
                message: "Message not found"
            })
        }

        // Sirf sender apna message delete kar sakta hai
        if (message.sender.toString() !== currentUserId.toString()) {
            return res.status(403).json({
                message: "You can delete only your own message"
            })
        }

        // Conversation ke messages array se bhi message id remove karo
        await Conversation.updateOne(
            { messages: messageId },
            { $pull: { messages: messageId } }
        )

        // Message collection se message delete karo
        await Message.findByIdAndDelete(messageId)

        // Receiver ko real-time update bhejne ke liye
        const receiverSocketId = getSocketId(message.receiver.toString())

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageDeleted", messageId)
        }

        return res.status(200).json({
            message: "Message deleted successfully",
            deletedMessageId: messageId
        })

    } catch (error) {
        return res.status(500).json({
            message: `delete Message error ${error}`
        })
    }
}

// Controller to get previous user chats
export const getPrevUserChats = async (req, res) => {
    try {
        const currentUserId = req.userId

        const conversations = await Conversation.find({
            participants: currentUserId
        }).populate("participants").sort({ updatedAt: -1 })

        const userMap = {}

        conversations.forEach(conv => {
            conv.participants.forEach(user => {
                if (user._id != currentUserId) {
                    userMap[user._id] = user
                }
            });
        });

        const previousUsers = Object.values(userMap)

        return res.status(200).json(previousUsers)

    } catch (error) {
        return res.status(500).json({ message: `prev user error ${error}` })
    }
}
// Import delete routes
import deleteRouter from "./routes/delete.route.js"

// Import express package
import express from "express"

// Import dotenv package
import dotenv from "dotenv"

// Import database connection function
import connectDb from "./config/db.js"

// Import cookie parser middleware
import cookieParser from "cookie-parser"

// Import cors package
import cors from "cors"

// Import auth routes
import authRouter from "./routes/auth.routes.js"

// Import user routes
import userRouter from "./routes/user.routes.js"

// Import post routes
import postRouter from "./routes/post.routes.js"

// Import loop routes
import loopRouter from "./routes/loop.routes.js"

// Import story routes
import storyRouter from "./routes/story.routes.js"

// Import message routes
import messageRouter from "./routes/message.routes.js"

// Import app and server from socket file
import { app, server } from "./socket.js"

// Load environment variables
dotenv.config()

// Set server port
const port = process.env.PORT || 5000

// Enable CORS for frontend
app.use(cors({
    origin: ["http://localhost:5173", "https://connect-sphere-azraq.vercel.app",],
    credentials: true
}))

// Parse JSON request body
app.use(express.json())

// Parse cookies from request
app.use(cookieParser())

// Auth API routes
app.use("/api/auth", authRouter)

// User API routes
app.use("/api/user", userRouter)

// Post API routes
app.use("/api/post", postRouter)

// Loop API routes
app.use("/api/loop", loopRouter)

// Story API routes
app.use("/api/story", storyRouter)

// Message API routes
app.use("/api/message", messageRouter)

// Delete account API routes
app.use("/api/delete", deleteRouter)

app.use("/api/user", deleteRouter)

// Start server
server.listen(port, () => {

    // Connect database
    connectDb()

    // Server start message
    console.log("server started")
})
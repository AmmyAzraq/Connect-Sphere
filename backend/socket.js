// Import http package
import http from "http"

// Import express package
import express from "express"

// Import Socket.IO Server
import { Server } from "socket.io"

// Create express app
const app=express()

// Create HTTP server using express app
const server=http.createServer(app)

// Create Socket.IO server
const io=new Server(server,{

    // Configure CORS for socket connection
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"]
    }
})

// Object to store online users and their socket ids
const userSocketMap={}

// Function to get socket id of a user
export const getSocketId=(receiverId)=>{

// Return socket id using receiver user id
return userSocketMap[receiverId]
}

// Listen when a user connects
io.on("connection",(socket)=>{

   // Get user id from socket query
   const userId=socket.handshake.query.userId

   // Store user socket id if user exists
   if(userId!=undefined){
    userSocketMap[userId]=socket.id
   }

 // Send all online users to connected clients
 io.emit('getOnlineUsers',Object.keys(userSocketMap))  


// Listen when user disconnects
socket.on('disconnect',()=>{

    // Remove user from online users map
    delete userSocketMap[userId]

     // Update online users list for all clients
     io.emit('getOnlineUsers',Object.keys(userSocketMap))  
})

})


// Export app, io server, and HTTP server
export {app,io, server}



// Import mongoose package
import mongoose from "mongoose";

// Create message schema
const messageSchema=new mongoose.Schema({

    // Sender user details
sender:{

    // Store sender user id
    type:mongoose.Schema.Types.ObjectId,

    // Reference to User model
    ref:"User"
},

// Receiver user details
receiver:{

    // Store receiver user id
    type:mongoose.Schema.Types.ObjectId,

    // Reference to User model
    ref:"User" 
},

// Text message content
message:{

   // Message type string
   type:String 
},

// Image URL sent in message
image:{

    // Image type string
    type:String  
}

},
{
    // Automatically add createdAt and updatedAt fields
    timestamps:true
})

// Create Message model
const Message=mongoose.model("Message",messageSchema)

// Export model
export default Message
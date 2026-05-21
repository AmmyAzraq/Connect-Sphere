// Import mongoose package
import mongoose from "mongoose";

// Create conversation schema
const conversationSchema=new mongoose.Schema({

    // Array of conversation participants
    participants:[
       {
        // Store user id
        type:mongoose.Schema.Types.ObjectId,

        // Reference to User model
        ref:"User"
    }
    ],

    // Array of messages
    messages:[
        {
        // Store message id
        type:mongoose.Schema.Types.ObjectId,

        // Reference to Message model
        ref:"Message" 
    } 
    ]

},
{
    // Automatically add createdAt and updatedAt fields
    timestamps:true
})

// Create Conversation model
const Conversation=mongoose.model("Conversation",conversationSchema)

// Export model
export default Conversation
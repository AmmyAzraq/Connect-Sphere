// Import mongoose package
import mongoose from "mongoose"

// Create notification schema
const notificationSchema=new mongoose.Schema({

    // Sender user details
    sender:{

        // Store sender user id
        type:mongoose.Schema.Types.ObjectId,

        // Reference to User model
        ref:"User",

        // Sender is required
        required:true   
    },

     // Receiver user details
     receiver:{

        // Store receiver user id
        type:mongoose.Schema.Types.ObjectId,

        // Reference to User model
        ref:"User",

        // Receiver is required
        required:true   
    },

    // Notification type
    type:{

        // Type string
        type:String,

        // Allowed notification types
        enum:["like","comment","follow"],

        // Type is required
        required:true
    },

    // Notification message
    message:{

        // Message type string
        type:String, 

        // Message is required
        required:true
    },

    // Related post id
    post:{

           // Store post id
           type:mongoose.Schema.Types.ObjectId,

           // Reference to Post model
           ref:"Post",  
    },

    // Related loop id
    loop:{

       // Store loop id
        type:mongoose.Schema.Types.ObjectId,

        // Reference to Loop model
        ref:"Loop",  
    },

// Notification read status
isRead:{

    // Boolean value
    type:Boolean,

    // Default value is false
    default:false
}

},
{
    // Automatically add createdAt and updatedAt fields
    timestamps:true
})


// Create Notification model
const Notification=mongoose.model("Notification",notificationSchema)

// Export model
export default Notification
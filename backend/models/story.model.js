// Import mongoose package
import mongoose from "mongoose";

// Create story schema
const storySchema=new mongoose.Schema({

    // Story author details
    author: {

            // Store user id
            type: mongoose.Schema.Types.ObjectId,

            // Reference to User model
            ref: "User",

            // Author is required
            required: true
        },

    // Media type of story
    mediaType:{

        // Media type string
        type:String,

        // Allowed media types
        enum:["image","video"],

        // Media type is required
        required:true
    },

    // Media URL of story
    media:{

        // Media type string
        type:String,

        // Media is required
        required:true
    },

    // Array of viewers
    viewers:[
        {

            // Store viewer user id
            type: mongoose.Schema.Types.ObjectId,

            // Reference to User model
            ref: "User",

            // Viewer is required
            required: true
        }
    ]
    ,

    // Story creation time
    createdAt:{

        // Date type
        type:Date,

        // Default current date and time
        default:Date.now(),

        // Automatically delete story after 24 hours (86400 seconds)
        expires:86400
    }

},
{
    // Automatically add createdAt and updatedAt fields
    timestamps:true
})

// Create Story model
const Story=mongoose.model("Story",storySchema)

// Export model
export default Story
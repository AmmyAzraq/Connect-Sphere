// Import mongoose package
import mongoose from "mongoose";

// Create post schema
const postSchema = new mongoose.Schema({

    // Post author details
    author: {

        // Store user id
        type: mongoose.Schema.Types.ObjectId,

        // Reference to User model
        ref: "User",

        // Author is required
        required: true
    },

    // Media type of post
    mediaType: {

        // Media type string
        type: String,

        // Allowed media types
        enum: ["image", "video"],

        // Media type is required
        required: true
    },

    // Media URL of post
    media: {

        // Media type string
        type: String,

        // Media is required
        required: true
    },

    // Caption of post
    caption:{
        type:String
    },

    // Array of likes
    likes:[
        {

        // Store user id who liked the post
        type: mongoose.Schema.Types.ObjectId,

        // Reference to User model
        ref: "User",
        }
    ],

    // Array of comments
    comments:[
        {

        // Comment author details
        author:{

        // Store user id
        type: mongoose.Schema.Types.ObjectId,

        // Reference to User model
        ref: "User"
    },

        // Comment message
        message:{
            type:String
        }
        }
    ]

},
{
    // Automatically add createdAt and updatedAt fields
    timestamps: true
})

// Create Post model
const Post = mongoose.model("Post",postSchema)

// Export model
export default Post
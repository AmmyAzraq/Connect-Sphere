// Import mongoose package
import mongoose from "mongoose";

// Create loop schema
const loopSchema=new mongoose.Schema({

    // Loop author details
    author: {

            // Store user id
            type: mongoose.Schema.Types.ObjectId,

            // Reference to User model
            ref: "User",

            // Author is required
            required: true
        },

        // Media URL of loop
        media: {

            // Media type string
            type: String,

            // Media is required
            required: true
        },

        // Caption of loop
        caption:{
            type:String
        },

        // Array of likes
        likes:[
            {

            // Store user id who liked the loop
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
    timestamps:true
})

// Create Loop model
const Loop=mongoose.model("Loop",loopSchema)

// Export model
export default Loop
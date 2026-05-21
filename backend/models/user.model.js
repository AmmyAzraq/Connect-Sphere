// Import mongoose package
import mongoose from "mongoose";

// Create user schema
const userSchema=new mongoose.Schema({

    // User full name
    name:{

        // Name type string
        type:String,

        // Name is required
        required:true
    },

    // Username of user
    userName:{

        // Username type string
        type:String,

        // Username is required
        required:true,

        // Username must be unique
        unique:true
    },

    // User email
    email:{

        // Email type string
        type:String,

        // Email is required
        required:true,

        // Email must be unique
        unique:true
    },

     // User password
     password:{

        // Password type string
        type:String,

        // Password is required
        required:true
    },

    // Profile image URL
    profileImage:{
        type:String
    },

     // User bio
     bio:{
        type:String
    },

     // User profession
     profession:{
        type:String
    },

    // User gender
    gender:{
        type:String
    },

    // Array of followers
    followers:[
    {

        // Store follower user id
        type:mongoose.Schema.Types.ObjectId,

        // Reference to User model
        ref:"User"
        }
    ],

    // Array of following users
    following:[
    {

        // Store following user id
        type:mongoose.Schema.Types.ObjectId,

        // Reference to User model
        ref:"User"
        }
    ],

    // Array of user posts
    posts:[
        {

          // Store post id
          type:mongoose.Schema.Types.ObjectId,

          // Reference to Post model
          ref:"Post"
        }
    ],

    // Array of saved posts
    saved:[
         {

          // Store saved post id
          type:mongoose.Schema.Types.ObjectId,

          // Reference to Post model
          ref:"Post"
        }
    ],

    // Array of loops
    loops:[
         {

          // Store loop id
          type:mongoose.Schema.Types.ObjectId,

          // Reference to Loop model
          ref:"Loop"
        }
    ],

    // Current story id
    story: {

          // Store story id
          type:mongoose.Schema.Types.ObjectId,

          // Reference to Story model
          ref:"Story"
        },

    // OTP for password reset
    resetOtp:{

        // OTP type string
        type:String
    } ,

    // OTP expiry time
    otpExpires:{

        // Date type
        type:Date
    } ,

    // OTP verification status
    isOtpVerified:{

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

// Create User model
const User=mongoose.model("User",userSchema)

// Export model
export default User
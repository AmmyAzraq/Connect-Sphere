// Import function to upload image on Cloudinary
import uploadOnCloudinary from "../config/cloudinary.js"

// Import Notification model
import Notification from "../models/notification.model.js"

// Import User model
import User from "../models/user.model.js"

// Import socket functions for real-time notifications
import { getSocketId, io } from "../socket.js";

// Controller to get current logged in user
export const getCurrentUser=async (req,res)=>{
    try {

        // Get current user id from middleware
        const userId=req.userId

        // Find user and populate related fields
        const user=await User.findById(userId).populate("posts loops posts.author posts.comments story following")

        // Check if user exists
        if(!user){
            return res.status(400).json({message:"user not found"})
        }

        // Send current user data
        return res.status(200).json(user)

    } catch (error) {

        // Handle get current user error
        return res.status(500).json({message:`get current user error ${error}`})
    }
}

// Controller to get suggested users
export const suggestedUsers=async (req,res)=>{
    try {

        // Find all users except current user
        const users=await User.find({
            _id:{$ne:req.userId}
        }).select("-password")

        // Send suggested users
        return res.status(200).json(users)

    } catch (error) {

         // Handle suggested users error
         return res.status(500).json({message:`get suggested user error ${error}`})
    }
}

// Controller to edit profile
export const editProfile=async (req,res)=>{
    try {

       // Get updated profile data from request body
       const {name,userName,bio,profession ,gender}=req.body

       // Find current user
       const user=await User.findById(req.userId).select("-password")

       // Check if user exists
       if(!user){
        return res.status(400).json({message:"user not found"})
       }

       // Check if username already exists
       const sameUserWithUserName=await User.findOne({userName}).select("-password")

       // Prevent duplicate usernames
       if(sameUserWithUserName && sameUserWithUserName._id!=req.userId){
        return res.status(400).json({message:"userName already exist"})
       }

       // Variable to store uploaded profile image URL
       let profileImage;

       // Check if profile image file exists
       if(req.file){

        // Upload image to Cloudinary
        profileImage=await uploadOnCloudinary(req.file.path)
       }

       // Update user details
       user.name=name
       user.userName=userName

       // Update profile image if uploaded
       if(profileImage){
user.profileImage=profileImage
       }

       // Update bio
       user.bio=bio

       // Update profession
       user.profession=profession

       // Update gender
       user.gender=gender

       // Save updated user
       await user.save()

       // Send updated user response
       return res.status(200).json(user)

    } catch (error) {

         // Handle edit profile error
         return res.status(500).json({message:`edit profile error ${error}`})
    }
}

// Controller to get profile by username
export const getProfile = async (req, res) => {
  try {

    // Get username from params
    const userName = req.params.userName;
 
    // Find user by username and populate related fields
    const user = await User.findOne({ userName })
    .select("-password")
    .populate("posts loops followers following")

    // Check if user exists
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    // Send user profile response
    return res.status(200).json(user);

  } catch (error) {

    // Handle get profile error
    return res.status(500).json({ message: `get profile error ${error}` });
  }
};


// Controller to follow or unfollow user
export const follow=async (req,res)=>{
  try {

    // Get current user id
    const currentUserId=req.userId

    // Get target user id from params
    const targetUserId=req.params.targetUserId

    // Check if target user exists
    if(!targetUserId){
      return res.status(400).json({message:"target user is not found"})
    }

    // Prevent user from following themselves
    if(currentUserId==targetUserId){
return res.status(400).json({message:"you can not follow yourself."})
    }

    // Find current user
const currentUser=await User.findById(currentUserId)

    // Find target user
const targetUser=await User.findById(targetUserId)

    // Check if already following
const isFollowing=currentUser.following.includes(targetUserId)

    // If already following, unfollow
if(isFollowing){

  // Remove target user from following list
  currentUser.following=currentUser.following.filter(id=>id.toString()!=targetUserId)

  // Remove current user from followers list
  targetUser.followers=targetUser.followers.filter(id=>id.toString()!=currentUserId)

  // Save updated users
  await currentUser.save()
   await targetUser.save()

   // Send unfollow response
   return res.status(200).json({
    following:false,
    message:"unfollow successfully"
   })

}else{

  // Add target user to following list
  currentUser.following.push(targetUserId)

  // Add current user to followers list
 targetUser.followers.push(currentUserId)

   // Send notification if different users
   if (currentUser._id !=  targetUser._id) {

                             // Create follow notification
                             const notification = await Notification.create({
                                 sender:currentUser._id,
                                 receiver: targetUser._id,
                                 type: "follow",
                                 message:"started following you"
                             })

                             // Populate notification details
                             const populatedNotification = await Notification.findById(notification._id).populate("sender receiver")

                             // Get receiver socket id
                             const receiverSocketId=getSocketId(targetUser._id)

                             // Send real-time notification if receiver is online
                             if(receiverSocketId){
                                 io.to(receiverSocketId).emit("newNotification",populatedNotification)
                             }
                         
                         }

  // Save updated users
  await currentUser.save()
   await targetUser.save()

   // Send follow response
    return res.status(200).json({
    following:true,
    message:"follow successfully"
   })
}


  } catch (error) {

    // Handle follow error
    return res.status(500).json({message:`follow error ${error}`})
  }
}


// Controller to get following list
export const followingList=async (req,res)=>{
  try {

    // Find current user
    const result=await User.findById(req.userId)

    // Send following list
    return res.status(200).json(result?.following)

  } catch (error) {

     // Handle following list error
     return res.status(500).json({message:`following error ${error}`})
  }
}


// Controller to search users
export const search=async (req,res)=>{
  try {

    // Get keyword from query params
    const keyWord=req.query.keyWord

    // Check if keyword exists
    if(!keyWord){
      return res.status(400).json({message:"keyword is required"})
    }

    // Search users by username or name
    const users=await User.find({
      $or:[
        {userName:{$regex:keyWord,$options:"i"}},
        {name:{$regex:keyWord,$options:"i"}}
      ]
    }).select("-password")

    // Send searched users
    return res.status(200).json(users)

  } catch (error) {

    // Handle search error
    return res.status(500).json({message:`search error ${error}`})
  }
}

// Controller to get all notifications
export const getAllNotifications=async (req,res)=>{
  try {

    // Find notifications for current user
    const notifications=await Notification.find({
      receiver:req.userId
    }).populate("sender receiver post loop").sort({createdAt:-1})

    // Send notifications response
    return res.status(200).json(notifications)

  } catch (error) {

     // Handle get notifications error
     return res.status(500).json({message:`get notification error ${error}`})
  }
}

// Controller to mark notifications as read
export const markAsRead=async (req,res)=>{
  try {

    // Get notification id from request body
    const {notificationId}=req.body

   // Check if multiple notification ids are passed
   if (Array.isArray(notificationId)) {

      // Mark multiple notifications as read
      await Notification.updateMany(
        { _id: { $in: notificationId }, receiver: req.userId },
        { $set: { isRead: true } }
      );

    } else {

      // Mark single notification as read
      await Notification.findOneAndUpdate(
        { _id: notificationId, receiver: req.userId },
        { $set: { isRead: true } }
      );
    }

    // Send success response
    return res.status(200).json({message:"marked as read"})

  } catch (error) {

    // Handle mark as read error
    return res.status(500).json({message:`read notification error ${error}`})
  }
}
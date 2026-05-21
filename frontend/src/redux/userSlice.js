// Import createSlice function from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit"

// Creating user slice
const userSlice = createSlice({

    // Name of slice
    name: "user",

    // Initial state of user slice
    initialState: {

        // Stores current logged-in user data
        userData: null,

        // Stores suggested users list
        suggestedUsers: null,

        // Stores profile data of viewed user
        profileData: null,

        // Stores following users ids
        following: [],

        // Stores searched users data
        searchData: null,

        // Stores notifications data
        notificationData: []
    },

    // Reducer functions
    reducers: {

        // Function to store current user data
        setUserData: (state, action) => {

            // Update userData state
            state.userData = action.payload
        },

        // Function to store suggested users
        setSuggestedUsers: (state, action) => {

            // Update suggestedUsers state
            state.suggestedUsers = action.payload
        },

        // Function to store profile data
        setProfileData: (state, action) => {

            // Update profileData state
            state.profileData = action.payload
        },

        // Function to store search results
        setSearchData: (state, action) => {

            // Update searchData state
            state.searchData = action.payload
        },

        // Function to store notifications
        setNotificationData: (state, action) => {

            // Update notificationData state
            state.notificationData = action.payload
        },

        // Function to store following users
        setFollowing: (state, action) => {

            // Update following state
            state.following = action.payload
        },

        // Function to follow/unfollow a user
        toggleFollow: (state, action) => {

            // Getting target user id
            const targetUserId = action.payload

            // Check if already following
            if (state.following.includes(targetUserId)) {

                // Remove user from following list
                state.following = state.following.filter(id => id != targetUserId)

            } else {

                // Add user to following list
                state.following.push(targetUserId)
            }
        }
    }

})

// Exporting actions
export const {
    setUserData,
    setSuggestedUsers,
    setProfileData,
    toggleFollow,
    setFollowing,
    setSearchData,
    setNotificationData
} = userSlice.actions

// Exporting reducer
export default userSlice.reducer
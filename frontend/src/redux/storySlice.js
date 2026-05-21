// Import createSlice function from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit"

// Creating story slice
const storySlice = createSlice({

    // Name of slice
    name: "post",

    // Initial state of story slice
    initialState: {

        // Stores single story data
        storyData: null,

        // Stores all stories list
        storyList: null,

        // Stores current logged-in user's story
        currentUserStory: null
    },

    // Reducer functions
    reducers: {

        // Function to store single story data
        setStoryData: (state, action) => {

            // Update storyData state
            state.storyData = action.payload
        },

        // Function to store all stories list
        setStoryList: (state, action) => {

            // Update storyList state
            state.storyList = action.payload
        },

        // Function to store current user's story
        setCurrentUserStory: (state, action) => {

            // Update currentUserStory state
            state.currentUserStory = action.payload
        }
    }

})

// Exporting actions
export const {
    setStoryData,
    setStoryList,
    setCurrentUserStory
} = storySlice.actions

// Exporting reducer
export default storySlice.reducer
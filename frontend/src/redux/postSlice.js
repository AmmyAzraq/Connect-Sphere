// Import createSlice function from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit"

// Creating post slice
const postSlice = createSlice({

    // Name of slice
    name: "post",

    // Initial state of post slice
    initialState: {

        // Stores all posts data
        postData: null,
    },

    // Reducer functions
    reducers: {

        // Function to update posts data
        setPostData: (state, action) => {

            // Store payload data into postData
            state.postData = action.payload
        }
    }

})

// Exporting action
export const { setPostData } = postSlice.actions

// Exporting reducer
export default postSlice.reducer
// Import configureStore function from Redux Toolkit
import { configureStore } from "@reduxjs/toolkit"

// Import user slice reducer
import userSlice from "./userSlice"

// Import post slice reducer
import postSlice from "./postSlice"

// Import story slice reducer
import storySlice from "./storySlice"

// Import loop slice reducer
import loopSlice from "./loopSlice"

// Import message slice reducer
import messageSlice from "./messageSlice"

// Import socket slice reducer
import socketSlice from "./socketSlice"

// Creating Redux store
const store = configureStore({

    // Registering all reducers
    reducer: {

        // User related state
        user: userSlice,

        // Post related state
        post: postSlice,

        // Story related state
        story: storySlice,

        // Loop related state
        loop: loopSlice,

        // Message/chat related state
        message: messageSlice,

        // Socket and online users related state
        socket: socketSlice
    }
})

// Exporting Redux store
export default store
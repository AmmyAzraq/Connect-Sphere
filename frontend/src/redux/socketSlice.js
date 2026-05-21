// Import createSlice function from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit"

// Creating socket slice
const socketSlice = createSlice({

    // Name of slice
    name: "socket",

    // Initial state of socket slice
    initialState: {

        // Stores socket connection object
        socket: null,

        // Stores currently online users
        onlineUsers: null
    },

    // Reducer functions
    reducers: {

        // Function to store socket connection
        setSocket: (state, action) => {

            // Update socket state
            state.socket = action.payload
        },

        // Function to store online users list
        setOnlineUsers: (state, action) => {

            // Update online users state
            state.onlineUsers = action.payload
        }
    }

})

// Exporting actions
export const {
    setSocket,
    setOnlineUsers
} = socketSlice.actions

// Exporting reducer
export default socketSlice.reducer
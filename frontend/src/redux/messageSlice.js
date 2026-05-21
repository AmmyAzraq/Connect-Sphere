// Import createSlice function from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit"

// Creating message slice
const messageSlice = createSlice({

    // Name of slice
    name: "message",

    // Initial state of message slice
    initialState: {

        // Stores currently selected chat user
        selectedUser: null,

        // Stores all chat messages
        messages: [],

        // Stores previous chat users list
        prevChatUsers: null
    },

    // Reducer functions
    reducers: {

        // Function to store selected chat user
        setSelectedUser: (state, action) => {

            // Update selected user
            state.selectedUser = action.payload
        },

        // Function to store chat messages
        setMessages: (state, action) => {

            // Update messages array
            state.messages = action.payload
        },

        // Function to store previous chat users
        setPrevChatUsers: (state, action) => {

            // Update previous chat users list
            state.prevChatUsers = action.payload
        },

        // Function to delete single message from messages array
        deleteMessageFromState: (state, action) => {

            // Remove message whose id matches deleted message id
            state.messages = state.messages.filter(
                (msg) => msg._id !== action.payload
            )
        }
    }

})

// Exporting actions
export const {
    setSelectedUser,
    setMessages,
    setPrevChatUsers,
    deleteMessageFromState
} = messageSlice.actions

// Exporting reducer
export default messageSlice.reducer
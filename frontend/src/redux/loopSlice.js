// Import createSlice function from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit"

// Creating loop slice
const loopSlice = createSlice({

    // Name of slice
    name: "loop",

    // Initial state of loop slice
    initialState: {

        // Array to store loop data
        loopData: [],
    },

    // Reducer functions
    reducers: {

        // Function to update loop data in Redux store
        setLoopData: (state, action) => {

            // Store payload data into loopData
            state.loopData = action.payload
        }
    }

})

// Exporting action
export const { setLoopData } = loopSlice.actions

// Exporting reducer
export default loopSlice.reducer
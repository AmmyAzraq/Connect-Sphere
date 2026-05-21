// Import mongoose
import mongoose from "mongoose";

// Function to connect database
const connectDb = async () => {
    try {

        // Connect MongoDB using environment variable URL
        await mongoose.connect(process.env.MONGODB_URL)

        // Success message
        console.log("db connected")

    } catch (error) {

        // Error message if database connection fails
        console.log(`db error ${error}`)
    }
}

// Export database connection function
export default connectDb
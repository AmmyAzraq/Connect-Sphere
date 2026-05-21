// Import jsonwebtoken package
import jwt from "jsonwebtoken"

// Function to generate JWT token
const genToken = async (userId) => {
try {

    // Create token with userId payload
    const token = await jwt.sign(

        // Data stored inside token
        { userId },

        // Secret key from environment variables
        process.env.JWT_SECRET,

        // Token expiration time
        { expiresIn: "10y" }
    )

    // Return generated token
    return token

} catch (error) {

    // Return error response if token generation fails
    return res.status(500).json(`gen token error ${error}`)
}
}

// Export function
export default genToken
// Import Cloudinary v2
import { v2 as cloudinary } from 'cloudinary'

// Import file system module
import fs from "fs"

// Function to upload file on Cloudinary
const uploadOnCloudinary = async (file) => {
  try {

    // Configure Cloudinary using environment variables
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    // Upload file to Cloudinary
    const result = await cloudinary.uploader
      .upload(file, {

        // Automatically detect file type (image/video/etc.)
        resource_type: 'auto',
      })

    // Delete file from local storage after successful upload
    fs.unlinkSync(file)

    // Return uploaded file secure URL
    return result.secure_url

  } catch (error) {

    // Delete local file if upload fails
    fs.unlinkSync(file)

    // Print error in console
    console.log(error)
  }

}

// Export function
export default uploadOnCloudinary
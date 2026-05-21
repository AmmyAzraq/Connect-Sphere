// Import multer package
import multer from "multer"

// Configure storage settings
const storage=multer.diskStorage({

 // Set destination folder for uploaded files
 destination:(req,file,cb)=>{
    cb(null,"./public")
 },

 // Set uploaded file name
 filename:(req,file,cb)=>{
    cb(null,file.originalname)
 }
})

// Create multer upload middleware using storage configuration
export const upload=multer({storage})
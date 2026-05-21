// Import React and useState hook
import React, { useState } from 'react'

// Import back arrow icon
import { MdOutlineKeyboardBackspace } from "react-icons/md";

// Import navigation hook
import { useNavigate } from 'react-router-dom';

// Import plus upload icon
import { FiPlusSquare } from "react-icons/fi";

// Import useRef hook
import { useRef } from 'react';

// Import custom video player component
import VideoPlayer from '../components/VideoPlayer';

// Import axios for API requests
import axios from 'axios';

// Import backend server URL
import { serverUrl } from '../App';

// Import Redux hooks
import { useDispatch, useSelector } from 'react-redux';

// Import Redux action for posts
import { setPostData } from '../redux/postSlice';

// Import Redux actions for stories
import { setCurrentUserStory, setStoryData } from '../redux/storySlice';

// Import Redux action for loops
import { setLoopData } from '../redux/loopSlice';

// Import loading spinner
import { ClipLoader } from 'react-spinners';

// Import Redux action for user data
import { setUserData } from '../redux/userSlice';

function Upload() {

    // Hook for page navigation
    const navigate = useNavigate()

    // State to store upload type (post/story/loop)
    const [uploadType, setUploadType] = useState("post")

    // State for frontend preview media
    const [frontendMedia, setFrontendMedia] = useState(null)

    // State for backend media file
    const [backendMedia, setBackendMedia] = useState(null)

    // State to store media type (image/video)
    const [mediaType, setMediaType] = useState("")

    // State for caption input
    const [caption, setCaption] = useState("")

    // Reference for hidden media input
    const mediaInput = useRef()

    // Redux dispatch function
    const dispatch = useDispatch()

    // Getting posts data from Redux store
    const { postData } = useSelector(state => state.post)

    // Getting story data from Redux store
    const { storyData } = useSelector(state => state.story)

    // Getting loop data from Redux store
    const { loopData } = useSelector(state => state.loop)

    // Loading state for upload button
    const [loading, setLoading] = useState(false)

    // State for upload error message
    const [errorMsg, setErrorMsg] = useState("")

    // Function to handle selected media
    const handleMedia = (e) => {

        // Getting selected file
        const file = e.target.files[0]

        // Print selected file in console
        console.log(file)

        // Clear old errors
        setErrorMsg("")

        // Allow only MP4 videos
        if (file.type.includes("video") && !file.type.includes("mp4")) {
            setErrorMsg("Only MP4 videos are allowed.")
            return
        }

        // Check if selected file is image
        if (file.type.includes("image")) {
            setMediaType("image")
        } else {

            // Otherwise set media type as video
            setMediaType("video")
        }

        // Store backend file
        setBackendMedia(file)

        // Create frontend preview URL
        setFrontendMedia(URL.createObjectURL(file))
    }

    // Function to upload post
    const uploadPost = async () => {

        try {

            // Creating FormData for media upload
            const formData = new FormData()

            // Add caption
            formData.append("caption", caption)

            // Add media type
            formData.append("mediaType", mediaType)

            // Add media file
            formData.append("media", backendMedia)

            // API request to upload post
            const result = await axios.post(
                `${serverUrl}/api/post/upload`,
                formData,
                { withCredentials: true }
            )

            // Add uploaded post into Redux store
            dispatch(setPostData([...postData, result.data]))

            // Stop loading
            setLoading(false)

            // Navigate to home page
            navigate("/")

        } catch (error) {

            // Print error in console
            console.log(error)

            // Stop loading
            setLoading(false)

            // Generate upload error message
            const msg =
                error?.response?.data?.error?.http_code === 499
                    ? "Upload took too long. Please try a smaller file."
                    : error?.response?.data?.userMessage ||
                    error?.response?.data?.message ||
                    "Upload failed. Try again."

            // Show error message
            setErrorMsg(msg)
        }
    }

    // Function to upload story
    const uploadStory = async () => {

        try {

            // Creating FormData
            const formData = new FormData()

            // Add media type
            formData.append("mediaType", mediaType)

            // Add media file
            formData.append("media", backendMedia)

            // API request to upload story
            const result = await axios.post(
                `${serverUrl}/api/story/upload`,
                formData,
                { withCredentials: true }
            )

            // Store uploaded story in Redux
            dispatch(setCurrentUserStory(result.data))

            // Stop loading
            setLoading(false)

            // Navigate to home page
            navigate("/")

        } catch (error) {

            // Print error in console
            console.log(error)

            // Stop loading
            setLoading(false)

            // Generate upload error message
            const msg =
                error?.response?.data?.error?.http_code === 499
                    ? "Upload took too long. Please try a smaller file."
                    : error?.response?.data?.userMessage ||
                    error?.response?.data?.message ||
                    "Upload failed. Try again."

            // Show error message
            setErrorMsg(msg)
        }
    }

    // Function to upload loop
    const uploadLoop = async () => {

        try {

            // Creating FormData
            const formData = new FormData()

            // Add caption
            formData.append("caption", caption)

            // Add media type
            formData.append("mediaType", mediaType)

            // Add media file
            formData.append("media", backendMedia)

            // API request to upload loop
            const result = await axios.post(
                `${serverUrl}/api/loop/upload`,
                formData,
                { withCredentials: true }
            )

            // Remove socket field from response data
            const { socket, ...cleanData } = result.data

            // Store uploaded loop in Redux
            dispatch(setLoopData([...(loopData || []), cleanData]))

            // Stop loading
            setLoading(false)

            // Navigate to home page
            navigate("/")

            // Print upload result in console
            console.log("RESULT", result.data)

        } catch (error) {

            // Print error in console
            console.log(error)

            // Stop loading
            setLoading(false)

            // Generate upload error message
            const msg =
                error?.response?.data?.error?.http_code === 499
                    ? "Upload took too long. Please try a smaller file."
                    : error?.response?.data?.userMessage ||
                    error?.response?.data?.message ||
                    "Upload failed. Try again."

            // Show error message
            setErrorMsg(msg)

            // Debug logs
            console.log(result.data)
            console.log(loopData)
        }
    }

    // Main upload handler
    const handleUpload = () => {

        // Start loading
        setLoading(true)

        // Clear previous errors
        setErrorMsg("")

        // Upload based on selected type
        if (uploadType == "post") {

            uploadPost()

        } else if (uploadType == "story") {

            uploadStory()

        } else {

            uploadLoop()
        }

        // Check if media is selected
        if (!backendMedia) {

            // Show error if no media selected
            setErrorMsg("Please select media")

            // Stop loading
            setLoading(false)

            return
        }
    }

    return (

       // Main upload page container
<div className='w-full h-[100vh] bg-[#1E2A44] flex flex-col items-center'>

    {/* Header section */}
    <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px]'>

        {/* Back button */}
        <MdOutlineKeyboardBackspace
            className='text-[#F8F8F6] cursor-pointer w-[25px] h-[25px]'
            onClick={() => navigate(`/`)}
        />

        {/* Page title */}
        <h1 className='text-[#F8F8F6] text-[20px] font-semibold'>
            Upload Media
        </h1>
    </div>

    {/* Upload type selection */}
    <div className='w-[90%] max-w-[600px] h-[80px] bg-[#F8F8F6] rounded-full flex justify-around items-center gap-[10px]'>

        {/* Post button */}
        <div
            className={`${uploadType == "post"
                ? "bg-[#1E2A44] text-[#F8F8F6] shadow-2xl shadow-[#1E2A44]"
                : "text-[#1E2A44]"
                } w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-[#1E2A44] rounded-full hover:text-[#F8F8F6] cursor-pointer hover:shadow-2xl hover:shadow-[#1E2A44]`}
            onClick={() => setUploadType("post")}
        >
            Post
        </div>

        {/* Story button */}
        <div
            className={`${uploadType == "story"
                ? "bg-[#1E2A44] text-[#F8F8F6] shadow-2xl shadow-[#1E2A44]"
                : "text-[#1E2A44]"
                } w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-[#1E2A44] rounded-full hover:text-[#F8F8F6] cursor-pointer hover:shadow-2xl hover:shadow-[#1E2A44]`}
            onClick={() => setUploadType("story")}
        >
            Story
        </div>

        {/* Loop button */}
        <div
            className={`${uploadType == "loop"
                ? "bg-[#1E2A44] text-[#F8F8F6] shadow-2xl shadow-[#1E2A44]"
                : "text-[#1E2A44]"
                } w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-[#1E2A44] rounded-full hover:text-[#F8F8F6] cursor-pointer hover:shadow-2xl hover:shadow-[#1E2A44]`}
            onClick={() => setUploadType("loop")}
        >
            Loop
        </div>
    </div>

    {/* Error message */}
    {errorMsg && (
        <div className="text-red-500 mt-4 text-center font-semibold">
            {errorMsg}
        </div>
    )}

    {/* Upload media box */}
    {!frontendMedia &&
        <div
            className='w-[80%] max-w-[500px] h-[250px] bg-[#F8F8F6] border-[#B7BDC6] border-2 flex flex-col items-center justify-center gap-[8px] mt-[15vh] rounded-2xl cursor-pointer hover:bg-[#B7BDC6]'
            onClick={() => mediaInput.current.click()}
        >

            {/* Hidden media input */}
            <input
                type="file"
                accept={uploadType == "loop" ? "video/*" : ""}
                hidden
                ref={mediaInput}
                onChange={handleMedia}
            />

            {/* Upload icon */}
            <FiPlusSquare className='text-[#1E2A44] cursor-pointer w-[25px] h-[25px]' />

            {/* Upload text */}
            <div className='text-[#1E2A44] text-[19px] font-semibold'>
                Upload {uploadType}
            </div>
        </div>
    }

    {/* Preview selected media */}
    {frontendMedia &&
        <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[15vh]'>

            {/* Image preview */}
            {mediaType == "image" &&
                <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[5vh]'>

                    <img src={frontendMedia} alt="" className='h-[60%] rounded-2xl border border-[#B7BDC6]' />

                    {/* Caption input for image */}
                    {uploadType != "story" &&
                        <input
                            type='text'
                            className='w-full border-b-[#B7BDC6] border-b-2 outline-none px-[10px] py-[5px] text-[#F8F8F6] mt-[20px] bg-transparent'
                            placeholder='write caption'
                            onChange={(e) => setCaption(e.target.value)}
                            value={caption}
                        />
                    }

                </div>
            }

            {/* Video preview */}
            {mediaType == "video" &&
                <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[5vh]'>

                    {/* Video player */}
                    <VideoPlayer media={frontendMedia} />

                    {/* Caption input for video */}
                    {uploadType != "story" &&
                        <input
                            type='text'
                            className='w-full border-b-[#B7BDC6] border-b-2 outline-none px-[10px] py-[5px] text-[#F8F8F6] mt-[20px] bg-transparent'
                            placeholder='write caption'
                            onChange={(e) => setCaption(e.target.value)}
                            value={caption}
                        />
                    }

                </div>
            }

        </div>
    }

    {/* Upload button */}
    {frontendMedia &&
        <button
            className='px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] bg-[#F8F8F6] text-[#1E2A44] mt-[50px] cursor-pointer rounded-2xl font-semibold'
            onClick={handleUpload}
        >
            {loading
                ? <ClipLoader size={30} color='#1E2A44' />
                : `Upload ${uploadType}`
            }
        </button>
    }

</div>
    )
}

export default Upload
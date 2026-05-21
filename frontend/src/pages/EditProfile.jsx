// Import React
import React from 'react'

// Import back arrow icon
import { MdOutlineKeyboardBackspace } from "react-icons/md";

// Import Redux hooks
import { useDispatch, useSelector } from 'react-redux';

// Import navigation hook
import { useNavigate } from 'react-router-dom';

// Import default profile image
import dp from "../assets/dp.webp"

// Import useRef hook
import { useRef } from 'react';

// Import useState hook
import { useState } from 'react';

// Import axios for API requests
import axios from 'axios';

// Import backend server URL
import { serverUrl } from '../App';

// Import Redux actions for updating user/profile data
import { setProfileData, setUserData } from '../redux/userSlice';

// Import loader component
import { ClipLoader } from 'react-spinners';

function EditProfile() {

    // Getting current user data from Redux store
    const { userData } = useSelector(state => state.user)

    // Hook for page navigation
    const navigate = useNavigate()

    // Reference for hidden file input
    const imageInput = useRef()

    // State for showing selected image on frontend
    const [frontendImage, setFrontendImage] = useState(userData.profileImage || dp)

    // State for storing selected image file for backend
    const [backendImage, setBackendImage] = useState(null)

    // States for profile form fields
    const [name, setName] = useState(userData.name || "")
    const [userName, setUserName] = useState(userData.userName || "")
    const [bio, setBio] = useState(userData.bio || "")
    const [profession, setProfession] = useState(userData.profession || "")
    const [gender, setGender] = useState(userData.gender || "")

    // Redux dispatch function
    const dispatch = useDispatch()

    // Loading state for save button
    const [loading, setLoading] = useState(false)

    // Function to handle profile image selection
    const handleImage = (e) => {

        // Getting selected image file
        const file = e.target.files[0]

        // Store image file for backend upload
        setBackendImage(file)

        // Create temporary image URL to preview selected image
        setFrontendImage(URL.createObjectURL(file))
    }

    // Function to save edited profile data
    const handleEditProfile = async () => {

        // Start loading
        setLoading(true)

        try {

            // Creating FormData because profile image/file can be uploaded
            const formdata = new FormData()

            // Adding text fields to FormData
            formdata.append("name", name)
            formdata.append("userName", userName)
            formdata.append("bio", bio)
            formdata.append("profession", profession)
            formdata.append("gender", gender)

            // Add profile image only if user selected a new image
            if (backendImage) {
                formdata.append("profileImage", backendImage)
            }

            // API request to update profile
            const result = await axios.post(
                `${serverUrl}/api/user/editProfile`,
                formdata,
                { withCredentials: true } // Sends cookies/token with request
            )

            // Update profile data in Redux
            dispatch(setProfileData(result.data))

            // Update current user data in Redux
            dispatch(setUserData(result.data))

            // Stop loading
            setLoading(false)

            // Navigate back to profile page
            navigate(`/profile/${userData.userName}`)

        } catch (error) {

            // Print error in console
            console.log(error)

            // Stop loading if error occurs
            setLoading(false)
        }
    }

    return (
        // Main page container
<div className='w-full min-h-[100vh] bg-[#1E2A44] flex items-center flex-col gap-[20px]'>

    {/* Header section */}
    <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px]'>

        {/* Back button */}
        <MdOutlineKeyboardBackspace
            className='text-[#F8F8F6] cursor-pointer w-[25px] h-[25px]'
            onClick={() => navigate(`/profile/${userData.userName}`)}
        />

        {/* Page title */}
        <h1 className='text-[#F8F8F6] text-[20px] font-semibold'>
            Edit Profile
        </h1>
    </div>

    {/* Profile image section */}
    <div
        className='w-[80px] h-[80px] md:w-[100px] md:h-[100px] border-2 border-[#B7BDC6] rounded-full cursor-pointer overflow-hidden'
        onClick={() => imageInput.current.click()}
    >

        {/* Hidden file input for selecting profile image */}
        <input
            type='file'
            accept='image/*'
            ref={imageInput}
            hidden
            onChange={handleImage}
        />

        {/* Profile image preview */}
        <img src={frontendImage} alt="" className='w-full object-cover' />
    </div>

    {/* Text to open image selector */}
    <div
        className='text-[#B7BDC6] text-center text-[18px] font-semibold cursor-pointer'
        onClick={() => imageInput.current.click()}
    >
        Change Your Profile Picture
    </div>

    {/* Name input */}
    <input
        type="text"
        className='w-[90%] max-w-[600px] h-[60px] bg-[#F8F8F6] border-2 border-[#B7BDC6] rounded-2xl text-[#1E2A44] font-semibold px-[20px] outline-none'
        placeholder='Enter Your Name'
        onChange={(e) => setName(e.target.value)}
        value={name}
    />

    {/* Username input */}
    <input
        type="text"
        className='w-[90%] max-w-[600px] h-[60px] bg-[#F8F8F6] border-2 border-[#B7BDC6] rounded-2xl text-[#1E2A44] font-semibold px-[20px] outline-none'
        placeholder='Enter Your userName'
        onChange={(e) => setUserName(e.target.value)}
        value={userName}
    />

    {/* Bio input */}
    <input
        type="text"
        className='w-[90%] max-w-[600px] h-[60px] bg-[#F8F8F6] border-2 border-[#B7BDC6] rounded-2xl text-[#1E2A44] font-semibold px-[20px] outline-none'
        placeholder='Bio'
        onChange={(e) => setBio(e.target.value)}
        value={bio}
    />

    {/* Profession input */}
    <input
        type="text"
        className='w-[90%] max-w-[600px] h-[60px] bg-[#F8F8F6] border-2 border-[#B7BDC6] rounded-2xl text-[#1E2A44] font-semibold px-[20px] outline-none'
        placeholder='Profession'
        onChange={(e) => setProfession(e.target.value)}
        value={profession}
    />

    {/* Gender input */}
    <input
        type="text"
        className='w-[90%] max-w-[600px] h-[60px] bg-[#F8F8F6] border-2 border-[#B7BDC6] rounded-2xl text-[#1E2A44] font-semibold px-[20px] outline-none'
        placeholder='Gender'
        onChange={(e) => setGender(e.target.value)}
        value={gender}
    />

    {/* Save profile button */}
    <button
        className='px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] bg-[#F8F8F6] text-[#1E2A44] font-semibold cursor-pointer rounded-2xl border border-[#B7BDC6]'
        onClick={handleEditProfile}
    >
        {/* Show loader while saving, otherwise show button text */}
        {loading ? <ClipLoader size={30} color='#1E2A44' /> : "Save Profile"}
    </button>
</div>
    )
}

export default EditProfile
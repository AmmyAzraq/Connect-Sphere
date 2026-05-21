import React, { useEffect, useState } from 'react'
import dp from "../assets/dp.webp"
import { FiPlusCircle } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';

// StoryDp component
// Ye story profile circle ko render karta hai
function StoryDp({ProfileImage,userName,story}) {

const navigate=useNavigate()

// Redux se current logged in user ka data le rahe hain
const{ userData}=useSelector(state=>state.user)

// Redux se saari stories ka data le rahe hain
const{ storyData,storyList}=useSelector(state=>state.story)

// State check karegi ki story viewed hai ya nahi
const [viewed,setViewed]=useState(false)

// useEffect check karega ki current user ne story dekhi hai ya nahi
useEffect(()=>{

  // Agar viewers list me current user exist karta hai
  if(
    story?.viewers?.some((viewer)=>

      // Viewer object ho sakta hai ya direct id
      viewer?._id?.toString()===userData._id.toString()
      ||
      viewer?.toString()==userData._id.toString()
    )
  ){

    // Story viewed mark kar do
    setViewed(true)

  }else{

    // Story not viewed
    setViewed(false)
  }

},[story,userData,storyData,storyList])

// Story view API call
const handleViewers=async ()=>{

  try {

    // Backend ko request bhej rahe hain
    const result=await axios.get(
      `${serverUrl}/api/story/view/${story._id}`,
      {withCredentials:true}
    )

  } catch (error) {

    console.log(error)
  }
}

// Story click handle function
const handleClick=()=>{

  // Agar story nahi hai aur current user ki story hai
  if(!story && userName=="Your Story"){

    // Upload page par navigate
    navigate("/upload")

  }

  // Agar story hai aur current user ki story hai
  else if(story && userName=="Your Story"){

    // Story viewed mark karo
    handleViewers()

    // Story page open karo
    navigate(`/story/${userData?.userName}`)

  }

  // Dusre users ki story
  else {

    // Story viewed mark karo
    handleViewers()

    // Story page open karo
    navigate(`/story/${userName}`)
  }
}

  return (

    // Main story dp container
    <div className='flex flex-col w-[80px]'>

      {/* Story circle */}
      <div
        className={`w-[80px] h-[80px] ${!story ? null : !viewed ? "bg-gradient-to-b from-blue-500 to-blue-950" : "bg-gradient-to-r from-gray-500 to-black-800"} rounded-full flex items-center justify-center relative`}
        onClick={handleClick}
      >

      {/* Profile image container */}
      <div className='w-[70px] h-[70px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>

          {/* Profile image */}
          <img
            src={ProfileImage || dp}
            alt=""
            className='w-full object-cover'
          />

          {/* Plus icon sirf tab show hoga jab user ki khud ki story nahi hai */}
          {!story && userName=="Your Story" &&
            <div>

              <FiPlusCircle className='text-black absolute bottom-[8px] bg-white right-[10px] rounded-full w-[22px] h-[22px]' />

            </div>
          }

      </div>
      </div>

      {/* Username */}
      <div className='text-[14px] text-center truncate w-full text-white'>
        {userName}
      </div>

    </div>
  )
}

export default StoryDp
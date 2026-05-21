import React from 'react'
import { GoHomeFill } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { RxVideo } from "react-icons/rx";
import { FiPlusSquare } from "react-icons/fi";
import dp from "../assets/dp.webp"
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Nav() {

  // Page navigation ke liye use ho raha hai
  const navigate = useNavigate()

  // Redux store se current user data le raha hai
  const { userData } = useSelector(state => state.user)

  return (

    // Bottom fixed navigation bar
    <div className='w-[90%] lg:w-[40%] h-[80px] bg-[#1E2A44] flex justify-around items-center fixed bottom-[20px] rounded-full shadow-2xl shadow-[#000000] z-[100]'>

      {/* Home button */}
      <div onClick={() => navigate("/")}>

        <GoHomeFill className='text-white cursor-pointer w-[25px] h-[25px]' />

      </div>

      {/* Search button */}
      <div onClick={() => navigate("/search")}>

        <FiSearch className='text-white cursor-pointer w-[25px] h-[25px]' />

      </div>

      {/* Upload button */}
      <div onClick={() => navigate("/upload")}>

        <FiPlusSquare className='text-white cursor-pointer w-[25px] h-[25px]' />

      </div>

      {/* Loops/Reels button */}
      <div onClick={() => navigate("/loops")}>

        <RxVideo className='text-white cursor-pointer w-[28px] h-[28px]' />

      </div>

      {/* Current user profile image */}
      <div
        className='w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden'
        onClick={() => navigate(`/profile/${userData.userName}`)}
      >

        <img
          src={userData.profileImage || dp}
          alt=""
          className='w-full object-cover'
        />

      </div>

    </div>
  )
}

export default Nav
import React, { useState } from 'react'
import logo from "../assets/cs.png"
import { FaRegHeart } from "react-icons/fa6";
import dp from "../assets/dp.webp"
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import OtherUser from './OtherUser';
import Notifications from '../pages/Notifications';

function LeftHome() {

    // Redux store se current user aur suggested users ka data le raha hai
    const { userData, suggestedUsers } = useSelector(state => state.user)

    // Notifications show/hide karne ke liye state
    const [showNotification, setShowNotification] = useState(false)

    // Redux dispatch use karne ke liye
    const dispatch = useDispatch()

    // Redux store se notifications ka data le raha hai
    const { notificationData } = useSelector(state => state.user)

    // Logout function
    const handleLogOut = async () => {

        try {

            // Logout API call
            const result = await axios.get(
                `${serverUrl}/api/auth/signout`,
                { withCredentials: true }
            )

            // Redux se user data remove kar raha hai
            dispatch(setUserData(null))

        } catch (error) {

            console.log(error)

        }

    }

    return (

        // Left sidebar container
<div className={`w-[25%] hidden lg:block h-[100vh] bg-[#1E2A44] border-r-2 border-[#B7BDC6] ${showNotification ? "overflow-hidden" : "overflow-auto"}`}>

    {/* Top navbar */}
    <div className='w-full h-[100px] flex items-center justify-between p-[20px]'>

        {/* App logo */}
        <img src={logo} alt="" className='w-[120px]' />

        {/* Notification icon */}
        <div
            className='relative z-[100]'
            onClick={() => setShowNotification(prev => !prev)}
        >

            <FaRegHeart className='text-[#F8F8F6] w-[25px] h-[25px]' />

            {/* Unread notification blue dot */}
            {notificationData?.length > 0 &&
                notificationData.some((noti) => noti.isRead === false) && (

                    <div className='w-[10px] h-[10px] bg-[#B7BDC6] rounded-full absolute top-0 right-[-5px]'></div>

                )}

        </div>

    </div>

    {/* Agar notifications open nahi hain */}
    {!showNotification && <>

        {/* Current user profile section */}
        <div className='flex items-center w-full justify-between gap-[10px] px-[10px] border-b-2 border-b-[#B7BDC6] py-[10px]'>

            <div className='flex items-center gap-[10px]'>

                {/* User profile image */}
                <div className='w-[70px] h-[70px] border-2 border-[#B7BDC6] rounded-full cursor-pointer overflow-hidden'>

                    <img
                        src={userData.profileImage || dp}
                        alt=""
                        className='w-full object-cover'
                    />

                </div>

                {/* Username and name */}
                <div>

                    <div className='text-[18px] text-[#F8F8F6] font-semibold'>
                        {userData.userName}
                    </div>

                    <div className='text-[15px] text-[#B7BDC6] font-semibold'>
                        {userData.name}
                    </div>

                </div>

            </div>

            {/* Logout button */}
            <div
                className='text-[#B7BDC6] font-semibold cursor-pointer'
                onClick={handleLogOut}
            >
                Log Out
            </div>

        </div>

        {/* Suggested users section */}
        <div className='w-full flex flex-col gap-[20px] p-[20px]'>

            <h1 className='text-[#F8F8F6] text-[19px]'>
                Suggested Users
            </h1>

            {/* Suggested users list */}
            {suggestedUsers &&
                suggestedUsers.slice(0, 3).map((user, index) => (

                    <OtherUser key={index} user={user} />

                ))}

        </div>

    </>}

    {/* Notifications page */}
    {showNotification && <Notifications />}

</div>
    )
}

export default LeftHome
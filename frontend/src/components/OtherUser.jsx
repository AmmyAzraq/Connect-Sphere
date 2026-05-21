import React from 'react'
import { useSelector } from 'react-redux'
import dp from "../assets/dp.webp"
import { useNavigate } from 'react-router-dom'
import FollowButton from './FollowButton'

function OtherUser({ user }) {

    // Redux store se current logged-in user data le raha hai
    const { userData } = useSelector(state => state.user)

    // Navigation ke liye use ho raha hai
    const navigate = useNavigate()

    return (

        // Main user card container
        <div className='w-full h-[80px] flex items-center justify-between border-b-2 border-gray-800' >

            {/* Left side user info section */}
            <div className='flex items-center gap-[10px]'>

                {/* User profile image */}
                <div
                    className='w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden'
                    onClick={() => navigate(`/profile/${user.userName}`)}
                >

                    <img
                        src={user.profileImage || dp}
                        alt=""
                        className='w-full object-cover'
                    />

                </div>

                {/* Username and name */}
                <div>

                    <div className='text-[18px] text-white font-semibold '>
                        {user.userName}
                    </div>

                    <div className='text-[15px] text-gray-400 font-semibold '>
                        {user.name}
                    </div>

                </div>

            </div>

            {/* Follow button on right side */}
            <FollowButton
                tailwind={'px-[10px] w-[100px] py-[5px] h-[40px] bg-[white] rounded-2xl'}
                targetUserId={user._id}
            />

        </div>
    )
}

export default OtherUser
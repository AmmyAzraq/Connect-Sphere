import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSelectedUser } from '../redux/messageSlice'
import dp from "../assets/dp.webp"

function OnlineUser({ user }) {

    // Navigation ke liye use ho raha hai
    const navigate = useNavigate()

    // Redux dispatch use karne ke liye
    const dispatch = useDispatch()

    return (

        // Main online user container
        <div className='w-[50px] h-[50px] flex gap-[20px] justify-start items-center relative'>

            {/* User profile image */}
            <div
                className='w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden'
                onClick={() => {

                    // Selected user ko redux me save kar raha hai
                    dispatch(setSelectedUser(user))

                    // Message area page pe navigate kar raha hai
                    navigate(`/messageArea`)

                }}
            >

                <img
                    src={user.profileImage || dp}
                    alt=""
                    className='w-full object-cover'
                />

            </div>

            {/* Online status blue dot */}
            <div className='w-[10px] h-[10px] bg-[#0080ff] rounded-full absolute top-0 right-0'>

            </div>

        </div>
    )
}

export default OnlineUser
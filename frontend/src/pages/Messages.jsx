// Import React
import React from 'react'

// Import back arrow icon
import { MdOutlineKeyboardBackspace } from "react-icons/md";

// Import navigation hook
import { useNavigate } from 'react-router-dom';

// Import search icon
import { GoSearch } from "react-icons/go";

// Import Redux hooks
import { useDispatch, useSelector } from 'react-redux';

// Import OnlineUser component
import OnlineUser from '../components/OnlineUser';

// Import Redux action to set selected chat user
import { setSelectedUser } from '../redux/messageSlice';

// Import default profile image
import dp from "../assets/dp.webp"

function Messages() {

    // Hook for page navigation
    const navigate = useNavigate()

    // Getting logged-in user data from Redux store
    const { userData } = useSelector(state => state.user)

    // Getting online users list from Redux store
    const { onlineUsers } = useSelector(state => state.socket)

    // Getting previous chat users and selected user from Redux store
    const { prevChatUsers, selectedUsers } = useSelector(state => state.message)

    // Redux dispatch function
    const dispatch = useDispatch()

    return (

        // Main messages page container
<div className='w-full min-h-[100vh] flex flex-col bg-[#1E2A44] gap-[20px] p-[10px]'>

    {/* Header section */}
    <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px]'>

        {/* Back button hidden on large screen */}
        <MdOutlineKeyboardBackspace
            className='text-[#F8F8F6] cursor-pointer lg:hidden w-[25px] h-[25px]'
            onClick={() => navigate(`/`)}
        />

        {/* Page title */}
        <h1 className='text-[#F8F8F6] text-[20px] font-semibold'>Messages</h1>
    </div>

    {/* Online following users horizontal list */}
    <div className='w-full h-[80px] flex gap-[20px] justify-start items-center overflow-x-auto p-[20px] border-b-2 border-[#B7BDC6]'>

        {/* Show only following users who are online */}
        {userData.following?.map((user, index) => (

            // Render online user if user id exists in onlineUsers list
            (onlineUsers?.includes(user._id)) && <OnlineUser user={user} />
        ))}
    </div>

    {/* Previous chat users list */}
    <div className='w-full h-full overflow-auto flex flex-col gap-[20px]'>

        {/* Loop through previous chat users */}
        {prevChatUsers?.map((user, index) => (

            // Single chat user row
            <div
                className='text-[#F8F8F6] cursor-pointer w-full flex items-center gap-[10px]'
                onClick={() => {

                    // Store clicked user as selected user
                    dispatch(setSelectedUser(user))

                    // Navigate to message area
                    navigate("/messageArea")
                }}
            >

                {/* If user is online, show OnlineUser component, otherwise show normal profile image */}
                {onlineUsers?.includes(user._id)
                    ? <OnlineUser user={user} />
                    : <div className='w-[50px] h-[50px] border-2 border-[#B7BDC6] rounded-full cursor-pointer overflow-hidden'>
                        <img src={user.profileImage || dp} alt="" className='w-full object-cover' />
                    </div>
                }

                {/* User information */}
                <div className='flex flex-col'>

                    {/* Username */}
                    <div className='text-[#F8F8F6] text-[18px] font-semibold'>{user.userName}</div>

                    {/* Active status */}
                    {onlineUsers?.includes(user?._id) &&
                        <div className='text-[#B7BDC6] text-[15px]'>Active Now</div>
                    }
                </div>
            </div>
        ))}

    </div>

</div>
    )
}

export default Messages
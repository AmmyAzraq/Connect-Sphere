// Import React and useEffect hook
import React, { useEffect } from 'react'

// Import navigation hook
import { useNavigate } from 'react-router-dom'

// Import back arrow icon
import { MdOutlineKeyboardBackspace } from "react-icons/md";

// Import Redux hooks
import { useDispatch, useSelector } from 'react-redux';

// Import NotificationCard component
import NotificationCard from '../components/NotificationCard';

// Import axios for API requests
import axios from 'axios';

// Import backend server URL
import { serverUrl } from '../App';

// Import custom hook for notifications
import getAllNotifications from '../hooks/getAllNotifications';

// Import Redux action for updating notification data
import { setNotificationData } from '../redux/userSlice';

function Notifications() {

    // Hook for page navigation
    const navigate = useNavigate()

    // Getting notification data from Redux store
    const { notificationData } = useSelector(state => state.user)

    // Getting all notification ids
    const ids = notificationData.map((n) => n._id)

    // Redux dispatch function
    const dispatch = useDispatch()

    // Function to mark notifications as read
    const markAsRead = async () => {
        try {

            // API request to mark notifications as read
            const result = await axios.post(
                `${serverUrl}/api/user/markAsRead`,
                { notificationId: ids },
                { withCredentials: true } // Sends cookies/token with request
            )

            // Fetch updated notifications after marking as read
            await fetchNotifications()

        } catch (error) {

            // Print error in console
            console.log(error)
        }
    }

    // Function to fetch all notifications
    const fetchNotifications = async () => {
        try {

            // API request to get all notifications
            const result = await axios.get(
                `${serverUrl}/api/user/getAllNotifications`,
                { withCredentials: true } // Sends cookies/token with request
            )

            // Store notifications in Redux
            dispatch(setNotificationData(result.data))

        } catch (error) {

            // Print error in console
            console.log(error)
        }
    }

    // Mark notifications as read when page opens
    useEffect(() => {
        markAsRead()
    }, [])

    return (

        // Main notifications page container
        <div className='w-full h-[100vh] bg-black overflow-auto'>

            {/* Header section for small screens */}
            <div className='w-full h-[80px]  flex items-center gap-[20px] px-[20px] lg:hidden'>

                {/* Back button */}
                <MdOutlineKeyboardBackspace
                    className='text-white cursor-pointer w-[25px]  h-[25px] '
                    onClick={() => navigate(`/`)}
                />

                {/* Page title */}
                <h1 className='text-white text-[20px] font-semibold'>Notifications</h1>
            </div>

            {/* Notifications list */}
            <div className='w-full flex flex-col gap-[20px] h-100%]  px-[10px]'>

                {/* Render all notifications */}
                {notificationData?.map((noti, index) => (

                    // Single notification card
                    <NotificationCard noti={noti} key={index} />
                ))}
            </div>
        </div>
    )
}

export default Notifications
// Import axios for making API requests
import axios from 'axios'

// Import React and useEffect hook
import React, { useEffect } from 'react'

// Import backend server URL
import { serverUrl } from '../App'

// Import Redux hooks
import { useDispatch, useSelector } from 'react-redux'

// Import Redux actions
import { setNotificationData, setUserData } from '../redux/userSlice'
import { setPostData } from '../redux/postSlice'

// Custom function to fetch all notifications
function getAllNotifications() {

    // Redux dispatch function
    const dispatch = useDispatch()

    // Getting user data from Redux store
    const { userData } = useSelector(state => state.user)

    // useEffect runs when component mounts
    // and whenever dispatch or userData changes
    useEffect(() => {

        // Async function to fetch notifications
        const fetchNotifications = async () => {
            try {

                // API call to get all notifications
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

        // Calling fetch function
        fetchNotifications()

    }, [dispatch, userData])

}

// Exporting function
export default getAllNotifications
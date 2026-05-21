// Import axios for making API requests
import axios from 'axios'

// Import React and useEffect hook
import React, { useEffect } from 'react'

// Import backend server URL
import { serverUrl } from '../App'

// Import Redux hooks
import { useDispatch, useSelector } from 'react-redux'

// Import Redux actions
import { setFollowing, setUserData } from '../redux/userSlice'
import { setCurrentUserStory } from '../redux/storySlice'
import { setPrevChatUsers } from '../redux/messageSlice'

// Custom function to fetch previous chat users
function getPrevChatUsers() {

    // Redux dispatch function
    const dispatch = useDispatch()

    // Getting messages data from Redux store
    const { messages } = useSelector(state => state.message)

    // useEffect runs whenever messages change
    useEffect(() => {

        // Async function to fetch previous chat users
        const fetchUser = async () => {
            try {

                // API request to get previous chat users
                const result = await axios.get(
                    `${serverUrl}/api/message/prevChats`,
                    { withCredentials: true } // Sends cookies/token with request
                )

                // Store previous chat users in Redux
                dispatch(setPrevChatUsers(result.data))

                // Print fetched data in console
                console.log(result.data)

            } catch (error) {

                // Print error in console
                console.log(error)
            }
        }

        // Calling fetch function
        fetchUser()

    }, [messages])

}

// Exporting function
export default getPrevChatUsers
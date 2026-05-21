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

// Custom function to fetch following list
function getFollowingList() {

    // Redux dispatch function
    const dispatch = useDispatch()

    // Getting story data from Redux store
    const { storyData } = useSelector(state => state.story)

    // useEffect runs whenever storyData changes
    useEffect(() => {

        // Async function to fetch following users
        const fetchUser = async () => {
            try {

                // API request to get following list
                const result = await axios.get(
                    `${serverUrl}/api/user/followingList`,
                    { withCredentials: true } // Sends cookies/token with request
                )

                // Store following list in Redux
                dispatch(setFollowing(result.data))

            } catch (error) {

                // Print error in console
                console.log(error)
            }
        }

        // Calling fetch function
        fetchUser()

    }, [storyData])

}

// Exporting function
export default getFollowingList
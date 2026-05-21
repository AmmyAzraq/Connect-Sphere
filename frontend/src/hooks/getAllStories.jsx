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
import { setStoryList } from '../redux/storySlice'

// Custom function to fetch all stories
function getAllStories() {

    // Redux dispatch function
    const dispatch = useDispatch()

    // Getting logged-in user data from Redux store
    const { userData } = useSelector(state => state.user)

    // Getting story data from Redux store
    const { storyData } = useSelector(state => state.story)

    // useEffect runs when userData or storyData changes
    useEffect(() => {

        // Async function to fetch stories
        const fetchStories = async () => {
            try {

                // API request to get all stories
                const result = await axios.get(
                    `${serverUrl}/api/story/getAll`,
                    { withCredentials: true } // Sends cookies/token with request
                )

                // Store fetched stories in Redux
                dispatch(setStoryList(result.data))

            } catch (error) {

                // Print error in console
                console.log(error)
            }
        }

        // Calling fetch function
        fetchStories()

    }, [userData, storyData])

}

// Exporting function
export default getAllStories
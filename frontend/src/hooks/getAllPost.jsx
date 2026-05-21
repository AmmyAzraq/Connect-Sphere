// Import axios for API requests
import axios from 'axios'

// Import React and useEffect hook
import React, { useEffect } from 'react'

// Import backend server URL
import { serverUrl } from '../App'

// Import Redux hooks
import { useDispatch, useSelector } from 'react-redux'

// Import Redux actions
import { setUserData } from '../redux/userSlice'
import { setPostData } from '../redux/postSlice'

// Custom function to fetch all posts
function getAllPost() {

    // Redux dispatch function
    const dispatch = useDispatch()

    // Getting logged-in user data from Redux store
    const { userData } = useSelector(state => state.user)

    // useEffect runs on component mount
    // and whenever dispatch or userData changes
    useEffect(() => {

        // Async function to fetch posts
        const fetchPost = async () => {
            try {

                // API request to get all posts
                const result = await axios.get(
                    `${serverUrl}/api/post/getAll`,
                    { withCredentials: true } // Sends cookies/token with request
                )

                // Store fetched posts in Redux
                dispatch(setPostData(result.data))

            } catch (error) {

                // Print error in console
                console.log(error)
            }
        }

        // Calling fetch function
        fetchPost()

    }, [dispatch, userData])

}

// Exporting function
export default getAllPost
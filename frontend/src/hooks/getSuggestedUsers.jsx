// Import axios for making API requests
import axios from 'axios'

// Import React and useEffect hook
import React, { useEffect } from 'react'

// Import backend server URL
import { serverUrl } from '../App'

// Import Redux hooks
import { useDispatch, useSelector } from 'react-redux'

// Import Redux actions
import { setSuggestedUsers, setUserData } from '../redux/userSlice'

// Custom function to fetch suggested users
function getSuggestedUsers() {

    // Redux dispatch function
    const dispatch = useDispatch()

    // Getting logged-in user data from Redux store
    const { userData } = useSelector(state => state.user)

    // useEffect runs whenever userData changes
    useEffect(() => {

        // Async function to fetch suggested users
        const fetchUser = async () => {
            try {

                // API request to get suggested users
                const result = await axios.get(
                    `${serverUrl}/api/user/suggested`,
                    { withCredentials: true } // Sends cookies/token with request
                )

                // Store suggested users in Redux
                dispatch(setSuggestedUsers(result.data))

            } catch (error) {

                // Print error in console
                console.log(error)
            }
        }

        // Calling fetch function
        fetchUser()

    }, [userData])

}

// Exporting function
export default getSuggestedUsers
// Import axios for making API requests
import axios from 'axios'

// Import React and useEffect hook
import React, { useEffect } from 'react'

// Import useParams hook to get URL parameters
import { useParams } from 'react-router-dom'

// Import backend server URL
import { serverUrl } from '../App'

// Import Redux hooks
import { useDispatch, useSelector } from 'react-redux'

// Import Redux action for story data
import { setStoryData } from '../redux/storySlice'

// Import StoryCard component
import StoryCard from '../components/StoryCard'

function Story() {

    // Getting username from URL params
    const { userName } = useParams()

    // Redux dispatch function
    const dispatch = useDispatch()

    // Getting story data from Redux store
    const { storyData } = useSelector(state => state.story)

    // Function to fetch story by username
    const handleStory = async () => {

        // Clear previous story data before fetching new story
        dispatch(setStoryData(null))

        try {

            // API request to get story by username
            const result = await axios.get(
                `${serverUrl}/api/story/getByUserName/${userName}`,
                { withCredentials: true } // Sends cookies/token with request
            )

            // Store fetched story data in Redux
            dispatch(setStoryData(result.data[0]))

            // Print current story data in console
            console.log(storyData)

        } catch (error) {

            // Print error in console
            console.log(error)
        }
    }

    // Fetch story when username changes
    useEffect(() => {

        // Call API only if username exists
        if (userName) {
            handleStory()
        }

    }, [userName])

    return (

       // Main story page container
<div className='w-full h-[100vh] bg-[#1E2A44] flex justify-center items-center'>

    {/* Render story card */}
    <StoryCard storyData={storyData} />

</div>
    )
}

export default Story
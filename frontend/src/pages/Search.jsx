// Import React hooks
import React, { useEffect, useState } from 'react'

// Import back arrow icon
import { MdOutlineKeyboardBackspace } from "react-icons/md";

// Import navigation hook
import { useNavigate } from 'react-router-dom';

// Import search icon
import { FiSearch } from "react-icons/fi";

// Import axios for API requests
import axios from 'axios';

// Import backend server URL
import { serverUrl } from '../App';

// Import Redux hooks
import { useDispatch, useSelector } from 'react-redux';

// Import Redux action for search data
import { setSearchData } from '../redux/userSlice';

// Import default profile image
import dp from "../assets/dp.webp"

function Search() {

    // Hook for page navigation
    const navigate = useNavigate()

    // State for search input value
    const [input, setInput] = useState(null)

    // State for storing searched users data
    const [searchData, setSearchData] = useState()

    // Redux dispatch function
    const dispatch = useDispatch()

    // Function to search users
    const handleSearch = async () => {

        try {

            // API request to search user by keyword
            const result = await axios.get(
                `${serverUrl}/api/user/search?keyWord=${input}`,
                { withCredentials: true } // Sends cookies/token with request
            )

            // Store searched data in local state
            setSearchData(result.data)

            // Print searched data in console
            console.log(result.data)

        } catch (error) {

            // Print error in console
            console.log(error)
        }
    }

    // Run search whenever input changes
    useEffect(() => {

        // Search only when input has value
        if (input) {
            handleSearch()
        }

    }, [input])

    // Print search data in console
    console.log(searchData)

    return (

        // Main search page container
<div className='w-full min-h-[100vh] bg-[#1E2A44] flex items-center flex-col gap-[20px]'>

    {/* Top back button section */}
    <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] absolute top-0'>

        {/* Back button */}
        <MdOutlineKeyboardBackspace
            className='text-[#F8F8F6] cursor-pointer w-[25px] h-[25px]'
            onClick={() => navigate(`/`)}
        />
    </div>

    {/* Search input wrapper */}
    <div className='w-full h-[80px] flex items-center justify-center mt-[80px]'>

        {/* Search box */}
        <div className='w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#F8F8F6] flex items-center px-[20px] border border-[#B7BDC6]'>

            {/* Search icon */}
            <FiSearch className='w-[18px] h-[18px] text-[#1E2A44]' />

            {/* Search input */}
            <input
                type="text"
                placeholder='search...'
                className='w-full h-full outline-0 rounded-full px-[20px] text-[#1E2A44] text-[18px] bg-transparent placeholder:text-[#B7BDC6]'
                onChange={(e) => setInput(e.target.value)}
                value={input}
            />
        </div>
    </div>

    {/* Search results */}
    {input && searchData?.map((user) => (

        // Single searched user card
        <div
            className='w-[90vw] max-w-[700px] h-[60px] rounded-full bg-[#F8F8F6] flex items-center gap-[20px] px-[5px] cursor-pointer hover:bg-[#B7BDC6]'
            onClick={() => navigate(`/profile/${user.userName}`)}
        >

            {/* User profile image */}
            <div className='w-[50px] h-[50px] border-2 border-[#B7BDC6] rounded-full cursor-pointer overflow-hidden'>
                <img src={user.profileImage || dp} alt="" className='w-full object-cover' />
            </div>

            {/* User info */}
            <div className='text-[#1E2A44] text-[18px] font-semibold'>

                {/* Username */}
                <div>{user.userName}</div>

                {/* Name */}
                <div className='text-[14px] text-[#6f7680]'>{user.name}</div>
            </div>

        </div>
    ))}

    {/* Default text when input is empty */}
    {!input && <div className='text-[30px] text-[#B7BDC6] font-bold'>Search Here...</div>}

</div>
    )
}

export default Search
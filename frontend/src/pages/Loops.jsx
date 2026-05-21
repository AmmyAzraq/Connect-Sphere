// Import React
import React from 'react'

// Import back arrow icon
import { MdOutlineKeyboardBackspace } from "react-icons/md";

// Import navigation hook
import { useNavigate } from 'react-router-dom';

// Import LoopCard component
import LoopCard from '../components/LoopCard';

// Import Redux hook
import { useSelector } from 'react-redux';

function Loops() {

    // Hook for page navigation
    const navigate = useNavigate()

    // Getting loop data from Redux store
    const { loopData } = useSelector(state => state.loop)

    return (

        // Main page container
<div className='w-screen h-screen bg-[#1E2A44] overflow-hidden flex justify-center items-center'>

    {/* Header section */}
    <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] fixed top-[10px] left-[10px] z-[100]'>

        {/* Back button */}
        <MdOutlineKeyboardBackspace
            className='text-[#F8F8F6] cursor-pointer w-[25px] h-[25px]'
            onClick={() => navigate(`/`)}
        />

        {/* Page title */}
        <h1 className='text-[#F8F8F6] text-[20px] font-semibold'>Loops</h1>
    </div>

    {/* Scrollable loops container */}
    <div className='h-[100vh] overflow-y-scroll snap-y snap-mandatory scrollbar-hide'>

        {/* Loop through all loops */}
        {loopData.map((loop, index) => (

            // Each loop section takes full screen height
            <div className='h-screen snap-start'>

                {/* Render single loop card */}
                <LoopCard loop={loop} key={indexedDB} />
            </div>
        ))}
    </div>

</div>
    )
}

// Exporting Loops component
export default Loops
// Import React
import React from 'react'

// Import Left sidebar component
import LeftHome from '../components/LeftHome'

// Import Feed component
import Feed from '../components/Feed'

// Import Right sidebar component
import RightHome from '../components/RightHome'

// Home page component
function Home() {

  return (

    // Main container for home page layout
    <div className='w-full flex justify-center items-center'>

      {/* Left sidebar section */}
      <LeftHome />

      {/* Main feed section */}
      <Feed />

      {/* Right sidebar section */}
      <RightHome />

    </div>
  )
}

// Exporting Home component
export default Home
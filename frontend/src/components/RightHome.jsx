import React from 'react'
import Messages from '../pages/Messages'

// RightHome component
// Ye homepage ke right section ko render karta hai
function RightHome() {

  return (

   // Right sidebar container
// Sirf large screens (lg) par show hoga
<div className='w-[25%] min-h-[100vh] bg-[#1E2A44] border-l-2 border-[#B7BDC6] hidden lg:block'>

  {/* Messages component render ho raha hai */}
  <Messages/>

</div>
  )
}

export default RightHome
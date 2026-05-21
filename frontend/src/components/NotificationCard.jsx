import React from 'react'
import dp from "../assets/dp.webp"

function NotificationCard({ noti }) {

  return (

    // Main notification card container
    <div className='w-full flex justify-between items-center p-[5px] min-h-[50px] bg-gray-800 rounded-full'>

      {/* Left side user info */}
      <div className='flex gap-[10px] items-center'>

        {/* Sender profile image */}
        <div className='w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>

          <img
            src={noti?.sender?.profileImage || dp}
            alt=""
            className='w-full object-cover'
          />

        </div>

        {/* Sender username and notification message */}
        <div className='flex flex-col'>

          {/* Sender username */}
          <h1 className='text-[16px] text-white font-semibold'>
            {noti?.sender?.userName || "Unknown User"}
          </h1>

          {/* Notification message */}
          <div className='text-[15px] text-gray-200'>
            {noti?.message}
          </div>

        </div>

      </div>

      {/* Right side post/loop preview */}
      <div className='w-[40px] h-[40px] rounded-full overflow-hidden border-4 border-black'>

        {/* Agar notification loop ki hai */}
        {noti.loop

          ?

          // Loop video preview
          <video
            src={noti?.loop?.media}
            muted
            className='h-full w-full object-cover'
          />

          :

          // Agar post image type ka hai
          noti.post?.mediaType == "image"

            ?

            // Image preview
            <img
              src={noti.post?.media}
              className='h-full object-cover'
            />

            :

            // Agar video post hai
            noti.post

              ?

              // Video preview
              <video
                src={noti.post?.media}
                muted
                loop
                className='h-full w-full object-cover'
              />

              :

              // Agar koi media nahi hai
              null}

      </div>

    </div>
  )
}

export default NotificationCard
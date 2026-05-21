import React from 'react'
import logo from "../assets/cs.png"
import { FaRegHeart } from "react-icons/fa6";
import StoryDp from './StoryDp';
import Nav from './Nav';
import { useSelector } from 'react-redux';
import { BiMessageAltDetail } from "react-icons/bi";
import Post from './Post';
import { useNavigate } from 'react-router-dom';

function Feed() {

  // Redux store se posts ka data le raha hai
  const { postData } = useSelector(state => state.post)

  // Redux store se current user aur notifications ka data le raha hai
  const { userData, notificationData } = useSelector(state => state.user)

  // Redux store se stories ka data le raha hai
  const { storyList, currentUserStory } = useSelector(state => state.story)

  // Navigation ke liye use ho raha hai
  const navigate = useNavigate()

  return (

   // Main feed container
<div className='lg:w-[50%] w-full bg-[#1E2A44] min-h-[100vh] lg:h-[100vh] relative lg:overflow-y-auto'>

  {/* Top navbar mobile view */}
  <div className='w-full h-[100px] flex items-center justify-between p-[20px] lg:hidden'>

    {/* App logo */}
    <img src={logo} alt="" className='w-[80px]' />

    {/* Right side icons */}
    <div className='flex items-center gap-[10px]'>

      {/* Notification icon */}
      <div
        className='relative'
        onClick={() => navigate("/notifications")}
      >

        <FaRegHeart className='text-[#F8F8F6] w-[25px] h-[25px]' />

        {/* Unread notification dot */}
        {notificationData?.length > 0 &&
          notificationData.some((noti) => noti.isRead === false) && (

            <div className='w-[10px] h-[10px] bg-[#B7BDC6] rounded-full absolute top-0 right-[-5px]'></div>

          )}

      </div>

      {/* Messages icon */}
      <BiMessageAltDetail
        className='text-[#F8F8F6] w-[25px] h-[25px]'
        onClick={() => navigate("/messages")}
      />

    </div>

  </div>

  {/* Stories section */}
  <div className='flex w-full justify-start overflow-x-auto gap-[10px] items-center p-[20px]'>

    {/* Current user ki story */}
    <StoryDp
      userName={"Your Story"}
      ProfileImage={userData.profileImage}
      story={currentUserStory}
    />

    {/* Other users stories */}
    {storyList?.map((story, index) => (

      <StoryDp
        userName={story.author.userName}
        ProfileImage={story.author.profileImage}
        story={story}
        key={index}
      />

    ))}

  </div>

  {/* Posts section */}
  <div className='w-full min-h-[100vh] flex flex-col items-center gap-[20px] p-[10px] pt-[40px] bg-[#F8F8F6] rounded-t-[60px] relative pb-[120px]'>

    {/* Bottom navigation */}
    <Nav />

    {/* Sare posts render ho rahe hain */}
    {postData && postData.map((post, index) => (

      <Post post={post} key={index} />

    ))}

  </div>

</div>
  )
}

export default Feed
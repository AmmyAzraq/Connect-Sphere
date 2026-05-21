import React, { useEffect, useState } from 'react';
import dp from "../assets/dp.webp";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import VideoPlayer from './VideoPlayer';
import { FaEye } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";
import axios from 'axios';
import { serverUrl } from '../App';
import { setStoryData } from '../redux/storySlice';

// StoryCard component
// Ye single story ko render karta hai
function StoryCard({ storyData }) {

  // Redux dispatch function
  const dispatch = useDispatch();

  // Redux se current logged in user ka data le rahe hain
  const { userData } = useSelector(state => state.user);

  // Redux se saari stories ka data le rahe hain
  const { storyData: allStories } = useSelector(state => state.story);

  // Viewers section show/hide karne ke liye state
  const [showViewers, setShowViewers] = useState(false);

  // Three dots options show/hide karne ke liye state
  const [showOptions, setShowOptions] = useState(false);

  // Delete confirmation popup show/hide karne ke liye state
  const [showDeleteBox, setShowDeleteBox] = useState(false);

  // Navigation hook
  const navigate = useNavigate();

  // Story progress bar ke liye state
  const [progress, setProgress] = useState(0);

  // Check karega ki current logged in user story ka owner hai ya nahi
  const isOwner = storyData?.author?._id == userData?._id;

  // Story delete function
  const handleDeleteStory = async () => {
    try {

      // Backend delete API call
      await axios.delete(
        `${serverUrl}/api/story/delete/${storyData._id}`,
        { withCredentials: true }
      );

      // Redux state se deleted story hata rahe hain
      dispatch(
        setStoryData(
          allStories.filter((item) => item._id !== storyData._id)
        )
      );

      // Popup close kar rahe hain
      setShowDeleteBox(false);

      // Options menu close kar rahe hain
      setShowOptions(false);

      // Delete ke baad home page par navigate kar rahe hain
      navigate("/");

    } catch (error) {
      console.log(error);
    }
  };

  // Story auto progress aur auto redirect ke liye useEffect
  useEffect(() => {

    const interval = setInterval(() => {

      setProgress(prev => {

        if (prev >= 100) {
          navigate("/");
          return 100;
        }

        return prev + 1;
      });

    }, 150);

    return () => clearInterval(interval);

  }, [navigate]);

  return (

    // Main story container
    <div className='w-full max-w-[500px] h-[100vh] border-x-2 border-gray-800 pt-[10px] relative flex flex-col justify-center bg-black'>

      {/* Top header section */}
      <div className='flex items-center gap-[10px] absolute top-[30px] px-[10px] z-10'>

        {/* Back button */}
        <MdOutlineKeyboardBackspace
          className='text-white cursor-pointer w-[25px] h-[25px]'
          onClick={() => navigate(`/`)}
        />

        {/* Author profile image */}
        <div className='w-[30px] h-[30px] md:w-[40px] md:h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
          <img
            src={storyData?.author?.profileImage || dp}
            alt=""
            className='w-full h-full object-cover'
          />
        </div>

        {/* Author username */}
        <div className='w-[120px] font-semibold truncate text-white'>
          {storyData?.author?.userName}
        </div>
      </div>

      {/* Agar current user story ka owner hai tabhi three dots show honge */}
      {isOwner && (

        // Three dots ko right corner me niche ki taraf rakha hai
        <div className='absolute right-[20px] bottom-[90px] z-30'>

          {/* Three dots button */}
          <BsThreeDots
            className='text-white text-[28px] cursor-pointer'
            onClick={() => setShowOptions(!showOptions)}
          />

          {/* Three dots click karne par delete option show hoga */}
          {showOptions && (
            <div className='absolute right-0 bottom-[35px] bg-white rounded-xl shadow-lg z-40'>

              {/* Delete option */}
              <button
                className='px-5 py-2 text-red-600 font-semibold'
                onClick={() => {
                  setShowDeleteBox(true);
                  setShowOptions(false);
                }}
              >
                Delete
              </button>

            </div>
          )}

        </div>
      )}

      {/* Delete confirmation popup */}
      {showDeleteBox && (
        <div className='fixed inset-0 bg-black/60 flex justify-center items-center z-50'>

          {/* Popup box */}
          <div className='w-[90%] max-w-[350px] bg-white rounded-2xl p-5 text-center'>

            {/* Popup heading */}
            <h2 className='text-[20px] font-semibold mb-3'>
              Delete Story?
            </h2>

            {/* Warning message */}
            <p className='text-gray-600 mb-5'>
              Do you really want to delete it? Once it is gone, you can't see it.
            </p>

            {/* Buttons section */}
            <div className='flex justify-center gap-4'>

              {/* Cancel button */}
              <button
                className='px-5 py-2 rounded-xl bg-gray-200'
                onClick={() => setShowDeleteBox(false)}
              >
                Cancel
              </button>

              {/* Final delete button */}
              <button
                className='px-5 py-2 rounded-xl bg-red-600 text-white'
                onClick={handleDeleteStory}
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

      {/* Progress bar background */}
      <div className='absolute top-[10px] w-full h-[5px] bg-gray-900 z-10'>

        {/* Actual progress bar */}
        <div
          className='h-full bg-white transition-all duration-150 ease-linear'
          style={{ width: `${progress}%` }}
        />

      </div>

      {/* Agar viewers section close hai */}
      {!showViewers ? (
        <>

          {/* Main story media section */}
          <div className='w-full h-[90vh] flex items-center justify-center'>

            {/* Image story */}
            {storyData?.mediaType === "image" && (
              <div className='w-[90%] flex items-center justify-center'>
                <img
                  src={storyData?.media}
                  alt=""
                  className='w-[80%] rounded-2xl object-cover'
                />
              </div>
            )}

            {/* Video story */}
            {storyData?.mediaType === "video" && (
              <div className='w-[80%] h-screen pt-4 flex flex-col items-center justify-center'>
                <VideoPlayer media={storyData?.media} />
              </div>
            )}

          </div>

          {/* Viewer count section */}
          {/* Sirf story owner ko show hoga */}
          {storyData?.author?.userName === userData?.userName && (

            <div
              className='absolute w-full flex items-center gap-[10px] text-white h-[70px] bottom-0 p-2 left-0 cursor-pointer bg-gradient-to-t from-black/80 to-transparent'
              onClick={() => setShowViewers(true)}
            >

              {/* Total viewers count */}
              <div className='text-white flex items-center gap-[5px]'>
                <FaEye /> {storyData?.viewers?.length || 0}
              </div>

              {/* Viewers profile preview */}
              <div className='flex relative w-[100px] h-[30px]'>

                {/* Sirf pehle 3 viewers show ho rahe hain */}
                {storyData?.viewers?.slice(0, 3).map((viewer, index) => (

                  <div
                    key={viewer?._id || index}
                    className="w-[30px] h-[30px] border-2 border-black rounded-full overflow-hidden absolute"
                    style={{ left: `${index * 15}px`, zIndex: 3 - index }}
                  >

                    <img
                      src={viewer?.profileImage || dp}
                      alt=""
                      className='w-full h-full object-cover'
                    />

                  </div>
                ))}

              </div>

            </div>
          )}
        </>
      ) : (

        // Expanded viewers section
        <>
          {/* Story preview top section */}
          <div
            className='w-full h-[30%] flex items-center justify-center mt-[100px] cursor-pointer py-[30px] overflow-hidden'
            onClick={() => setShowViewers(false)}
          >

            {/* Image preview */}
            {storyData?.mediaType === "image" && (
              <div className='h-full flex items-center justify-center'>
                <img
                  src={storyData?.media}
                  alt=""
                  className='h-full rounded-2xl object-cover'
                />
              </div>
            )}

            {/* Video preview */}
            {storyData?.mediaType === "video" && (
              <div className='h-full flex flex-col items-center justify-center'>
                <VideoPlayer media={storyData?.media} />
              </div>
            )}

          </div>

          {/* Full viewers list section */}
          <div className='w-full h-[70%] border-t-2 border-gray-800 p-[20px] bg-zinc-950'>

            {/* Viewers heading */}
            <div className='text-white flex items-center gap-[10px]'>

              <FaEye />

              {/* Total viewers */}
              <span>{storyData?.viewers?.length || 0}</span>

              <span>Viewers</span>

            </div>

            {/* Viewers list */}
            <div className='w-full max-h-[90%] flex flex-col gap-[15px] overflow-y-auto pt-[20px]'>

              {/* Saare viewers render ho rahe hain */}
              {storyData?.viewers?.map((viewer, index) => (

                <div
                  key={viewer?._id || index}
                  className='w-full flex items-center gap-[20px]'
                >

                  {/* Viewer profile image */}
                  <div className='w-[35px] h-[35px] md:w-[40px] md:h-[40px] border-2 border-black rounded-full overflow-hidden'>

                    <img
                      src={viewer?.profileImage || dp}
                      alt=""
                      className='w-full h-full object-cover'
                    />

                  </div>

                  {/* Viewer username */}
                  <div className='w-[120px] font-semibold truncate text-white'>
                    {viewer?.userName}
                  </div>

                </div>
              ))}

            </div>

          </div>
        </>
      )}
    </div>
  );
}

export default StoryCard;
import React, { useEffect, useState } from 'react'
import dp from "../assets/dp.webp"
import VideoPlayer from './VideoPlayer'
import { GoHeart, GoHeartFill, GoBookmarkFill } from "react-icons/go";
import { MdOutlineComment, MdOutlineBookmarkBorder } from "react-icons/md";
import { IoSendSharp } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs"
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { setPostData } from '../redux/postSlice';
import { setUserData } from '../redux/userSlice';
import FollowButton from './FollowButton';
import { useNavigate } from 'react-router-dom';

// Post component jo single post ko render karta hai
function Post({ post }) {

  // Redux se current logged in user data le rahe hain
  const { userData } = useSelector(state => state.user)

  // Redux se saari posts ka data le rahe hain
  const { postData } = useSelector(state => state.post)

  // Socket connection redux se le rahe hain
  const { socket } = useSelector(state => state.socket)

  // Comment section show/hide karne ke liye state
  const [showComment, setShowComment] = useState(false)

  // Comment input field ki value store karne ke liye
  const [message, setMessage] = useState("")

  // Three dots options open/close karne ke liye state
  const [showOptions, setShowOptions] = useState(false)

  // Delete confirmation popup open/close karne ke liye state
  const [showDeleteBox, setShowDeleteBox] = useState(false)

  // Navigation ke liye hook
  const navigate = useNavigate()

  // Redux dispatch function
  const dispatch = useDispatch()

  // Check karega ki current post ka owner logged in user hai ya nahi
  const isOwner = post.author?._id == userData?._id

  // Like handle karne wala function
  const handleLike = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/post/like/${post._id}`,
        { withCredentials: true }
      )

      const updatedPost = result.data

      const updatedPosts = postData.map(p =>
        p._id == post._id ? updatedPost : p
      )

      dispatch(setPostData(updatedPosts))

    } catch (error) {
      console.log(error)
    }
  }

  // Comment add karne wala function
  const handleComment = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/post/comment/${post._id}`,
        { message },
        { withCredentials: true }
      )

      const updatedPost = result.data

      const updatedPosts = postData.map(p =>
        p._id == post._id ? updatedPost : p
      )

      dispatch(setPostData(updatedPosts))

      // Comment add hone ke baad input clear ho jayega
      setMessage("")

    } catch (error) {
      console.log(error.response)
    }
  }

  // Save/unsave post function
  const handleSaved = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/post/saved/${post._id}`,
        { withCredentials: true }
      )

      dispatch(setUserData(result.data))

    } catch (error) {
      console.log(error.response)
    }
  }

  // Post delete function
  const handleDeletePost = async () => {
    try {

      // Backend delete API call
      await axios.delete(
        `${serverUrl}/api/post/delete/${post._id}`,
        { withCredentials: true }
      )

      // Redux state se deleted post hata rahe hain
      // Isse Home/Profile/Saved jaha bhi post dikh rahi hogi, turant remove ho jayegi
      dispatch(
        setPostData(
          postData.filter((item) => item._id !== post._id)
        )
      )

      // Delete popup close
      setShowDeleteBox(false)

      // Three dots options close
      setShowOptions(false)

    } catch (error) {
      console.log(error)
    }
  }

  // Socket events listen karne ke liye useEffect
  useEffect(() => {

    socket?.on("likedPost", (updatedData) => {
      const updatedPosts = postData.map(p =>
        p._id == updatedData.postId
          ? { ...p, likes: updatedData.likes }
          : p
      )

      dispatch(setPostData(updatedPosts))
    })

    socket?.on("commentedPost", (updatedData) => {
      const updatedPosts = postData.map(p =>
        p._id == updatedData.postId
          ? { ...p, comments: updatedData.comments }
          : p
      )

      dispatch(setPostData(updatedPosts))
    })

    return () => {
      socket?.off("likedPost")

      // Event name same hona chahiye jaisa upar hai
      socket?.off("commentedPost")
    }

  }, [socket, postData, dispatch])

  return (
    <div className='w-[90%] flex flex-col gap-[10px] bg-white items-center shadow-2xl shadow-[#00000058] rounded-2xl pb-[20px]'>

      {/* Top section */}
      <div className='w-full h-[80px] flex justify-between items-center px-[10px]'>

        {/* User info */}
        <div
          className='flex justify-center items-center md:gap-[20px] gap-[10px]'
          onClick={() => navigate(`/profile/${post.author?.userName}`)}
        >
          <div className='w-[40px] h-[40px] md:w-[60px] md:h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
            <img
              src={post.author?.profileImage || dp}
              alt=""
              className='w-full object-cover'
            />
          </div>

          <div className='w-[150px] font-semibold truncate'>
            {post?.author?.userName}
          </div>
        </div>

        {/* Right side buttons */}
        <div className='flex items-center gap-[10px]'>

          {/* Follow button sirf tab dikhega jab current user author na ho */}
          {userData?._id != post?.author?._id &&
            <FollowButton
              tailwind={
                'px-[10px] minw-[60px] md:min-w-[100px] py-[5px] h-[30px] md:h-[40px] bg-[black] text-white rounded-2xl text-[14px] md:text-[16px]'
              }
              targetUserId={post?.author?._id}
            />
          }

          {/* Agar current user post ka owner hai tabhi three dots show honge */}
          {isOwner && (
            <div className="relative">

              {/* Three dots button */}
              <BsThreeDots
                className="text-[24px] cursor-pointer"
                onClick={() => setShowOptions(!showOptions)}
              />

              {/* Three dots click karne par delete option show hoga */}
              {showOptions && (
                <div className="absolute right-0 top-[30px] bg-white border rounded-xl shadow-lg z-20">

                  <button
                    className="px-5 py-2 text-red-600 font-semibold"
                    onClick={() => {
                      // Delete confirmation popup open
                      setShowDeleteBox(true)

                      // Options menu close
                      setShowOptions(false)
                    }}
                  >
                    Delete
                  </button>

                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* Media section */}
      <div className='w-[90%] flex items-center justify-center'>

        {post.mediaType == "image" &&
          <div className='w-[90%] flex items-center justify-center'>
            <img
              src={post.media}
              alt=""
              className='w-[80%] rounded-2xl object-cover'
            />
          </div>
        }

        {post.mediaType == "video" &&
          <div className='w-[80%] flex flex-col items-center justify-center'>
            <VideoPlayer media={post.media} />
          </div>
        }

      </div>

      {/* Action buttons section */}
      <div className='w-full h-[60px] flex justify-between items-center px-[20px] mt-[10px]'>

        <div className='flex justify-center items-center gap-[10px]'>

          <div className='flex justify-center items-center gap-[5px]'>

            {!post.likes.includes(userData._id) &&
              <GoHeart
                className='w-[25px] cursor-pointer h-[25px]'
                onClick={handleLike}
              />
            }

            {post.likes.includes(userData._id) &&
              <GoHeartFill
                className='w-[25px] cursor-pointer h-[25px] text-red-600'
                onClick={handleLike}
              />
            }

            <span>{post.likes.length}</span>
          </div>

          <div
            className='flex justify-center items-center gap-[5px]'
            onClick={() => setShowComment(prev => !prev)}
          >
            <MdOutlineComment className='w-[25px] cursor-pointer h-[25px]' />
            <span>{post.comments.length}</span>
          </div>
        </div>

        <div onClick={handleSaved}>

          {!userData.saved.includes(post?._id) &&
            <MdOutlineBookmarkBorder className='w-[25px] cursor-pointer h-[25px]' />
          }

          {userData.saved.includes(post?._id) &&
            <GoBookmarkFill className='w-[25px] cursor-pointer h-[25px]' />
          }

        </div>
      </div>

      {/* Caption section */}
      {post.caption &&
        <div className='w-full px-[20px] gap-[10px] flex justify-start items-center'>
          <h1>{post?.author?.userName}</h1>
          <div>{post.caption}</div>
        </div>
      }

      {/* Comment section */}
      {showComment &&
        <div className='w-full flex flex-col gap-[30px] pb-[20px]'>

          <div className='w-full h-[80px] flex items-center justify-between px-[20px] relative'>

            <div className='w-[40px] h-[40px] md:w-[60px] md:h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
              <img
                src={post.author?.profileImage || dp}
                alt=""
                className='w-full object-cover'
              />
            </div>

            <input
              type="text"
              className='px-[10px] border-b-2 border-b-gray-500 w-[90%] outline-none h-[40px]'
              placeholder='Write comment...'
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />

            <button
              className='absolute right-[20px] cursor-pointer'
              onClick={handleComment}
            >
              <IoSendSharp className='w-[25px] h-[25px]' />
            </button>

          </div>

          <div className='w-full max-h-[300px] overflow-auto'>

            {post.comments?.map((com, index) => (
              <div
                key={index}
                className='w-full px-[20px] py-[20px] flex items-center gap-[20px] border-b-2 border-b-gray-200'
              >
                <div className='w-[40px] h-[40px] md:w-[60px] md:h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                  <img
                    src={com.author.profileImage || dp}
                    alt=""
                    className='w-full object-cover'
                  />
                </div>

                <div>{com.message}</div>
              </div>
            ))}

          </div>

        </div>
      }

      {/* Delete confirmation popup */}
      {showDeleteBox && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

          <div className="w-[90%] max-w-[350px] bg-white rounded-2xl p-5 text-center">

            <h2 className="text-[20px] font-semibold mb-3">
              Delete Post?
            </h2>

            <p className="text-gray-600 mb-5">
              Do you really want to delete it? Once it is gone, you can't see it.
            </p>

            <div className="flex justify-center gap-4">

              {/* Cancel karne par popup close ho jayega */}
              <button
                className="px-5 py-2 rounded-xl bg-gray-200"
                onClick={() => setShowDeleteBox(false)}
              >
                Cancel
              </button>

              {/* Delete karne par post permanently delete hogi */}
              <button
                className="px-5 py-2 rounded-xl bg-red-600 text-white"
                onClick={handleDeletePost}
              >
                Delete
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Post
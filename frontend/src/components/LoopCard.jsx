import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import { FiVolume2 } from "react-icons/fi";
import { FiVolumeX } from "react-icons/fi";
import dp from "../assets/dp.webp"
import FollowButton from './FollowButton';
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineComment } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { setLoopData } from '../redux/loopSlice';
import axios from 'axios';
import { serverUrl } from '../App';
import { IoSendSharp } from "react-icons/io5";

function LoopCard({ loop }) {

    // Video element ko access karne ke liye ref
    const videoRef = useRef()

    // Video play/pause state
    const [isPlaying, setIsPlaying] = useState(true)

    // Video mute/unmute state
    const [isMute, setIsMute] = useState(false)

    // Video progress percentage
    const [progress, setProgress] = useState(0)

    // Redux store se current user data le raha hai
    const { userData } = useSelector(state => state.user)

    // Redux store se socket data le raha hai
    const { socket } = useSelector(state => state.socket)

    // Redux store se loops data le raha hai
    const { loopData } = useSelector(state => state.loop)

    // Double click heart animation state
    const [showHeart, setShowHeart] = useState(false)

    // Comment section show/hide state
    const [showComment, setShowComment] = useState(false)

    // Comment input message state
    const [message, setMessage] = useState("")

    // Three dots options open/close karne ke liye state
    const [showOptions, setShowOptions] = useState(false)

    // Delete confirmation popup open/close karne ke liye state
    const [showDeleteBox, setShowDeleteBox] = useState(false)

    // Redux dispatch use karne ke liye
    const dispatch = useDispatch()

    // Comment box ko detect karne ke liye ref
    const commentRef = useRef()

    // Check karega ki current logged in user loop/reel ka owner hai ya nahi
    const isOwner = loop.author?._id == userData?._id

    // Video progress update function
    const handleTimeUpdate = () => {

        const video = videoRef.current

        if (video) {
            const percent = (video.currentTime / video.duration) * 100
            setProgress(percent)
        }

    }

    // Double click pe like karne ka function
    const handleLikeOnDoubleClick = () => {

        // Heart animation show karega
        setShowHeart(true)

        // 6 second baad heart hide ho jayega
        setTimeout(() => setShowHeart(false), 6000)

        // Agar already like nahi hai to like karega
        { !loop.likes?.includes(userData._id) ? handleLike() : null }

    }

    // Video play/pause function
    const handleClick = () => {

        if (isPlaying) {
            videoRef.current.pause()
            setIsPlaying(false)
        } else {
            videoRef.current.play()
            setIsPlaying(true)
        }

    }

    // Like API function
    const handleLike = async () => {

        try {
            const result = await axios.get(
                `${serverUrl}/api/loop/like/${loop._id}`,
                { withCredentials: true }
            )

            const updatedLoop = result.data

            const updatedLoops = loopData.map(p =>
                p._id == loop._id ? updatedLoop : p
            )

            dispatch(setLoopData(updatedLoops))

        } catch (error) {
            console.log(error)
        }

    }

    // Comment API function
    const handleComment = async () => {

        try {
            const result = await axios.post(
                `${serverUrl}/api/loop/comment/${loop._id}`,
                { message },
                { withCredentials: true }
            )

            const updatedLoop = result.data

            const updatedLoops = loopData.map(p =>
                p._id == loop._id ? updatedLoop : p
            )

            dispatch(setLoopData(updatedLoops))

            // Input empty kar raha hai
            setMessage("")

        } catch (error) {
            console.log(error)
        }

    }

    // Loop/reel delete function
    const handleDeleteLoop = async () => {

        try {

            // Backend delete API call
            await axios.delete(
                `${serverUrl}/api/loop/delete/${loop._id}`,
                { withCredentials: true }
            )

            // Redux state se deleted loop hata raha hai
            // Isse loop Home/Profile/Reels page jaha bhi dikh rahi hogi, turant remove ho jayegi
            dispatch(
                setLoopData(
                    loopData.filter((item) => item._id !== loop._id)
                )
            )

            // Delete popup close
            setShowDeleteBox(false)

            // Options menu close
            setShowOptions(false)

        } catch (error) {
            console.log(error)
        }

    }

    // Comment box ke bahar click hone pe comment section close karega
    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                commentRef.current &&
                !commentRef.current.contains(event.target)
            ) {
                setShowComment(false)
            }

        }

        if (showComment) {
            document.addEventListener("mousedown", handleClickOutside)
        } else {
            document.removeEventListener("mousedown", handleClickOutside)
        }

    }, [showComment])

    // Video viewport me aane pe autoplay karega
    useEffect(() => {

        const observer = new IntersectionObserver(([entry]) => {

            const video = videoRef.current

            if (entry.isIntersecting) {
                video.play()
                setIsPlaying(true)
            } else {
                video.pause()
                setIsPlaying(false)
            }

        }, { threshold: 0.6 })

        if (videoRef.current) {
            observer.observe(videoRef.current)
        }

        return () => {

            if (videoRef.current) {
                observer.unobserve(videoRef.current)
            }

        }

    }, [])

    // Real time socket events handle kar raha hai
    useEffect(() => {

        socket?.on("likedLoop", (updatedData) => {

            const updatedLoops = loopData.map(p =>
                p._id == updatedData.loopId
                    ? { ...p, likes: updatedData.likes }
                    : p
            )

            dispatch(setLoopData(updatedLoops))

        })

        socket?.on("commentedLoop", (updatedData) => {

            const updatedLoops = loopData.map(p =>
                p._id == updatedData.loopId
                    ? { ...p, comments: updatedData.comments }
                    : p
            )

            dispatch(setLoopData(updatedLoops))

        })

        return () => {
            socket?.off("likedLoop")
            socket?.off("commentedLoop")
        }

    }, [socket, loopData, dispatch])

    return (

        // Main loop card container
        <div className='w-full lg:w-[480px] h-[100vh] flex items-center justify-center border-l-2 border-r-2 border-gray-800 relative overflow-hidden'>

            {/* Agar current user loop ka owner hai tabhi three dots show honge */}
            {isOwner && (
                <div className='absolute top-[60px] right-[20px] z-[300]'>

                    {/* Three dots button */}
                    <BsThreeDots
                        className='text-white text-[28px] cursor-pointer'
                        onClick={() => setShowOptions(!showOptions)}
                    />

                    {/* Three dots click karne par delete option show hoga */}
                    {showOptions && (
                        <div className='absolute right-0 top-[35px] bg-white rounded-xl shadow-lg z-[400]'>

                            <button
                                className='px-5 py-2 text-red-600 font-semibold'
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

            {/* Delete confirmation popup */}
            {/* Delete confirmation popup */}
            {showDeleteBox && (
                <div
                    className='fixed inset-0 bg-black/60 flex justify-center items-center z-[500]'
                    onClick={() => setShowDeleteBox(false)}
                >

                    <div
                        className='w-[90%] max-w-[350px] bg-white rounded-2xl p-5 text-center'
                        onClick={(e) => e.stopPropagation()}
                    >

                        <h2 className='text-[20px] font-semibold mb-3'>
                            Delete Reel?
                        </h2>

                        <p className='text-gray-600 mb-5'>
                            Do you really want to delete it? Once it is gone, you can't see it.
                        </p>

                        <div className='flex justify-center gap-4'>

                            {/* Cancel karne par popup close ho jayega */}
                            <button
                                className='px-5 py-2 rounded-xl bg-gray-200'
                                onClick={() => setShowDeleteBox(false)}
                            >
                                Cancel
                            </button>

                            {/* Delete karne par loop/reel permanently delete hogi */}
                            <button
                                className='px-5 py-2 rounded-xl bg-red-600 text-white'
                                onClick={handleDeleteLoop}
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </div>
            )}

            {/* Heart animation */}
            {showHeart &&
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 heart-animation z-50'>
                    <GoHeartFill className='w-[100px] h-[100px] text-white drop-shadow-2xl' />
                </div>
            }

            {/* Comment section */}
            <div
                ref={commentRef}
                className={`absolute z-[200] bottom-0 w-full h-[500px] p-[10px] rounded-t-4xl bg-[#0e1718] transform transition-transform duration-500 ease-in-out left-0 shadow-2xl shadow-black ${showComment ? "translate-y-0" : "translate-y-[100%]"}`}
            >

                <h1 className='text-white text-[20px] text-center font-semibold'>
                    Comments
                </h1>

                <div className='w-full h-[350px] overflow-y-auto flex flex-col gap-[20px]'>

                    {loop.comments.length == 0 &&
                        <div className='text-center text-white text-[20px] font-semibold mt-[50px]'>
                            No Comments Yet
                        </div>
                    }

                    {loop.comments?.map((com, index) => (
                        <div
                            key={index}
                            className='w-full flex flex-col gap-[5px] border-b-[1px] border-gray-800 justify-center pb-[10px] mt-[10px]'
                        >

                            <div className='flex justify-start items-center md:gap-[20px] gap-[10px]'>

                                <div className='w-[30px] h-[30px] md:w-[40px] md:h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                                    <img
                                        src={com.author?.profileImage || dp}
                                        alt=""
                                        className='w-full object-cover'
                                    />
                                </div>

                                <div className='w-[150px] font-semibold text-white truncate'>
                                    {com.author?.userName}
                                </div>

                            </div>

                            <div className='text-white pl-[60px]'>
                                {com.message}
                            </div>

                        </div>
                    ))}

                </div>

                <div className='w-full fixed bottom-0 h-[80px] flex items-center justify-between px-[20px] py-[20px]'>

                    <div className='w-[30px] h-[30px] md:w-[40px] md:h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                        <img
                            src={loop.author?.profileImage || dp}
                            alt=""
                            className='w-full object-cover'
                        />
                    </div>

                    <input
                        type="text"
                        className='px-[10px] border-b-2 border-b-gray-500 w-[90%] text-white placeholder:text-white outline-none h-[40px]'
                        placeholder='Write comment...'
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                    />

                    {message &&
                        <button
                            className='absolute right-[20px] cursor-pointer'
                            onClick={handleComment}
                        >
                            <IoSendSharp className='w-[25px] h-[25px] text-white' />
                        </button>
                    }

                </div>

            </div>

            {/* Loop video */}
            <video
                ref={videoRef}
                autoPlay
                muted={isMute}
                loop
                src={loop?.media}
                className='w-full max-h-full'
                onClick={handleClick}
                onTimeUpdate={handleTimeUpdate}
                onDoubleClick={handleLikeOnDoubleClick}
            />

            {/* Mute/unmute button */}
            <div
                className='absolute top-[20px] z-[100] right-[20px]'
                onClick={() => setIsMute(prev => !prev)}
            >
                {!isMute
                    ? <FiVolume2 className='w-[20px] h-[20px] text-white font-semibold' />
                    : <FiVolumeX className='w-[20px] h-[20px] text-white font-semibold' />
                }
            </div>

            {/* Video progress bar */}
            <div className='absolute bottom-0 w-full h-[5px] bg-gray-900'>
                <div
                    className='h-full w-[200px] bg-white transition-all duration-200 ease-linear'
                    style={{ width: `${progress}%` }}
                >
                </div>
            </div>

            {/* Bottom content */}
            <div className='w-full absolute h-[100px] bottom-[10px] p-[10px] flex flex-col gap-[10px]'>

                <div className='flex items-center gap-[5px]'>

                    <div className='w-[30px] h-[30px] md:w-[40px] md:h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                        <img
                            src={loop.author?.profileImage || dp}
                            alt=""
                            className='w-full object-cover'
                        />
                    </div>

                    <div className='w-[120px] font-semibold truncate text-white'>
                        {loop.author.userName}
                    </div>

                    {/* Follow button sirf dusre user ki loop pe dikhega */}
                    {userData?._id != loop.author?._id &&
                        <FollowButton
                            targetUserId={loop.author?._id}
                            tailwind={"px-[10px] py-[5px] text-white border-2 text-[14px] rounded-2xl border-white"}
                        />
                    }

                </div>

                <div className='text-white px-[10px]'>
                    {loop.caption}
                </div>

                <div className='absolute right-0 flex flex-col gap-[20px] text-white bottom-[150px] justify-center px-[10px]'>

                    <div className='flex flex-col items-center cursor-pointer'>

                        <div onClick={handleLike}>

                            {!loop.likes.includes(userData._id) &&
                                <GoHeart className='w-[25px] cursor-pointer h-[25px]' />
                            }

                            {loop.likes.includes(userData._id) &&
                                <GoHeartFill className='w-[25px] cursor-pointer h-[25px] text-red-600' />
                            }

                        </div>

                        <div>
                            {loop.likes.length}
                        </div>

                    </div>

                    <div
                        className='flex flex-col items-center cursor-pointer'
                        onClick={() => setShowComment(true)}
                    >

                        <div>
                            <MdOutlineComment className='w-[25px] cursor-pointer h-[25px]' />
                        </div>

                        <div>
                            {loop.comments.length}
                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default LoopCard
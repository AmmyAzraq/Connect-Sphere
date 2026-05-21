import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setProfileData, setUserData } from '../redux/userSlice'
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import dp from "../assets/dp.webp"
import Nav from '../components/Nav'
import FollowButton from '../components/FollowButton'
import Post from '../components/Post'
import Loop from '../components/LoopCard'
import { setSelectedUser } from '../redux/messageSlice'

function Profile() {

    const { userName } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [postType, setPostType] = useState("posts")

    // Settings popup states
    const [showSettings, setShowSettings] = useState(false)
    const [showDeletePopup, setShowDeletePopup] = useState(false)

    const { profileData, userData } = useSelector(state => state.user)
    const { postData } = useSelector(state => state.post)
    const { loopData } = useSelector(state => state.loop)

    const handleProfile = async () => {
        try {
            const result = await axios.get(
                `${serverUrl}/api/user/getProfile/${userName}`,
                { withCredentials: true }
            )

            dispatch(setProfileData(result.data))

        } catch (error) {
            console.log(error)
        }
    }

    const handleLogOut = async () => {
        try {
            await axios.get(
                `${serverUrl}/api/auth/signout`,
                { withCredentials: true }
            )

            dispatch(setUserData(null))
            navigate("/signin")

        } catch (error) {
            console.log(error)
        }
    }

    // Delete account function
    const handleDeleteAccount = async () => {
        try {
            const result=await axios.delete(
                `${serverUrl}/api/user/deleteAccount`,
                { withCredentials: true }
            )

            console.log(result.data)

            dispatch(setUserData(null))
            dispatch(setProfileData(null))
            navigate("/signup")

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleProfile()
    }, [userName, dispatch])

    return (
        <div className='w-full min-h-screen bg-[#1E2A44]'>

            {/* Top navbar */}
            <div className='w-full h-[80px] flex justify-between items-center px-[30px] text-[#F8F8F6] relative'>

                <div onClick={() => navigate("/")}>
                    <MdOutlineKeyboardBackspace className='text-[#F8F8F6] cursor-pointer w-[25px] h-[25px]' />
                </div>

                <div className='font-semibold text-[20px]'>
                    {profileData?.userName}
                </div>

                {/* Three dots only own profile */}
                {profileData?._id == userData?._id ? (
                    <div className='relative'>
                        <BsThreeDotsVertical
                            className='text-[#F8F8F6] cursor-pointer w-[25px] h-[25px]'
                            onClick={() => setShowSettings(true)}
                        />
                    </div>
                ) : (
                    <div className='w-[25px]'></div>
                )}

            </div>

            {/* Settings dialog */}
            {showSettings && (
                <div className='fixed inset-0 bg-[#1E2A44]/70 flex justify-center items-center z-50'>
                    <div className='w-[90%] max-w-[350px] bg-[#F8F8F6] rounded-2xl p-[20px] flex flex-col gap-[15px]'>

                        <div className='text-[22px] font-semibold text-center text-[#1E2A44]'>
                            Settings
                        </div>

                        <button
                            className='w-full h-[45px] bg-[#1E2A44] text-[#F8F8F6] rounded-xl cursor-pointer'
                            onClick={() => {
                                setShowSettings(false)
                                navigate("/editprofile")
                            }}
                        >
                            Edit Profile
                        </button>

                        <button
                            className='w-full h-[45px] bg-[#1E2A44] text-[#F8F8F6] rounded-xl cursor-pointer'
                            onClick={handleLogOut}
                        >
                            Log Out
                        </button>

                        <button
                            className='w-full h-[45px] bg-red-600 text-[#F8F8F6] rounded-xl cursor-pointer'
                            onClick={() => {
                                setShowSettings(false)
                                setShowDeletePopup(true)
                            }}
                        >
                            Delete Account
                        </button>

                        <button
                            className='w-full h-[40px] border border-[#1E2A44] text-[#1E2A44] rounded-xl cursor-pointer'
                            onClick={() => setShowSettings(false)}
                        >
                            Cancel
                        </button>

                    </div>
                </div>
            )}

            {/* Delete confirmation popup */}
            {showDeletePopup && (
                <div className='fixed inset-0 bg-[#1E2A44]/70 flex justify-center items-center z-50'>
                    <div className='w-[90%] max-w-[380px] bg-[#F8F8F6] rounded-2xl p-[20px] flex flex-col gap-[15px]'>

                        <div className='text-[22px] font-semibold text-center text-red-600'>
                            Delete Account?
                        </div>

                        <p className='text-center text-[16px] text-[#1E2A44]'>
                            If you delete this account, you cannot open this account again.
                        </p>

                        <button
                            className='w-full h-[45px] bg-red-600 text-[#F8F8F6] rounded-xl cursor-pointer'
                            onClick={handleDeleteAccount}
                        >
                            Yes, Delete
                        </button>

                        <button
                            className='w-full h-[40px] border border-[#1E2A44] text-[#1E2A44] rounded-xl cursor-pointer'
                            onClick={() => setShowDeletePopup(false)}
                        >
                            Cancel
                        </button>

                    </div>
                </div>
            )}

            {/* Profile section */}
            <div className='w-full h-[150px] flex items-start gap-[20px] lg:gap-[50px] pt-[20px] px-[10px] justify-center'>

                <div className='w-[80px] h-[80px] md:w-[140px] md:h-[140px] border-2 border-[#B7BDC6] rounded-full cursor-pointer overflow-hidden'>
                    <img
                        src={profileData?.profileImage || dp}
                        alt=""
                        className='w-full object-cover'
                    />
                </div>

                <div>
                    <div className='font-semibold text-[22px] text-[#F8F8F6]'>
                        {profileData?.name}
                    </div>

                    <div className='text-[17px] text-[#B7BDC6]'>
                        {profileData?.profession || "New User"}
                    </div>

                    <div className='text-[17px] text-[#B7BDC6]'>
                        {profileData?.bio}
                    </div>
                </div>

            </div>

            {/* Posts Followers Following */}
            <div className='w-full h-[100px] flex items-center justify-center gap-[40px] md:gap-[60px] px-[20%] pt-[30px] text-[#F8F8F6]'>

                <div>
                    <div className='text-[#F8F8F6] text-[22px] md:text-[30px] font-semibold'>
                        {(profileData?.posts?.length || 0) + (profileData?.loops?.length || 0)}
                    </div>

                    <div className='text-[18px] md:text-[22px] text-[#B7BDC6]'>
                        Posts
                    </div>
                </div>

                <div>
                    <div className='flex items-center justify-center gap-[20px]'>

                        <div className='flex relative'>
                            {profileData?.followers?.slice(0, 3).map((user, index) => (
                                <div
                                    key={user?._id || index}
                                    className={`w-[40px] h-[40px] border-2 border-[#1E2A44] rounded-full cursor-pointer overflow-hidden ${index > 0 ? `absolute left-[${index * 9}px]` : ""}`}
                                >
                                    <img
                                        src={user.profileImage || dp}
                                        alt=""
                                        className='w-full object-cover'
                                    />
                                </div>
                            ))}
                        </div>

                        <div className='text-[#F8F8F6] text-[22px] md:text-[30px] font-semibold'>
                            {profileData?.followers?.length}
                        </div>

                    </div>

                    <div className='text-[18px] md:text-[22px] text-[#B7BDC6]'>
                        Followers
                    </div>
                </div>

                <div>
                    <div className='flex items-center justify-center gap-[20px]'>

                        <div className='flex relative'>
                            {profileData?.following?.slice(0, 3).map((user, index) => (
                                <div
                                    key={user?._id || index}
                                    className={`w-[40px] h-[40px] border-2 border-[#1E2A44] rounded-full cursor-pointer overflow-hidden ${index > 0 ? `absolute left-[${index * 10}px]` : ""}`}
                                >
                                    <img
                                        src={user?.profileImage || dp}
                                        alt=""
                                        className='w-full object-cover'
                                    />
                                </div>
                            ))}
                        </div>

                        <div className='text-[#F8F8F6] text-[22px] md:text-[30px] font-semibold'>
                            {profileData?.following?.length}
                        </div>

                    </div>

                    <div className='text-[18px] md:text-[22px] text-[#B7BDC6]'>
                        Following
                    </div>
                </div>

            </div>

            {/* Buttons section */}
            <div className='w-full h-[80px] flex justify-center items-center gap-[20px] mt-[10px]'>

                {/* Dusre user ki profile hai to Follow + Message */}
                {profileData?._id != userData?._id &&
                    <>
                        <FollowButton
                            tailwind={'px-[10px] min-w-[150px] py-[5px] h-[40px] bg-[#F8F8F6] text-[#1E2A44] cursor-pointer rounded-2xl'}
                            targetUserId={profileData?._id}
                            onFollowChange={handleProfile}
                        />

                        <button
                            className='px-[10px] min-w-[150px] py-[5px] h-[40px] bg-[#F8F8F6] text-[#1E2A44] cursor-pointer rounded-2xl'
                            onClick={() => {
                                dispatch(setSelectedUser(profileData))
                                navigate("/messageArea")
                            }}
                        >
                            Message
                        </button>
                    </>
                }

            </div>

            {/* Bottom white section */}
            <div className='w-full min-h-[100vh] flex justify-center'>

                <div className='w-full max-w-[900px] flex flex-col items-center rounded-t-[30px] bg-[#F8F8F6] relative gap-[20px] pt-[30px] pb-[100px]'>

                    {profileData?._id == userData?._id &&
                        <div className='w-[90%] max-w-[500px] h-[80px] bg-[#F8F8F6] rounded-full flex justify-center items-center gap-[10px]'>

                            <div
                                className={`${postType == "posts"
                                    ? "bg-[#1E2A44] text-[#F8F8F6] shadow-2xl shadow-[#1E2A44]"
                                    : "text-[#1E2A44]"
                                    } w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-[#1E2A44] rounded-full hover:text-[#F8F8F6] cursor-pointer hover:shadow-2xl hover:shadow-[#1E2A44]`}
                                onClick={() => setPostType("posts")}
                            >
                                Posts
                            </div>

                            <div
                                className={`${postType == "saved"
                                    ? "bg-[#1E2A44] text-[#F8F8F6] shadow-2xl shadow-[#1E2A44]"
                                    : "text-[#1E2A44]"
                                    } w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-[#1E2A44] rounded-full hover:text-[#F8F8F6] cursor-pointer hover:shadow-2xl hover:shadow-[#1E2A44]`}
                                onClick={() => setPostType("saved")}
                            >
                                Saved
                            </div>

                        </div>
                    }

                    <Nav />

                    {profileData?._id == userData?._id && <>

                        {postType == "posts" && postData?.map((post) => (
                            post.author?._id == profileData?._id &&
                            <div
                                key={post._id}
                                className='w-full flex justify-center border-b-4 border-[#B7BDC6] [&_svg]:!text-[#1E2A44]'
                            >
                                <Post post={post} />
                            </div>
                        ))}

                        {postType == "posts" && loopData?.map((loop) => (
                            loop.author?._id == profileData?._id &&
                            <div
                                key={loop._id}
                                className='w-full flex justify-center border-b-4 border-[#B7BDC6] [&_svg]:!text-[#1E2A44] [&_.text-white]:!text-[#1E2A44]'
                            >
                                <Loop loop={loop} />
                            </div>
                        ))}

                        {postType == "saved" && postData?.map((post) => (
                            userData?.saved?.includes(post._id) &&
                            <div
                                key={post._id}
                                className='w-full flex justify-center border-b-4 border-[#B7BDC6] [&_svg]:!text-[#1E2A44]'
                            >
                                <Post post={post} />
                            </div>
                        ))}

                    </>}

                    {profileData?._id != userData?._id &&
                        postData?.map((post) => (
                            post.author?._id == profileData?._id &&
                            <div
                                key={post._id}
                                className='w-full flex justify-center border-b-4 border-[#B7BDC6] [&_svg]:!text-[#1E2A44]'
                            >
                                <Post post={post} />
                            </div>
                        ))
                    }

                    {profileData?._id != userData?._id &&
                        loopData?.map((loop) => (
                            loop.author?._id == profileData?._id &&
                            <div
                                key={loop._id}
                                className='w-full flex justify-center border-b-4 border-[#B7BDC6] [&_svg]:!text-[#1E2A44] [&_.text-white]:!text-[#1E2A44]'
                            >
                                <Loop loop={loop} />
                            </div>
                        ))
                    }

                </div>

            </div>

        </div>
    )
}

export default Profile
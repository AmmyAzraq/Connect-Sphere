// Import React hooks
import React, { useEffect, useRef, useState } from 'react'

// Import Redux hooks
import { useDispatch, useSelector } from 'react-redux'

// Import navigation hook
import { useNavigate } from 'react-router-dom'

// Import back arrow icon
import { MdOutlineKeyboardBackspace } from "react-icons/md";

// Import image icon
import { LuImage } from "react-icons/lu";

// Import send icon
import { IoMdSend } from "react-icons/io";

// Import default profile image
import dp from "../assets/dp.webp"

// Import sender message component
import SenderMessage from '../components/SenderMessage';

// Import axios for API requests
import axios from 'axios';

// Import backend server URL
import { serverUrl } from '../App';

// Import Redux action for messages
import { setMessages } from '../redux/messageSlice';

// Import receiver message component
import ReceiverMessage from '../components/ReceiverMessage';

function MessageArea() {

  // Getting selected user and messages from Redux store
  const { selectedUser, messages } = useSelector(state => state.message)

  // Getting logged-in user data from Redux store
  const { userData } = useSelector(state => state.user)

  // Getting socket connection from Redux store
  const { socket } = useSelector(state => state.socket)

  // Hook for page navigation
  const navigate = useNavigate()

  // State for message input
  const [input, setInput] = useState("")

  // Redux dispatch function
  const dispatch = useDispatch()

  // Reference for hidden image input
  const imageInput = useRef()

  // State for showing selected image preview
  const [frontendImage, setFrontendImage] = useState(null)

  // State for storing selected image file for backend
  const [backendImage, setBackendImage] = useState(null)

  // Function to handle selected image
  const handleImage = (e) => {

    // Getting selected image file
    const file = e.target.files[0]

    // Store image file for backend upload
    setBackendImage(file)

    // Create temporary preview URL for frontend
    setFrontendImage(URL.createObjectURL(file))
  }

  // Function to send message
  const handleSendMessage = async (e) => {

    // Prevent page reload on form submit
    e.preventDefault()

    try {

      // Creating FormData because message can include image
      const formData = new FormData()

      // Add text message to FormData
      formData.append("message", input)

      // Add image only if user selected one
      if (backendImage) {
        formData.append("image", backendImage)
      }

      // API request to send message to selected user
      const result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true } // Sends cookies/token with request
      )

      // Add new message to Redux messages array
      dispatch(setMessages([...messages, result.data]))

      // Clear message input after sending
      setInput("")

      // Clear backend image
      setBackendImage(null)

      // Clear frontend image preview
      setFrontendImage(null)

    } catch (error) {

      // Print error in console
      console.log(error)
    }
  }

  // Function to fetch all messages with selected user
  const getAllMessages = async () => {
    try {

      // API request to get all messages of selected chat
      const result = await axios.get(
        `${serverUrl}/api/message/getAll/${selectedUser._id}`,
        { withCredentials: true } // Sends cookies/token with request
      )

      // Store all fetched messages in Redux
      dispatch(setMessages(result.data))

    } catch (error) {

      // Print error in console
      console.log(error)
    }
  }

  // Fetch messages when this component mounts
  useEffect(() => {
    getAllMessages()
  }, [])

  // Listen for new real-time messages from socket
  useEffect(() => {

    // When newMessage event comes, add it to messages
    socket?.on("newMessage", (mess) => {
      dispatch(setMessages([...messages, mess]))
    })

    // Remove socket listener when component unmounts or effect reruns
    return () => socket?.off("newMessage")

  }, [messages, setMessages])

  return (

   // Main message page container
<div className='w-full h-[100vh] bg-[#1E2A44] relative'>

  {/* Top chat header */}
  <div className='w-full flex items-center gap-[15px] px-[20px] py-[10px] fixed top-0 z-[100] bg-[#1E2A44] border-b border-[#B7BDC6]'>

    {/* Back button container */}
    <div className='h-[80px] flex items-center gap-[20px] px-[20px]'>

      {/* Back button */}
      <MdOutlineKeyboardBackspace
        className='text-[#F8F8F6] cursor-pointer w-[25px] h-[25px]'
        onClick={() => navigate(`/`)}
      />
    </div>

    {/* Selected user's profile image */}
    <div
      className='w-[40px] h-[40px] border-2 border-[#B7BDC6] rounded-full cursor-pointer overflow-hidden'
      onClick={() => navigate(`/profile/${selectedUser.userName}`)}
    >
      <img src={selectedUser.profileImage || dp} alt="" className='w-full object-cover' />
    </div>

    {/* Selected user's name and username */}
    <div className='text-[#F8F8F6] text-[18px] font-semibold'>
      <div>{selectedUser.userName}</div>
      <div className='text-[14px] text-[#B7BDC6]'>{selectedUser.name}</div>
    </div>

  </div>

  {/* Messages list area */}
  <div className='w-full h-[80%] pt-[100px] px-[40px] flex flex-col gap-[50px] overflow-auto bg-[#1E2A44]'>

    {/* Render sender or receiver message based on sender id */}
    {messages && messages?.map((mess, index) =>
      mess.sender == userData._id
        ? <SenderMessage message={mess} />
        : <ReceiverMessage message={mess} />
    )}
  </div>

  {/* Bottom message input area */}
  <div className='w-full h-[80px] fixed bottom-0 flex justify-center items-center bg-[#1E2A44] z-[100]'>

    {/* Message form */}
    <form
      className='w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#F8F8F6] flex items-center gap-[10px] px-[20px] relative border border-[#B7BDC6]'
      onSubmit={handleSendMessage}
    >

      {/* Selected image preview */}
      {frontendImage &&
        <div className='w-[100px] rounded-2xl h-[100px] absolute top-[-120px] right-[10px] overflow-hidden border border-[#B7BDC6]'>
          <img src={frontendImage} alt="" className='h-full object-cover' />
        </div>
      }

      {/* Hidden image input */}
      <input
        type="file"
        accept='image/*'
        hidden
        ref={imageInput}
        onChange={handleImage}
      />

      {/* Text message input */}
      <input
        type="text"
        placeholder='Message'
        className='w-full h-full px-[20px] text-[18px] text-[#1E2A44] outline-0 bg-transparent'
        onChange={(e) => setInput(e.target.value)}
        value={input}
      />

      {/* Image select button */}
      <div onClick={() => imageInput.current.click()}>
        <LuImage className='w-[28px] h-[28px] text-[#1E2A44]' />
      </div>

      {/* Send button appears only when input or image exists */}
      {(input || frontendImage) &&
        <button className='w-[60px] h-[40px] rounded-full bg-[#1E2A44] flex items-center justify-center cursor-pointer'>
          <IoMdSend className='w-[25px] h-[25px] text-[#F8F8F6]' />
        </button>
      }

    </form>
  </div>

</div>
  )
}

export default MessageArea
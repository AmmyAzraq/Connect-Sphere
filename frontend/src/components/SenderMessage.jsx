import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { HiOutlineDotsVertical } from "react-icons/hi";
import axios from 'axios'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { deleteMessageFromState } from '../redux/messageSlice'

// SenderMessage component
// Ye current logged in user ke messages show karta hai
function SenderMessage({ message }) {

  const dispatch = useDispatch()

    // Redux se current user ka data le rahe hain
    const { userData } = useSelector(state => state.user)

    // Auto scroll ke liye ref create kiya hai
    const scroll = useRef()

    // Options box ke liye ref
    // Isse pata chalega click box ke andar hua ya bahar
    const optionsRef = useRef(null)

    // Three dots options show/hide state
    const [showOptions, setShowOptions] = useState(false)

    // Jab bhi naya message ya image aaye
    // tab automatically latest message tak scroll hoga
    useEffect(() => {
        if (scroll.current) {
            scroll.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [message.message, message.image])

    // Bahar click karne par delete option box close hoga
    useEffect(() => {

        const handleClickOutside = (e) => {

            // Agar options box open hai aur click box ke bahar hua hai
            if (optionsRef.current && !optionsRef.current.contains(e.target)) {
                setShowOptions(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        // Component unmount hone par event remove karna zaroori hai
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }

    }, [])

    // Message delete function
    const handleDeleteMessage = async () => {
    try {

        const result = await axios.delete(
            `${serverUrl}/api/message/delete/${message._id}`,
            { withCredentials: true }
        )

        // Redux state se bhi message hata do
        dispatch(deleteMessageFromState(result.data.deletedMessageId))

        // Options close
        setShowOptions(false)

    } catch (error) {
        console.log(error)
    }
}

    return (

        // Main sender message container
        // ml-auto ki wajah se message right side par show hoga
        <div
            ref={scroll}
            className='w-fit max-w-[60%] bg-white rounded-t-2xl rounded-bl-2xl rounded-br-0 px-[10px] py-[10px] relative ml-auto right-0 flex flex-col gap-[10px]'
        >

            {/* Three vertical dots button aur delete option */}
            <div
                ref={optionsRef}
                className='absolute top-[8px] right-[8px]'
            >

                <HiOutlineDotsVertical
                    className='text-[20px] cursor-pointer text-gray-600'
                    onClick={() => setShowOptions(!showOptions)}
                />

                {/* Delete option box */}
                {showOptions &&
                    <div className='absolute right-0 top-[25px] bg-white shadow-lg border rounded-lg px-[15px] py-[8px] z-50'>

                        <button
                            onClick={handleDeleteMessage}
                            className='text-red-500 text-[14px] font-medium'
                        >
                            Delete
                        </button>

                    </div>
                }

            </div>

            {/* Agar message ke sath image hai to image render hogi */}
            {message.image &&
                <img
                    src={message.image}
                    alt=""
                    className='h-[200px] object-cover rounded-2xl'
                />
            }

            {/* Agar text message hai to text render hoga */}
            {message.message &&
                <div className='text-[18px] text-[#1E2A44] break-words pr-[20px]'>
                    {message.message}
                </div>
            }

            {/* Current user ka profile image */}
            <div className='w-[30px] h-[30px] rounded-full cursor-pointer overflow-hidden absolute right-[-25px] bottom-[-40px]'>

                <img
                    src={userData?.profileImage}
                    alt=""
                    className='w-full h-full object-cover'
                />

            </div>

        </div>
    )
}

export default SenderMessage
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { BsThreeDotsVertical } from "react-icons/bs"
import axios from 'axios'
import { serverUrl } from '../App'

function ReceiverMessage({ message }) {

    const { selectedUser } = useSelector(state => state.message)

    const scroll = useRef()

    const [showOptions, setShowOptions] = useState(false)

    useEffect(() => {
        scroll.current.scrollIntoView({ behavior: "smooth" })
    }, [message.message, message.image])

    

    return (
        <div
            ref={scroll}
            className='w-fit max-w-[60%] bg-[#F8F8F6] border border-[#B7BDC6] rounded-t-2xl rounded-br-2xl rounded-bl-0 px-[10px] py-[10px] relative left-0 flex flex-col gap-[10px]'
        >

            {message.image &&
                <img
                    src={message.image}
                    alt=""
                    className='h-[200px] object-cover rounded-2xl mt-[15px]'
                />
            }

            {message.message &&
                <div className='text-[18px] text-[#1E2A44] wrap-break-word pr-[20px]'>
                    {message.message}
                </div>
            }

            <div className='w-[30px] h-[30px] rounded-full cursor-pointer overflow-hidden absolute left-[-25px] bottom-[-40px] border border-[#B7BDC6]'>

                <img
                    src={selectedUser.profileImage}
                    alt=""
                    className='w-full object-cover'
                />

            </div>

        </div>
    )
}

export default ReceiverMessage
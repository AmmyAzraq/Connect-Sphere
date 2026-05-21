import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react'
import { FiVolume2 } from "react-icons/fi";
import { FiVolumeX } from "react-icons/fi";

// VideoPlayer component
// Ye videos ko play/pause aur mute/unmute handle karta hai
function VideoPlayer({media}) {

    // Video element ko access karne ke liye ref
    const videoTag=useRef()

    // Video mute/unmute state
    const [mute,setMute]=useState(false)

    // Video playing state
    const [isPlaying,setIsplaying]=useState(true)

    // Video play/pause toggle function
const handleClick = () => {

    // Agar video element exist nahi karta to return
    if (!videoTag.current) return

    // Agar video already play ho rahi hai
    if (isPlaying) {

        // Video pause karo
        videoTag.current?.pause()

        // State update
        setIsplaying(false)

    } else {

        // Video play karo
        videoTag.current?.play()

        // State update
        setIsplaying(true)
    }
}

// Auto play/pause using Intersection Observer
useEffect(() => {

    // Observer create kar rahe hain
    const observer = new IntersectionObserver(([entry]) => {

        // Current video element
        const video = videoTag.current

        // Agar video exist nahi karti to return
        if (!video) return

        // Agar video screen me visible hai
        if (entry.isIntersecting) {

            // Video auto play
            video.play()

            // State update
            setIsplaying(true)

        } else {

            // Screen se bahar jane par pause
            video.pause()

            // State update
            setIsplaying(false)
        }

    }, {

        // 60% visible hone par trigger hoga
        threshold: 0.6
    })

    // Agar video exist karti hai to observe karo
    if (videoTag.current) {

        observer.observe(videoTag.current)
    }

    // Cleanup function
    return () => {

        // Observer remove
        if (videoTag.current) {

            observer.unobserve(videoTag.current)
        }

        // Observer disconnect
        observer.disconnect()
    }

}, [])

  return (

    // Main video container
    <div className='h-[100%] relative cursor-pointer max-w-full rounded-2xl overflow-hidden'>

      {/* Video element */}
      <video
        ref={videoTag}
        src={media}
        autoPlay
        loop
        muted={mute}
        className='h-[100%] cursor-pointer w-full object-cover rounded-2xl'
        onClick={handleClick}
      />

      {/* Volume button */}
      <div
        className='absolute bottom-[10px] right-[10px]'
        onClick={()=>setMute(prev=>!prev)}
      >

        {/* Agar mute false hai to volume icon */}
        {!mute
          ?
          <FiVolume2 className='w-[20px] h-[20px] text-white font-semibold'/>
          :
          <FiVolumeX className='w-[20px] h-[20px] text-white font-semibold'/>
        }

      </div>

    </div>
  )
}

export default VideoPlayer
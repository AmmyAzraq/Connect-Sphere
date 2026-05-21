import axios from 'axios'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { setFollowing, toggleFollow } from '../redux/userSlice'

function FollowButton({ targetUserId, tailwind, onFollowChange }) {

    // Redux store se following list le raha hai
    const { following } = useSelector(state => state.user)

    // Check kar raha hai current user target user ko follow karta hai ya nahi
    const isFollowing = following.includes(targetUserId)

    // Redux dispatch use karne ke liye
    const dispatch = useDispatch()

    // Follow / Unfollow function
    const handleFollow = async () => {

        try {

            // Backend API call follow/unfollow ke liye
            const result = await axios.get(
                `${serverUrl}/api/user/follow/${targetUserId}`,
                { withCredentials: true }
            )

            // Agar parent component se callback mila hai to usse call kare
            if (onFollowChange) {
                onFollowChange()
            }

            // Redux state me following update kar raha hai
            dispatch(toggleFollow(targetUserId))

        } catch (error) {

            console.log(error)

        }

    }

    return (

        // Follow button
        <button className={tailwind} onClick={handleFollow}>

            {/* Agar already follow kar raha hai to Following show hoga warna Follow */}
            {isFollowing ? "Following" : "Follow"}

        </button>

    )
}

export default FollowButton
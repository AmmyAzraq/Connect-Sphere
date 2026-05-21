import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { setPostData } from '../redux/postSlice'
import { setLoopData } from '../redux/loopSlice'

// getAllLoops function
// Ye backend se saari loops fetch karta hai
function getAllLoops() {

    // Redux dispatch function
    const dispatch=useDispatch()

    // Redux se current user data le rahe hain
    const {userData}=useSelector(state=>state.user)

  // Component mount hone ya userData change hone par chalega
  useEffect(()=>{

    // Async function loops fetch karne ke liye
    const fetchloops=async ()=>{

        try {

            // Backend API call
            const result=await axios.get(
              `${serverUrl}/api/loop/getAll`,
              {withCredentials:true}
            )

            // Redux me loop data save kar rahe hain
            dispatch(setLoopData(result.data))

        } catch (error) {

            // Error console me print hoga
            console.log(error)
        }
    }

    // Function call
    fetchloops()

  },[dispatch,userData])
}

export default getAllLoops
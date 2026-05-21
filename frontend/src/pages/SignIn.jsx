// Import React and useState hook
import React, { useState } from 'react'

// Import app logo image
import logo from "../assets/C.png"

// Import written logo image
import logo1 from "../assets/cswritten.png"

// Import eye icon to show password
import { IoIosEye } from "react-icons/io";

// Import eye off icon to hide password
import { IoIosEyeOff } from "react-icons/io";

// Import axios for API requests
import axios from "axios"

// Import backend server URL
import { serverUrl } from '../App';

// Import loader component
import { ClipLoader } from "react-spinners";

// Import navigation hook
import { useNavigate } from 'react-router-dom';

// Import Redux dispatch hook
import { useDispatch } from 'react-redux';

// Import Redux action to store user data
import { setUserData } from '../redux/userSlice';

function SignIn() {

  // State to control floating labels
  const [inputClicked, setInputClicked] = useState({
    userName: false,
    password: false
  })

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false)

  // Loading state for sign in button
  const [loading, setLoading] = useState(false)

  // State for username input
  const [userName, setUserName] = useState("")

  // State for password input
  const [password, setPassword] = useState("")

  // State for showing error message
  const [err, setErr] = useState("")

  // Hook for page navigation
  const navigate = useNavigate()

  // Redux dispatch function
  const dispatch = useDispatch()

  // Function to handle sign in
  const handleSignIn = async () => {

    // Start loading
    setLoading(true)

    // Clear previous error
    setErr("")

    try {

      // API request for user sign in
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { userName, password },
        { withCredentials: true } // Sends cookies/token with request
      )

      // Store logged-in user data in Redux
      dispatch(setUserData(result.data))

      // Stop loading
      setLoading(false)

    } catch (error) {

      // Print error in console
      console.log(error)

      // Stop loading
      setLoading(false)

      // Show backend error message
      setErr(error.response?.data?.message)
    }
  }

  return (

    // Main page container
<div className='w-full h-screen bg-[#1E2A44] flex flex-col justify-center items-center'>

  {/* Sign in card */}
  <div className='w-[90%] lg:max-w-[60%] h-[600px] bg-[#F8F8F6] rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#B7BDC6]'>

    {/* Left form section */}
    <div className='w-full lg:w-[50%] h-full bg-[#F8F8F6] flex flex-col items-center justify-center p-[10px] gap-[20px]'>

      {/* Heading with logo */}
      <div className='flex gap-[10px] items-center text-[20px] font-semibold mt-[40px] text-[#1E2A44]'>
        <span>Sign In to </span>
        <img src={logo} alt="" className='w-[70px]' />
      </div>

      {/* Username input container */}
      <div
        className='relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-[#B7BDC6]'
        onClick={() => setInputClicked({ ...inputClicked, userName: true })}
      >

        {/* Username floating label */}
        <label
          htmlFor='userName'
          className={`text-[#1E2A44] absolute left-[20px] p-[5px] bg-[#F8F8F6] text-[15px] ${inputClicked.userName ? "top-[-15px]" : ""}`}
        >
          Enter Username
        </label>

        {/* Username input */}
        <input
          type="text"
          id='userName'
          className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0 bg-transparent text-[#1E2A44]'
          required
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
        />
      </div>

      {/* Password input container */}
      <div
        className='relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-[#B7BDC6]'
        onClick={() => setInputClicked({ ...inputClicked, password: true })}
      >

        {/* Password floating label */}
        <label
          htmlFor='password'
          className={`text-[#1E2A44] absolute left-[20px] p-[5px] bg-[#F8F8F6] text-[15px] ${inputClicked.password ? "top-[-15px]" : ""}`}
        >
          Enter password
        </label>

        {/* Password input */}
        <input
          type={showPassword ? "text" : "password"}
          id='password'
          className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0 bg-transparent text-[#1E2A44]'
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        {/* Password visibility toggle icon */}
        {!showPassword
          ? <IoIosEye
              className='absolute cursor-pointer right-[20px] w-[25px] h-[25px] text-[#1E2A44]'
              onClick={() => setShowPassword(true)}
            />
          : <IoIosEyeOff
              className='absolute cursor-pointer right-[20px] w-[25px] h-[25px] text-[#1E2A44]'
              onClick={() => setShowPassword(false)}
            />
        }
      </div>

      {/* Forgot password link */}
      <div
        className='w-[90%] px-[20px] cursor-pointer text-[#1E2A44]'
        onClick={() => navigate("/forgot-password")}
      >
        Forgot Password
      </div>

      {/* Error message */}
      {err && <p className='text-red-500'>{err}</p>}

      {/* Sign in button */}
      <button
        className='w-[70%] px-[20px] py-[10px] bg-[#1E2A44] text-[#F8F8F6] font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]'
        onClick={handleSignIn}
        disabled={loading}
      >
        {loading ? <ClipLoader size={30} color='#F8F8F6' /> : "Sign In"}
      </button>

      {/* Navigate to signup page */}
      <p
        className='cursor-pointer text-[#1E2A44]'
        onClick={() => navigate("/signup")}
      >
        Want To Create A New Account ? <span className='border-b-2 border-b-[#1E2A44] pb-[3px] text-[#1E2A44] font-semibold'>Sign Up</span>
      </p>
    </div>

    {/* Right branding section */}
    <div className='md:w-[50%] h-full hidden lg:flex justify-center items-center bg-[#1E2A44] flex-col gap-[10px] text-[#F8F8F6] text-[16px] font-semibold rounded-l-[30px] shadow-2xl shadow-[#1E2A44]'>

      {/* Written logo */}
      <img src={logo1} alt="" className='w-[90%]' />

      {/* Tagline */}
      <p>Connect Yourself, Where Connections Come Alive</p>
    </div>
  </div>
</div>
  )
}

export default SignIn
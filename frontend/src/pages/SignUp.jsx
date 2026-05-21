// Import React and useState hook
import React, { useState } from 'react'

// Import app logo image
import logo from "../assets/c.png"

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

// Import loading spinner component
import { ClipLoader } from "react-spinners";

// Import navigation hook
import { useNavigate } from 'react-router-dom';

// Import Redux dispatch hook
import { useDispatch } from 'react-redux';

// Import Redux action for storing user data
import { setUserData } from '../redux/userSlice';

function SignUp() {

  // State to control floating labels
  const [inputClicked, setInputClicked] = useState({
    name: false,
    userName: false,
    email: false,
    password: false
  })

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false)

  // Loading state for signup button
  const [loading, setLoading] = useState(false)

  // State for name input
  const [name, setName] = useState("")

  // State for username input
  const [userName, setUserName] = useState("")

  // State for showing error message
  const [err, setErr] = useState("")

  // State for email input
  const [email, setEmail] = useState("")

  // State for password input
  const [password, setPassword] = useState("")

  // Hook for page navigation
  const navigate = useNavigate()

  // Redux dispatch function
  const dispatch = useDispatch()

  // Function to handle signup
  const handleSignUp = async () => {

    // Start loading
    setLoading(true)

    // Clear previous errors
    setErr("")

    try {

      // API request to create new account
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, userName, email, password },
        { withCredentials: true } // Sends cookies/token with request
      )

      // Store user data in Redux if needed
      // dispatch(setUserData(result.data))

      // Navigate to sign in page after successful signup
      navigate("/signin")

      // Stop loading
      setLoading(false)

    } catch (error) {

      // Show backend error message
      setErr(error.response?.data?.message)

      // Print error in console
      console.log(error)

      // Stop loading
      setLoading(false)
    }
  }

  return (

    // Main page container
<div className='w-full h-screen bg-[#1E2A44] flex flex-col justify-center items-center'>

  {/* Signup card */}
  <div className='w-[90%] lg:max-w-[60%] h-[600px] bg-[#F8F8F6] rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#B7BDC6]'>

    {/* Left form section */}
    <div className='w-full lg:w-[50%] h-full bg-[#F8F8F6] flex flex-col items-center p-[10px] gap-[20px]'>

      {/* Heading with logo */}
      <div className='flex gap-[10px] items-center text-[20px] font-semibold mt-[40px] text-[#1E2A44]'>
        <span>Sign Up to </span>
        <img src={logo} alt="" className='w-[70px]' />
      </div>

      {/* Name input container */}
      <div
        className='relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl mt-[30px] border-2 border-[#B7BDC6]'
        onClick={() => setInputClicked({ ...inputClicked, name: true })}
      >

        {/* Name floating label */}
        <label
          htmlFor='name'
          className={`text-[#1E2A44] absolute left-[20px] p-[5px] bg-[#F8F8F6] text-[15px] ${inputClicked.name ? "top-[-15px]" : ""}`}
        >
          Enter Your Name
        </label>

        {/* Name input */}
        <input
          type="text"
          id='name'
          className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0 bg-transparent text-[#1E2A44]'
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
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

      {/* Email input container */}
      <div
        className='relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-[#B7BDC6]'
        onClick={() => setInputClicked({ ...inputClicked, email: true })}
      >

        {/* Email floating label */}
        <label
          htmlFor='email'
          className={`text-[#1E2A44] absolute left-[20px] p-[5px] bg-[#F8F8F6] text-[15px] ${inputClicked.email ? "top-[-15px]" : ""}`}
        >
          Enter Email
        </label>

        {/* Email input */}
        <input
          type="email"
          id='email'
          className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0 bg-transparent text-[#1E2A44]'
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
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

      {/* Error message */}
      {err && <p className='text-red-500'>{err}</p>}

      {/* Signup button */}
      <button
        className='w-[70%] px-[20px] py-[10px] bg-[#1E2A44] text-[#F8F8F6] font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]'
        onClick={handleSignUp}
        disabled={loading}
      >
        {loading ? <ClipLoader size={30} color='#F8F8F6' /> : "Sign Up"}
      </button>

      {/* Navigate to signin page */}
      <p
        className='cursor-pointer text-[#1E2A44]'
        onClick={() => navigate("/signin")}
      >
        Already Have An Account ? <span className='border-b-2 border-b-[#1E2A44] pb-[3px] text-[#1E2A44] font-semibold'>Sign In</span>
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

export default SignUp
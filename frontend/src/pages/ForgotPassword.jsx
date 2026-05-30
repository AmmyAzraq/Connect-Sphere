// Import axios for making API requests
import axios from 'axios'

// Import React and useState hook
import React, { useState } from 'react'

// Import loading spinner
import { ClipLoader } from 'react-spinners'

// Import backend server URL
import { serverUrl } from '../App'
import { useNavigate } from 'react-router-dom'

function ForgotPassword() {

    const navigate = useNavigate()
    // State to manage current step of forgot password flow
    const [step, setStep] = useState(1)

    // State to control floating label animations
    const [inputClicked, setInputClicked] = useState({
        email: false,
        otp: false,
        newPassword: false,
        confirmNewPassword: false
    })

    // State for storing email
    const [email, setEmail] = useState("")

    // State for storing OTP
    const [otp, setOtp] = useState("")

    // State for showing error messages
    const [err, setErr] = useState("")

    // State for storing new password
    const [newPassword, setNewPassword] = useState("")

    // State for storing confirm password
    const [confirmNewPassword, setConfirmNewPassword] = useState("")

    // Loading state for buttons
    const [loading, setLoading] = useState(false)

    // STEP 1 → Send OTP to email
    const handleStep1 = async () => {

        // Start loading
        setLoading(true)

        // Clear previous errors
        setErr("")

        try {

            // API request to send OTP
            const result = await axios.post(
                `${serverUrl}/api/auth/sendOtp`,
                { email },
                { withCredentials: true } // Sends cookies/token with request
            )

            // Print response in console
            console.log(result.data)

            // Move to OTP verification step
            setStep(2)

            // Stop loading
            setLoading(false)

        } catch (error) {

            // Print error in console
            console.log(error)

            // Stop loading
            setLoading(false)

            // Show backend error message
            setErr(error.response?.data?.message || error.message || "Something went wrong")
        }
    }

    // STEP 2 → Verify OTP
    const handleStep2 = async () => {

        // Start loading
        setLoading(true)

        // Clear previous errors
        setErr("")

        try {

            // API request to verify OTP
            const result = await axios.post(
                `${serverUrl}/api/auth/verifyOtp`,
                { email, otp },
                { withCredentials: true }
            )

            // Print response in console
            console.log(result.data)

            // Stop loading
            setLoading(false)

            // Move to reset password step
            setStep(3)

        } catch (error) {

            // Print error in console
            console.log(error)

            // Stop loading
            setLoading(false)

            // Show backend error message
            setErr(error.response?.data?.message || error.message || "Something went wrong")
        }
    }

    // STEP 3 → Reset password
    const handleStep3 = async () => {

        // Check if passwords match
        if (newPassword !== confirmNewPassword) {
            return setErr("Passwords Do not match")
        }

        // Clear previous errors
        setErr("")

        // Start loading
        setLoading(true)


        try {

            // API request to reset password
            const result = await axios.post(
                `${serverUrl}/api/auth/resetPassword`,
                {
                    email,
                    password: newPassword
                },
                { withCredentials: true }
            )
            // moving to sign in page again
            navigate("/signin")


            // Print response in console
            console.log(result.data)

            // Stop loading
            setLoading(false)

        } catch (error) {

            // Print error in console
            console.log(error)

            // Stop loading
            setLoading(false)

            // Show backend error message
            setErr(error.response?.data?.message || error.message || "Something went wrong")
        }
    }

    return (

        // Main container
        <div className='w-full h-screen bg-[#1E2A44] flex flex-col justify-center items-center'>

            {/* STEP 1 UI → Enter Email */}
            {step == 1 &&

                <div className='w-[90%] max-w-[500px] h-[500px] bg-[#F8F8F6] rounded-2xl flex justify-center items-center flex-col border border-[#B7BDC6]'>

                    {/* Heading */}
                    <h2 className='text-[30px] font-semibold text-[#1E2A44]'>
                        Forgot Password
                    </h2>

                    {/* Email input container */}
                    <div
                        className='relative flex items-center mt-[30px] justify-start w-[90%] h-[50px] rounded-2xl border-2 border-[#B7BDC6] bg-[#F8F8F6]'
                        onClick={() => setInputClicked({ ...inputClicked, email: true })}
                    >

                        {/* Floating label */}
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

                    {/* Error message */}
                    {err && <p className='text-red-500'>{err}</p>}

                    {/* Send OTP button */}
                    <button
                        className='w-[70%] px-[20px] py-[10px] bg-[#1E2A44] text-[#F8F8F6] font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]'
                        disabled={loading}
                        onClick={handleStep1}
                    >
                        {loading ? <ClipLoader size={30} color='#F8F8F6' /> : "Send OTP"}
                    </button>
                </div>
            }

            {/* STEP 2 UI → Verify OTP */}
            {step == 2 &&

                <div className='w-[90%] max-w-[500px] h-[500px] bg-[#F8F8F6] rounded-2xl flex justify-center items-center flex-col border border-[#B7BDC6]'>

                    {/* Heading */}
                    <h2 className='text-[30px] font-semibold text-[#1E2A44]'>
                        Forgot Password
                    </h2>

                    {/* OTP input container */}
                    <div
                        className='relative flex items-center mt-[30px] justify-start w-[90%] h-[50px] rounded-2xl border-2 border-[#B7BDC6] bg-[#F8F8F6]'
                        onClick={() => setInputClicked({ ...inputClicked, otp: true })}
                    >

                        {/* Floating label */}
                        <label
                            htmlFor='otp'
                            className={`text-[#1E2A44] absolute left-[20px] p-[5px] bg-[#F8F8F6] text-[15px] ${inputClicked.otp ? "top-[-15px]" : ""}`}
                        >
                            Enter OTP
                        </label>

                        {/* OTP input */}
                        <input
                            type="text"
                            id='otp'
                            className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0 bg-transparent text-[#1E2A44]'
                            required
                            onChange={(e) => setOtp(e.target.value)}
                            value={otp}
                        />
                    </div>

                    {/* Error message */}
                    {err && <p className='text-red-500'>{err}</p>}

                    {/* Submit OTP button */}
                    <button
                        className='w-[70%] px-[20px] py-[10px] bg-[#1E2A44] text-[#F8F8F6] font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]'
                        disabled={loading}
                        onClick={handleStep2}
                    >
                        {loading ? <ClipLoader size={30} color='#F8F8F6' /> : "Submit"}
                    </button>
                </div>
            }

            {/* STEP 3 UI → Reset Password */}
            {step == 3 &&

                <div className='w-[90%] max-w-[500px] h-[500px] bg-[#F8F8F6] rounded-2xl flex justify-center items-center flex-col border border-[#B7BDC6]'>

                    {/* Heading */}
                    <h2 className='text-[30px] font-semibold text-[#1E2A44]'>
                        Reset Password
                    </h2>

                    {/* New password input container */}
                    <div
                        className='relative flex items-center mt-[30px] justify-start w-[90%] h-[50px] rounded-2xl border-2 border-[#B7BDC6] bg-[#F8F8F6]'
                        onClick={() => setInputClicked({ ...inputClicked, newPassword: true })}
                    >

                        {/* Floating label */}
                        <label
                            htmlFor='newPassword'
                            className={`text-[#1E2A44] absolute left-[20px] p-[5px] bg-[#F8F8F6] text-[15px] ${inputClicked.newPassword ? "top-[-15px]" : ""}`}
                        >
                            Enter New Password
                        </label>

                        {/* New password input */}
                        <input
                            type="text"
                            id='newPassword'
                            className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0 bg-transparent text-[#1E2A44]'
                            required
                            onChange={(e) => setNewPassword(e.target.value)}
                            value={newPassword}
                        />
                    </div>

                    {/* Confirm password input container */}
                    <div
                        className='relative flex items-center mt-[30px] justify-start w-[90%] h-[50px] rounded-2xl border-2 border-[#B7BDC6] bg-[#F8F8F6]'
                        onClick={() => setInputClicked({ ...inputClicked, confirmNewPassword: true })}
                    >

                        {/* Floating label */}
                        <label
                            htmlFor='confirmNewPassword'
                            className={`text-[#1E2A44] absolute left-[20px] p-[5px] bg-[#F8F8F6] text-[15px] ${inputClicked.confirmNewPassword ? "top-[-15px]" : ""}`}
                        >
                            Confirm New Password
                        </label>

                        {/* Confirm password input */}
                        <input
                            type="text"
                            id='confirmNewPassword'
                            className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0 bg-transparent text-[#1E2A44]'
                            required
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            value={confirmNewPassword}
                        />
                    </div>

                    {/* Error message */}
                    {err && <p className='text-red-500'>{err}</p>}

                    {/* Reset password button */}
                    <button
                        className='w-[70%] px-[20px] py-[10px] bg-[#1E2A44] text-[#F8F8F6] font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]'
                        disabled={loading}
                        onClick={handleStep3}
                    >
                        {loading ? <ClipLoader size={30} color='#F8F8F6' /> : "Reset Password"}
                    </button>
                </div>
            }

        </div>
    )
}

export default ForgotPassword
// Import React hooks
import React, { useEffect, useState } from 'react'

// Import React Router components
import { Navigate, Route, Routes } from 'react-router-dom'

// Import pages
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Upload from './pages/Upload'
import Loops from './pages/Loops'
import Story from './pages/Story'
import Messages from './pages/Messages'
import MessageArea from './pages/MessageArea'
import Search from './pages/Search'
import Notifications from './pages/Notifications'

// Redux hooks
import { useDispatch, useSelector } from 'react-redux'

// Custom hooks
import getCurrentUser from './hooks/getCurrentUser'
import getSuggestedUsers from './hooks/getSuggestedUsers'
import getAllPost from './hooks/getAllPost'
import getAllLoops from './hooks/getAllLoops'
import getAllStories from './hooks/getAllStories'
import getFollowingList from './hooks/getFollowingList'
import getPrevChatUsers from './hooks/getPrevChatUsers'
import getAllNotifications from './hooks/getAllNotifications'

// Socket.io client
import { io } from "socket.io-client"

// Redux actions
import { setOnlineUsers, setSocket } from './redux/socketSlice'
import { setNotificationData } from './redux/userSlice'

// Backend server URL
export const serverUrl = "https://connect-sphere-backend-ooz3.onrender.com"
// export const serverUrl = "http://localhost:8000"

function App() {
  const dispatch = useDispatch()

  // This loading state stops signin page blink on refresh
  const [checkingAuth, setCheckingAuth] = useState(true)

  // Run current user check
  getCurrentUser()

  // Other data fetching hooks
  getSuggestedUsers()
  getAllPost()
  getAllLoops()
  getAllStories()
  getFollowingList()
  getPrevChatUsers()
  getAllNotifications()

  // Get user data from Redux
  const { userData } = useSelector(state => state.user)

  // Get socket from Redux
  const { socket } = useSelector(state => state.socket)

  // When userData check finishes, stop loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setCheckingAuth(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [userData])

  // Socket connection
  useEffect(() => {
    if (userData) {
      const socketIo = io(serverUrl, {
        query: {
          userId: userData._id
        }
      })

      dispatch(setSocket(socketIo))

      socketIo.on('getOnlineUsers', (users) => {
        dispatch(setOnlineUsers(users))
      })

      return () => {
        socketIo.close()
        dispatch(setSocket(null))
      }
    }
  }, [userData, dispatch])

  // Notification listener
  useEffect(() => {
    if (!socket) return

    const handler = (noti) => {
      dispatch(setNotificationData(prev => [...prev, noti]))
    }

    socket.on("newNotification", handler)

    return () => {
      socket.off("newNotification", handler)
    }
  }, [socket, dispatch])

  // Show loader while checking login status
  if (checkingAuth) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#1E2A44] text-white">
        Loading...
      </div>
    )
  }

  return (
    <Routes>
      <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to="/" />} />
      <Route path='/signin' element={!userData ? <SignIn /> : <Navigate to="/" />} />
      <Route path='/forgot-password' element={!userData ? <ForgotPassword /> : <Navigate to="/" />} />

      <Route path='/' element={userData ? <Home /> : <Navigate to="/signin" />} />
      <Route path='/profile/:userName' element={userData ? <Profile /> : <Navigate to="/signin" />} />
      <Route path='/story/:userName' element={userData ? <Story /> : <Navigate to="/signin" />} />
      <Route path='/upload' element={userData ? <Upload /> : <Navigate to="/signin" />} />
      <Route path='/search' element={userData ? <Search /> : <Navigate to="/signin" />} />
      <Route path='/editprofile' element={userData ? <EditProfile /> : <Navigate to="/signin" />} />
      <Route path='/messages' element={userData ? <Messages /> : <Navigate to="/signin" />} />
      <Route path='/messageArea' element={userData ? <MessageArea /> : <Navigate to="/signin" />} />
      <Route path='/notifications' element={userData ? <Notifications /> : <Navigate to="/signin" />} />
      <Route path='/loops' element={userData ? <Loops /> : <Navigate to="/signin" />} />
    </Routes>
  )
}

export default App
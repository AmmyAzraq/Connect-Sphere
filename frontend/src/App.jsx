// Import React and useEffect hook
import React, { useEffect } from 'react'

// Import React Router components
import { Navigate, Route, Routes } from 'react-router-dom'

// Import authentication pages
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'

// Import main pages
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

// Import Redux hooks
import { useDispatch, useSelector } from 'react-redux'

// Import custom hooks for fetching data
import getCurrentUser from './hooks/getCurrentUser'
import getSuggestedUsers from './hooks/getSuggestedUsers'
import getAllPost from './hooks/getAllPost'
import getAllLoops from './hooks/getAllLoops'
import getAllStories from './hooks/getAllStories'
import getFollowingList from './hooks/getFollowingList'
import getPrevChatUsers from './hooks/getPrevChatUsers'
import getAllNotifications from './hooks/getAllNotifications'

// Import socket.io client
import { io } from "socket.io-client"

// Import Redux actions for socket
import { setOnlineUsers, setSocket } from './redux/socketSlice'

// Import Redux action for notifications
import { setNotificationData } from './redux/userSlice'

// Backend server URL
export const serverUrl = "https://connect-sphere-backend-ooz3.onrender.com"

function App() {

  // Fetch current logged-in user
  getCurrentUser()

  // Fetch suggested users
  getSuggestedUsers()

  // Fetch all posts
  getAllPost()

  // Fetch all loops
  getAllLoops()

  // Fetch all stories
  getAllStories()

  // Fetch following list
  getFollowingList()

  // Fetch previous chat users
  getPrevChatUsers()

  // Fetch notifications
  getAllNotifications()

  // Getting user and notification data from Redux store
  const { userData, notificationData } = useSelector(state => state.user)

  // Getting socket data from Redux store
  const { socket } = useSelector(state => state.socket)

  // Redux dispatch function
  const dispatch = useDispatch()

  // SOCKET CONNECTION
  useEffect(() => {

    // Create socket connection only if user exists
    if (userData) {

      // Connecting socket with backend
      const socketIo = io(`${serverUrl}`, {

        // Sending user id to backend
        query: {
          userId: userData._id
        }
      })

      // Store socket instance in Redux
      dispatch(setSocket(socketIo))

      // Listen for online users list
      socketIo.on('getOnlineUsers', (users) => {

        // Store online users in Redux
        dispatch(setOnlineUsers(users))

        // Print online users in console
        console.log(users)
      })

      // Cleanup function when component unmounts
      return () => {

        // Disconnect socket
        socketIo.close()

        // Remove socket from Redux
        dispatch(setSocket(null))
      }
    }

  }, [userData])

  // NOTIFICATION SOCKET LISTENER
  useEffect(() => {

    // Stop if socket is not connected
    if (!socket) return

    // Function to handle incoming notifications
    const handler = (noti) => {

      // Add new notification into Redux state
      dispatch(setNotificationData(prev => [...prev, noti]))
    }

    // Listen for new notifications
    socket.on("newNotification", handler)

    // Cleanup listener on unmount
    return () => {
      socket.off("newNotification", handler)
    }

  }, [socket, dispatch])

  return (

    // Application routes
    <Routes>

      {/* Signup route */}
      <Route
        path='/signup'
        element={!userData ? <SignUp /> : <Navigate to={"/"} />}
      />

      {/* Signin route */}
      <Route
        path='/signin'
        element={!userData ? <SignIn /> : <Navigate to={"/"} />}
      />

      {/* Home route */}
      <Route
        path='/'
        element={userData ? <Home /> : <Navigate to={"/signin"} />}
      />

      {/* Forgot password route */}
      <Route
        path='/forgot-password'
        element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />}
      />

      {/* Profile route */}
      <Route
        path='/profile/:userName'
        element={userData ? <Profile /> : <Navigate to={"/signin"} />}
      />

      {/* Story route */}
      <Route
        path='/story/:userName'
        element={userData ? <Story /> : <Navigate to={"/signin"} />}
      />

      {/* Upload route */}
      <Route
        path='/upload'
        element={userData ? <Upload /> : <Navigate to={"/signin"} />}
      />

      {/* Search route */}
      <Route
        path='/search'
        element={userData ? <Search /> : <Navigate to={"/signin"} />}
      />

      {/* Edit profile route */}
      <Route
        path='/editprofile'
        element={userData ? <EditProfile /> : <Navigate to={"/signin"} />}
      />

      {/* Messages route */}
      <Route
        path='/messages'
        element={userData ? <Messages /> : <Navigate to={"/signin"} />}
      />

      {/* Message area route */}
      <Route
        path='/messageArea'
        element={userData ? <MessageArea /> : <Navigate to={"/signin"} />}
      />

      {/* Notifications route */}
      <Route
        path='/notifications'
        element={userData ? <Notifications /> : <Navigate to={"/signin"} />}
      />

      {/* Loops route */}
      <Route
        path='/loops'
        element={userData ? <Loops /> : <Navigate to={"/signin"} />}
      />

    </Routes>
  )
}

export default App
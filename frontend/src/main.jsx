// Import StrictMode from React
import { StrictMode } from 'react'

// Import createRoot for rendering React app
import { createRoot } from 'react-dom/client'

// Import global CSS file
import './index.css'

// Import main App component
import App from './App.jsx'

// Import BrowserRouter for routing
import { BrowserRouter } from 'react-router-dom'

// Import Redux Provider
import { Provider } from "react-redux"

// Import Redux store
import store from './redux/store.js'

// Render React application into root div
createRoot(document.getElementById('root')).render(

  // BrowserRouter enables routing in app
  <BrowserRouter>

    {/* Provider gives Redux store access to entire app */}
    <Provider store={store}>

      {/* Main App component */}
      <App />

    </Provider>

  </BrowserRouter>
)
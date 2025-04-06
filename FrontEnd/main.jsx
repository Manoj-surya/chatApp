import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import LandingPage from './LandingPage.jsx'
import ChatRoom from './ChatPage.jsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Toaster/>
    <Routes>
      <Route path='/' element={<LandingPage/>}></Route>
      <Route path='/chat' element={<ChatRoom/>}></Route>
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)

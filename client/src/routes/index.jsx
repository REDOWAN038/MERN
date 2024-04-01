import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Home from '../pages/Home'
import Register from '../pages/Register'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'

const index = () => {
  return (
    <BrowserRouter>
        <Navbar/>
        <main>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/register' element={<Register/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/*' element={<NotFound/>} />
        </Routes>
        </main>
        <Footer/>
    </BrowserRouter>
  )
}

export default index
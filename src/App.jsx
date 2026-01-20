import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import RestaurantPage from './pages/RestaurantPage'
import CartPage from './pages/CartPage'
import Profile from './pages/Profile'
import AdminDashboard from './pages/admin/AdminDashboard'
import Nav from './components/Nav'
import PrivateRoute from './components/PrivateRoute'
import RestaurantDetails from './pages/RestaurantDetails'
import ForgotPassword from './pages/auth/ForgetPassword'

export default function App(){
  return (
    <div className='min-h-screen'>
      <Nav />
      <main className='container mx-auto px-4 
       "bg-gradient-to-b from-green-50 via-green-100 to-green-50 text-white"
      '>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<Login/>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<ForgotPassword />} />
          <Route path='/register' element={<Register/>} />
          <Route path='/restaurant/:id' element={<RestaurantDetails/>} />
          <Route path='/cart' element={<CartPage/>} />
          <Route path='/profile' element={
            <PrivateRoute>
              <Profile/>
            </PrivateRoute>
          }/>
          <Route path='/admin' element={
            <PrivateRoute adminOnly>
              <AdminDashboard/>
            </PrivateRoute>
          }/>
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </main>
    </div>
  )
}

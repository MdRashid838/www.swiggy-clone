import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { clearAuth } from '../store/slices/authSlice'

export default function Nav(){
  const auth = useSelector(s => s.auth)
  const cart = useSelector(s => s.cart)
  const dispatch = useDispatch()
  const nav = useNavigate()

  function logout(){
    dispatch(clearAuth())
    nav('/')
  }

  return (
    <nav className='bg-white sticky top-0 shadow'>
      <div className='container mx-auto h-20 px-4 py-3 flex items-center justify-between'>
        <Link to='/' className='font-bold text-2xl rounded-full px-3 py-1 shadow-lg'>Swiggy Clone</Link>
        <div className='flex text-lg font-medium text-gray-700 items-center gap-4'>
          <Link to='/'>Home</Link>
          {auth.user ? (
            <>
              <Link to='/profile'>{auth.user.name}</Link>
              <button onClick={logout} className='text-lg text-red-600'>Logout</button>
            </>
          ) : (
            <>
              <Link to='/login'>Login</Link>
              <Link to='/register'>Register</Link>
            </>
          )}
          <Link to='/cart'>Cart ({cart.items.length})</Link>
        </div>
      </div>
    </nav>
  )
}

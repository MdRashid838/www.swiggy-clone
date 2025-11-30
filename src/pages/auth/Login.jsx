import React, { useState } from 'react'
import api from '../../lib/api'
import { useDispatch } from 'react-redux'
import { setAuth } from '../../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    try{
      const res = await api.post('/users/login', { email, password })
      dispatch(setAuth({ token: res.data.token, user: res.data.user }))
      nav('/')
    }catch(err){
      alert(err.response?.data?.message || err.message)
    }
  }

  return (
    <div className='max-w-md mx-auto bg-white p-6 rounded shadow'>
      <h2 className='text-xl font-bold mb-4'>Login</h2>
      <form onSubmit={submit} className='space-y-3'>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder='Email' className='border p-2 rounded w-full' />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder='Password' type='password' className='border p-2 rounded w-full' />
        <button className='w-full py-2 bg-blue-600 text-white rounded'>Login</button>
      </form>
    </div>
  )
}

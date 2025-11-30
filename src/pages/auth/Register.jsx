import React, { useState } from 'react'
import api from '../../lib/api'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    try{
      await api.post('/users/register', { name, email, password })
      alert('Registered! Please login.')
      nav('/login')
    }catch(err){
      alert(err.response?.data?.message || err.message)
    }
  }

  return (
    <div className='max-w-md mx-auto bg-white p-6 rounded shadow'>
      <h2 className='text-xl font-bold mb-4'>Register</h2>
      <form onSubmit={submit} className='space-y-3'>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder='Name' className='border p-2 rounded w-full' />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder='Email' className='border p-2 rounded w-full' />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder='Password' type='password' className='border p-2 rounded w-full' />
        <button className='w-full py-2 bg-green-600 text-white rounded'>Register</button>
      </form>
    </div>
  )
}

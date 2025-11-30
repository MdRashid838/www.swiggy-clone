import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../lib/api'
import { useDispatch } from 'react-redux'
import { addItem } from '../store/slices/cartSlice'

export default function RestaurantPage(){
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [menu, setMenu] = useState([])
  const dispatch = useDispatch()

  useEffect(()=>{
    fetch()
  },[id])

  async function fetch(){
    const resR = await api.get(`/restaurant/${id}`)
    setRestaurant(resR.data.data || resR.data)
    const res = await api.get(`/restaurant/${id}`)
    setMenu(res.data.data || res.data)
  }

  return (
    <div>
      {restaurant && (
        <div className='bg-white p-4 rounded mb-4 shadow'>
          <div className='flex items-center gap-4'>
            <img src={restaurant.image} className='w-32 h-24 object-cover rounded' alt='' />
            <div>
              <h2 className='text-xl font-bold'>{restaurant.name}</h2>
              <div className='text-sm text-gray-600'>{restaurant.cuisine} • {restaurant.rating} ★</div>
            </div>
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {menu.map(item => (
          <div key={item._id} className='bg-white p-4 rounded shadow flex items-center gap-4'>
            <img src={item.image} alt='' className='w-24 h-20 object-cover rounded' />
            <div className='flex-1'>
              <h4 className='font-semibold'>{item.name}</h4>
              <p className='text-sm text-gray-600'>{item.description}</p>
              <div className='mt-2 flex items-center justify-between'>
                <div>₹{item.price}</div>
                <button onClick={()=>dispatch(addItem({ menuItem: item._id, name: item.name, price: item.price, quantity: 1 }))} className='px-3 py-1 bg-blue-600 text-white rounded'>Add</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

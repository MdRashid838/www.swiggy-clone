import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: JSON.parse(localStorage.getItem('cart') || '[]')
}

const slice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action){
      const item = action.payload
      const found = state.items.find(i => i.menuItem === item.menuItem)
      if(found){
        found.quantity += item.quantity
      } else state.items.push(item)
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    removeItem(state, action){
      state.items = state.items.filter(i => i.menuItem !== action.payload)
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    clearCart(state){
      state.items = []
      localStorage.removeItem('cart')
    }
  }
})

export const { addItem, removeItem, clearCart } = slice.actions
export default slice.reducer

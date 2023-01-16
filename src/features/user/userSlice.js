import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: {
    name: 'Tony',
    surname: 'Stark'
  },
  loggedIn: true,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {}
})

// Action creators are generated for each case reducer function
// export const { addItem, removeItem, removeAllItems, increaseQuantity, decreaseQuantity, toggleCart } = cartSlice.actions
export const selectUser = (state) => state.user;

export default userSlice.reducer
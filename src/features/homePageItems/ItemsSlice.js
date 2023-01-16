import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    itemsArr: [
        {
            id:1,
            title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
            price: 109.95,
            description:"Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
            category:"men's clothing",
            image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
            rating:{
                rate:3.9,
                count:120
            },
            liked: false,
        }
    ]
}

export const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    likeItem: (state, action) => {
        state.itemsArr.forEach((item) => {
            if(item.id === action.payload) {
                item.liked = !item.liked;
            }
        })
    }
  }
})

// Action creators are generated for each case reducer function
export const { likeItem } = itemsSlice.actions
export const selectItems = (state) => state.items;

export default itemsSlice.reducer
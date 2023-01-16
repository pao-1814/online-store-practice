import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    categoryOpen: false,
    category: 'Choose Category',
}

export const categoriesSlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategory: (state, action) => {
        state.category = action.payload;
        state.categoryOpen = !state.categoryOpen;
    },
    toggleCategories: (state) => {
        state.categoryOpen = !state.categoryOpen;
    }
  }
})

// Action creators are generated for each case reducer function
export const { setCategory, toggleCategories } = categoriesSlice.actions
export const selectCategory = (state) => state.category;

export default categoriesSlice.reducer
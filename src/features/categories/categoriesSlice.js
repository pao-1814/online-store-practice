import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Api from '../../Api/Api';

const initialState = {
    categoryOpen: false,
    category: '',
    categoriesList: [],
    loading: false,
}

export const fetchCategories = createAsyncThunk('category/fetchCategories', async () => {
    const response = await Api.fetchProducts('products/categories');
    return response;
})

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
  },
  extraReducers(builder){
    builder.addCase(fetchCategories.pending, (state) => {
        state.loading = true;
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categoriesList = action.payload;
    });
  }
})

// Action creators are generated for each case reducer function
export const { setCategory, toggleCategories } = categoriesSlice.actions
export const selectCategory = (state) => state.category;

export default categoriesSlice.reducer
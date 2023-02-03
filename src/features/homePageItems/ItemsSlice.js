import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { act } from 'react-dom/test-utils';
import Api from '../../Api/Api';

const initialState = {
    itemsArr: [],
    loading: false,
    error: '',
    page: 1,
}

export const fetchItems = createAsyncThunk('items/fetchItems', async (resourceObj) => {
    let category = resourceObj.cat ? `category/${resourceObj.cat}/`: '';
    let search = resourceObj.search ? `search?q=${resourceObj.search}` : ''
    let apiResourse = 'products/' + search + category + (search ? '&' : '?') + `limit=${resourceObj.page * 16}`;
    const response = await Api.fetchProducts(apiResourse);
    return response;
})

export const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    loadMoreItems: (state) => {
        state.page++;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchItems.pending, (state) => {
        state.loading = true;
    });
    builder.addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        const productsArr = [...action.payload.products];
        state.itemsArr = productsArr;
    });
  }
})

// Action creators are generated for each case reducer function
export const { loadMoreItems } = itemsSlice.actions
export const selectItems = (state) => state.items;

export default itemsSlice.reducer
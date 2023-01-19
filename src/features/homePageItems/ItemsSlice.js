import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { act } from 'react-dom/test-utils';
import Api from '../../Api/Api';

const initialState = {
    itemsArr: [],
    loading: false,
    error: '',
    page: 1,
    likedItems: localStorage.getItem('likedItems') ? JSON.parse(localStorage.getItem('likedItems')) : [],
}

export const fetchItems = createAsyncThunk('items/fetchItems', async (resourceObj) => {
    let category = resourceObj.cat ? `category/${resourceObj.cat}/`: '';
    let sorting = resourceObj.sort ? `&sort=${resourceObj.sort}` : '';
    let apiResourse = 'products/' + category + `?limit=${resourceObj.page * 4}` + sorting;
    const response = await Api.fetchProducts(apiResourse);
    return response;
})

export const fetchSearchItems = createAsyncThunk('items/fetchSearchItems', async (search) => {
    const response = await Api.fetchProducts('products/');
    const result = await response.filter((item) => item.title.includes(search));
    return result;
})

export const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    likeItem: (state, action) => {
        if(localStorage.getItem('likedItems')){
            if(state.likedItems.includes(action.payload)){
                const likedArr = [...JSON.parse(localStorage.getItem('likedItems'))];
                likedArr.indexOf(action.payload) !== -1 && likedArr.splice(likedArr.indexOf(action.payload), 1)                
                localStorage.setItem('likedItems', JSON.stringify(likedArr));
                state.likedItems = [...likedArr];
            }
            else{
                const likedArr = [...JSON.parse(localStorage.getItem('likedItems'))];
                likedArr.push(action.payload);
                localStorage.setItem('likedItems', JSON.stringify(likedArr));
                state.likedItems = [...likedArr];
            }
        }
        else{
            const likedArr = [];
            likedArr.push(action.payload);
            localStorage.setItem('likedItems', JSON.stringify(likedArr));
            state.likedItems = [...likedArr];
        }
        state.itemsArr.forEach((item) => {
            if(item.id === action.payload){
                item.liked = !item.liked;
            }
        })
    },
    loadMoreItems: (state) => {
        state.page++;
    },
    updateLikedItems: (state) => {
        state.likedItems = localStorage.getItem('likedItems') ? JSON.parse(localStorage.getItem('likedItems')) : []
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchItems.pending, (state) => {
        state.loading = true;
    });
    builder.addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.forEach(item => {
            item.liked = state.likedItems.includes(item.id);
        });
        state.itemsArr = action.payload;
    });
    builder.addCase(fetchSearchItems.pending, (state) => {
        state.loading = true;
    });
    builder.addCase(fetchSearchItems.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.forEach(item => {
            item.liked = state.likedItems.includes(item.id);
        });
        state.itemsArr = action.payload;
    });
  }
})

// Action creators are generated for each case reducer function
export const { likeItem, loadMoreItems, searchItems, updateLikedItems } = itemsSlice.actions
export const selectItems = (state) => state.items;

export default itemsSlice.reducer
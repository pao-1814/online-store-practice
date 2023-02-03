import { createSlice, createAsyncThunk, extraReducers } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword, auth, updateProfile } from '../../firebase';
import { getDatabase, ref, set, get, child } from "firebase/database";
import Api from '../../Api/Api';

const initialState = {
    likedItems: localStorage.getItem('likedItems') ? JSON.parse(localStorage.getItem('likedItems')) : [],
    loading: false,
    itemsArr: [],
}

export const getLikedItems = createAsyncThunk('favourites/getLikedItems', async (likedItemsArr, {rejectWithValue}) => {
    const promise = new Promise((resolve, reject) => 
    resolve(likedItemsArr.map(async (itemId) => {
        const res = await Api.fetchProducts(`products/${itemId}`);
        res.liked = true;
        return res;
    })))
    .then((itemsArr) => Promise.all(itemsArr))
    .then((itemsArr) => new Promise((resolve, reject) => resolve(itemsArr)))
    .catch(err => rejectWithValue(err));
    return await promise;
})

export const favouritesSlice = createSlice({
  name: 'favourites',
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
    updateLikedItems: (state) => {
        state.likedItems = localStorage.getItem('likedItems') ? JSON.parse(localStorage.getItem('likedItems')) : []
    }
  },
  extraReducers(builder) {
    builder.addCase(getLikedItems.pending, state => {
        state.loading = true
    });
    builder.addCase(getLikedItems.fulfilled, (state, action) => {
        state.loading = false;
        state.itemsArr = [...action.payload];
    });
    builder.addCase(getLikedItems.rejected, (state, action) => {
        state.loading = false;  
        const errMsg = JSON.stringify(action.payload);
        const parsedMsg = JSON.parse(errMsg).code;
    });
  }
})

// Action creators are generated for each case reducer function
export const { likeItem, updateLikedItems } = favouritesSlice.actions
export const selectFavourites = (state) => state.favourites;

export default favouritesSlice.reducer
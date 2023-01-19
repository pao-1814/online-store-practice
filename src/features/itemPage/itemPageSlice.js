import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Api from '../../Api/Api';

const initialState = {
    item: {},
    loading: false,
    error: '',
}

export const fetchItem = createAsyncThunk('itemPage/fetchItem', async (id) => {
    const response = await Api.fetchProducts('products/' + id);
    return response;
})

export const itemPageSlice = createSlice({
  name: 'itemPage',
  initialState,
  reducers: {
    increaseCount: (state) => {
        state.item.quantity++;
    },
    decreaseCount: (state) => {
        state.item.quantity--;
    },
    clearItemPageState: (state) => {
        state.item = {};
    },
    likeItem: (state) => {
        if(localStorage.getItem('likedItems')){
            if(state.item.liked){
                const likedArr = [...JSON.parse(localStorage.getItem('likedItems'))];
                likedArr.indexOf(state.item.id) !== -1 && likedArr.splice(likedArr.indexOf(state.item.id), 1)                
                localStorage.setItem('likedItems', JSON.stringify(likedArr));
                state.item.liked = false;
            }
            else{
                const likedArr = [...JSON.parse(localStorage.getItem('likedItems'))];
                likedArr.push(state.item.id);
                localStorage.setItem('likedItems', JSON.stringify(likedArr));
                state.item.liked = true;
            }
        }
        else{
            const likedArr = [];
            likedArr.push(state.item.liked);
            localStorage.setItem('likedItems', JSON.stringify(likedArr));
            state.item.liked = true;
        }
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchItem.pending, (state) => {
        state.loading = true;
    });
    builder.addCase(fetchItem.fulfilled, (state, action) => {
        state.loading = false;
        if(localStorage.getItem('likedItems')){
            const likedItems = JSON.parse(localStorage.getItem('likedItems'));
            likedItems.forEach(id => {
                if(id === action.payload.id){
                    action.payload.liked = true;
                }
            })
        }
        action.payload.quantity = 1;
        state.item = {...action.payload};
    });
  }
})

// Action creators are generated for each case reducer function
export const { increaseCount, decreaseCount, clearItemPageState, likeItem } = itemPageSlice.actions
export const selectItemPage = (state) => state.itemPage;

export default itemPageSlice.reducer
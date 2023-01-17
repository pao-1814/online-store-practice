import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Api from '../../Api/Api';

const initialState = {
    searchStr: '',
}


export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearch: (state, action) => {
        state.searchStr = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setSearch } = searchSlice.actions
export const selectSearch = (state) => state.search;

export default searchSlice.reducer
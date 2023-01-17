import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    sortingOpen: false,
    sorting: '',
}

export const sortingSlice = createSlice({
  name: 'sorting',
  initialState,
  reducers: {
    setSorting: (state, action) => {
        state.sorting = action.payload;
        state.sortingOpen = !state.sortingOpen;
    },
    toggleSorting: (state) => {
        state.sortingOpen = !state.sortingOpen;
    }
  }
})

export const { setSorting, toggleSorting } = sortingSlice.actions
export const selectSorting = (state) => state.sorting;

export default sortingSlice.reducer
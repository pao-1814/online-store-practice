import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    sortingOpen: false,
    sorting: 'Sorting',
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

// Action creators are generated for each case reducer function
export const { setSorting, toggleSorting } = sortingSlice.actions
export const selectSorting = (state) => state.sorting;

export default sortingSlice.reducer
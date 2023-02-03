import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Api from '../../Api/Api';

const initialState = {
    shown: false,
}

export const loginModalSlice = createSlice({
  name: 'loginModal',
  initialState,
  reducers: {
    toggleLoginModal: (state) => {
        state.shown = !state.shown;
    },
  }
})

// Action creators are generated for each case reducer function
export const { toggleLoginModal } = loginModalSlice.actions
export const selectLoginModal = (state) => state.loginModal;

export default loginModalSlice.reducer
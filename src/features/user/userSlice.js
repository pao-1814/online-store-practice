import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAuth, onAuthStateChanged } from '../../firebase';
import { getDatabase, ref, child, get } from "firebase/database";
import Api from '../../Api/Api';

const initialState = {
  user: {
    fullName: '',
    email: '',
    phone: '',
    uid: '',
    country: '',
    city: '',
    address: '',
    cart: [],
    orders: [],
  },
  loggedIn: false,
  loading: false,
  checkedLogin: false,
  showSettings: false,
}

export const checkIfUserLogined = createAsyncThunk('user/checkIfUserLogined', async (uid) => {
  return await get(child(ref(getDatabase()), `users/${uid}`)).then((snapshot) => {
    if(snapshot.exists()){
      const userData = snapshot.val();
      userData.uid = uid;
      return userData;
    }
    else{
      return new Error('User not loggined');
    }
  });
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = {...action.payload};
      state.user.cartTotalItems = state.user.cart.length ? state.user.cart.reduce((partialSum, a) => partialSum + a.quantity, 0) : 0;
    },
    logout: (state, action) => {
      state.user = {...initialState.user};
      state.loggedIn = false;
    },
    toggleLoginCheck: (state, action) => {
      state.checkedLogin = action.payload;
    },
    toggleSettings: (state) => {
      state.showSettings = !state.showSettings
    },
  },
  extraReducers(builder) {
    builder.addCase(checkIfUserLogined.pending, (state) => {
        state.loading = true;
    });
    builder.addCase(checkIfUserLogined.fulfilled, (state, action) => {
      state.user = {...action.payload};
        state.loggedIn = true;
        state.loading = false;
        state.checkedLogin = true;
    });
    builder.addCase(checkIfUserLogined.rejected, (state) => {
      state.loading = false;
      state.checkedLogin = true;
  });
  }
}
)

// Action creators are generated for each case reducer function
export const { login, logout, toggleLoginCheck, toggleSettings } = userSlice.actions

export const selectUser = (state) => state.user;

export const userReducer =  userSlice.reducer
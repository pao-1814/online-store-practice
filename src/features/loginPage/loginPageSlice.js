import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Api from '../../Api/Api';
import { auth, signInWithEmailAndPassword } from '../../firebase';
import { getDatabase, ref, set, get, child } from "firebase/database";

const initialState = {
    shown: false,
    data: {
      email: ' ',
      password: '',
    },
    validators:{
      email: true,
      password: true,
    },
    logginedUser: {
      uid: '',
      fullName: '',
      email: '',
      phone: '',
      cart: [],
      oders: [],
      country: '',
      city: '',
      address: '',
    },
    passwordHidden: true,
    loading: false,
    error: '',
}

export const loginToApp = createAsyncThunk('loginPage/loginToApp', async (data, {rejectWithValue}) => {
  let userAuth;
  const promise = signInWithEmailAndPassword(auth, data.email, data.password)
      .then((auth) => {
        userAuth = auth;
        return auth;
      })
      .then((auth) => {
          return get(child(ref(getDatabase()), `users/${auth.user.uid}`))
      })
      .then((snapshot) => {
        return new Promise((resolve, reject) => {
          if(snapshot.exists()){
            const userData = snapshot.val();
            resolve({
              uid: userAuth.user.uid,
              fullName: userData.fullName,
              email: userData.email,
              phone: userData.phone,
              cart: userData.cart,
              oders: userData.orders,
              country: userData.country,
              city: userData.city,
              address: userData.address,
            })
          }
          else{
            reject('No snapshot found')
          }
        })
      })
      .catch(err => rejectWithValue(err))

  return await promise
})

export const loginPageSlice = createSlice({
  name: 'loginPage',
  initialState,
  reducers: {
    toggleLoginPage: (state) => {
        state.shown = !state.shown;
    },
    setEmail: (state, action) => {
      state.data.email = action.payload;
    },
    setPassword: (state, action) => {
      state.data.password = action.payload;
    },
    validateEmail: (state) => {
      state.validators.email = state.data.email && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(state.data.email);
    },
    showPassword: (state) => {
      state.passwordHidden = !state.passwordHidden;
    },
    toggleLoader: (state) => {
      state.loader = !state.loader;
    }
  },
  extraReducers(builder) {
    builder.addCase(loginToApp.pending, state => {
        state.loading = true
    });
    builder.addCase(loginToApp.fulfilled, (state, action) => {
        state.loading = false;
        state.error = '';
        state.shown = false;
        state.logginedUser = {...action.payload};
        state.data = {...initialState.data};
    });
    builder.addCase(loginToApp.rejected, (state, action) => {
      state.loading = false;  
      const errMsg = JSON.stringify(action.payload);
      const parsedMsg = JSON.parse(errMsg).code;
      switch(parsedMsg){
        case 'auth/wrong-password':
          state.validators.password = false;
          state.validators.email = true;
          break;
        case 'auth/user-not-found':
          state.validators.password = true;
          state.validators.email = false;
          break;
        default:
          state.validators.password = true;
          state.validators.email = true;
          state.error = 'Internal error occurred. Try again later';
      };
    })
  }
})

// Action creators are generated for each case reducer function
export const { toggleLoginPage, setEmail, setPassword, validateEmail, showPassword, toggleLoader } = loginPageSlice.actions
export const selectLoginPage = (state) => state.loginPage;

export default loginPageSlice.reducer
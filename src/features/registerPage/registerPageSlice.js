import { createSlice, createAsyncThunk, extraReducers } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword, auth, updateProfile } from '../../firebase';
import { getDatabase, ref, set, get, child } from "firebase/database";
import Api from '../../Api/Api';

export const registerUser = createAsyncThunk('registerPage/registerUser', async (data, {rejectWithValue}) => {
    const {fullName, email, phone, password} = data;
    const promise = createUserWithEmailAndPassword(auth, email, password)
        .then((userAuth) => {
            return updateProfile(userAuth.user, {
                displayName: fullName,})
            .then(() => set(ref(getDatabase(), 'users/' + userAuth.user.uid), {
                fullName: fullName,
                email: email,
                phone: phone,
                orders: [],
                cart: [],
                country: '',
                city: '',
                address: '',
            }))
            .then(() => {
                return new Promise((resolve, reject) => 
                resolve({
                    fullName: fullName,
                    email: email,
                    phone: phone,
                    orders: [],
                    cart: [],
                    country: '',
                    city: '',
                    address: '',
                    uid: userAuth.user.uid
                }))
            })
        })
        .catch(err => rejectWithValue(err))
    return await promise;
})

const initialState = {
    shown: false,
    data: {
        fullName: '',
        email: '',
        phone: '',
        password: '',
        uid: '',
    },
    validators: {
        fullName: true,
        email: true,
        phone: true,
        password: true,
        passwordEntering: false,
        allValid: false,
    },
    registeredUser:{
        fullName: '',
        email: '',
        phone: '',
        orders: [],
        cart: [],
        country: '',
        city: '',
        address: '',
        uid: '',
    },
    error: '',
    passwordHidden: true,
    loading: false,
    user: {},
}

export const registerPageSlice = createSlice({
  name: 'registerPage',
  initialState,
  reducers: {
    toggleRegisterPage: (state) => {
        state.shown = !state.shown;
    },
    showPassword: (state) => {
        state.passwordHidden = !state.passwordHidden;
    },
    setFullName: (state, action) => {
        state.data.fullName = action.payload;
        state.validators.fullName = state.data.fullName.length > 0;
    },
    setEmail: (state, action) => {
        state.data.email = action.payload;
        state.validators.email = state.data.email && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(state.data.email);
    },
    setPhone: (state, action) => {
        state.data.phone = action.payload;
        state.validators.phone = state.data.phone && /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(state.data.phone);
    },
    setPassword: (state, action) => {
        state.data.password = action.payload;
        state.validators.passwordEntering = state.data.password && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?_-])[A-Za-z\d#$@!%&*?_-]{8,30}$/.test(state.data.password);
    },
    toggleLoading: (state) => {
        state.loading = !state.loading
    },
    validatePassword: (state) => {
        state.validators.password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?_-])[A-Za-z\d#$@!%&*?_-]{8,30}$/.test(state.data.password);
    },
  },
  extraReducers(builder) {
    builder.addCase(registerUser.pending, state => {
        state.loading = true
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = {...initialState.data}
        state.error = '';
        state.registeredUser = {...action.payload};
    });
    builder.addCase(registerUser.rejected, (state, action) => {
        state.loading = false;  
        const errMsg = JSON.stringify(action.payload);
        const parsedMsg = JSON.parse(errMsg).code;
        switch(parsedMsg) {
            case 'auth/email-already-in-use':
                state.error = 'Account with this email is already registered';
                break;
            default:
                state.error = parsedMsg;
        }
    })
  }
})

// Action creators are generated for each case reducer function
export const { toggleRegisterPage, showPassword, setFullName, setEmail, setPhone, setPassword, validatePassword, toggleLoading } = registerPageSlice.actions
export const selectRegisterPage = (state) => state.registerPage;

export default registerPageSlice.reducer
import { faL } from '@fortawesome/free-solid-svg-icons';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth, signInWithEmailAndPassword, updatePassword, updateEmail, updateProfile } from '../../firebase';
import { getDatabase, ref, set, update } from "firebase/database";


const user = (state) => state.user;

const initialState = {
    tabs: {
        editAccountShown: true,
        ordersShown: false,
        favouritesShown: false,
    },
    validators: {
        fullName: true,
        email: true,
        emailInUse: true,
        phone: true,
        password: true,
        newPassword: true,
        confirmPassword: true,
        loginPassword: true,
        internalError: true,
    },
    newData: {
        fullName: '',
        email: '',
        phone: '',
        country: '',
        city: '',
        address: '',
        loginPassword: '',
    },
    password: {
        password: '',
        newPassword: '',
        confirmPassword: '',
    },
    loading: false,
    showExtraPasswordField: false,
}

export const changePassword = createAsyncThunk('account/changePassword', async (data, {rejectWithValue}) => {
    const {email, password, newPassword} = data;
    const promise = signInWithEmailAndPassword(auth, email, password)
    .then(() => updatePassword(auth.currentUser, newPassword))
    .catch(err => rejectWithValue(err));
    return await promise;
});

export const updateUserProfile = createAsyncThunk('account/updateUserProfile', async (data, {rejectWithValue}) => {
    const {oldData, newData} = data;
    const promise = (oldData.email !== newData.email || oldData.fullName !== newData.fullName) ?
    signInWithEmailAndPassword(auth, oldData.email, oldData.loginPassword)
        .then(() => {
        if(!(oldData.fullName === newData.fullName)){
            return updateProfile(auth.currentUser, {
                displayName: newData.fullName
            })
        }
        })
        .then(() => {
            if(oldData.email !== newData.email){
                return updateEmail(auth.currentUser, newData.email)
            }
        })
        .then(() => update(ref(getDatabase(), 'users/' + auth.currentUser.uid), {
            fullName: newData.fullName,
            email: newData.email,
            phone: newData.phone,
            country: newData.country ? newData.country : '',
            city: newData.city ? newData.city : '',
            address: newData.address ? newData.address : '',
        }))
        .catch(err => rejectWithValue(err))
    :
    update(ref(getDatabase(), 'users/' + auth.currentUser.uid), {
        fullName: newData.fullName,
        email: newData.email,
        phone: newData.phone,
        country: newData.country ? newData.country : '',
        city: newData.city ? newData.city : '',
        address: newData.address ? newData.address : '',
    })
    .catch(err => rejectWithValue(err));
    return await promise;
})

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    showEditAccount: (state) => {
        state.tabs.editAccountShown = true;
        state.tabs.ordersShown = false;
        state.tabs.favouritesShown = false;
    },
    showOrders: (state) => {
        state.tabs.editAccountShown = false;
        state.tabs.ordersShown = true;
        state.tabs.favouritesShown = false;
    },
    showFavourites: (state) => {
        state.tabs.editAccountShown = false;
        state.tabs.ordersShown = false;
        state.tabs.favouritesShown = true;
    },
    setNewData: (state, action) => {
        state.newData[action.payload.element] = action.payload.value;
        state.validators.fullName = state.newData.fullName ? true : false;
        state.validators.email = state.newData.email && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(state.newData.email);
        state.validators.phone = state.newData.phone && /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(state.newData.phone);
    },
    initNewData: (state, action) => {
        Object.keys(state.newData).forEach((key) => {
            state.newData[key] = action.payload[key]
        })
    },
    setCurrentPassword: (state, action) => {
        state.password.password = action.payload;
    },
    setNewPassword: (state, action) => {
        state.password.newPassword = action.payload;
        state.validators.newPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?_-])[A-Za-z\d#$@!%&*?_-]{8,30}$/.test(state.password.newPassword);
    },
    setConfirmPassword: (state, action) => {
        state.password.confirmPassword = action.payload;
        state.validators.confirmPassword = state.password.newPassword === state.password.confirmPassword;
    },
    showExtraPasswordField: (state, action) => {
        state.showExtraPasswordField = action.payload;
    }
  },
  extraReducers(builder) {
    builder.addCase(changePassword.pending, state => {
        state.loading = true
    });
    builder.addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.password = {...initialState.password};
        state.validators.password = true;
    });
    builder.addCase(changePassword.rejected, (state, action) => {
        state.loading = false;  
        const errMsg = JSON.stringify(action.payload);
        const parsedMsg = JSON.parse(errMsg).code;
        state.validators.password = false;
    });
    builder.addCase(updateUserProfile.pending, state => {
        state.loading = true
    });
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.validators.fullName = true;
        state.validators.email = true;
        state.validators.phone = true;
        state.validators.loginPassword = true;
        state.validators.emailInUse = true;
        state.showExtraPasswordField = false;
    });
    builder.addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        const errMsg = JSON.stringify(action.payload);
        const parsedMsg = JSON.parse(errMsg).code;
        switch(parsedMsg){
            case 'auth/email-already-in-use':
                state.validators.emailInUse = false;
                state.validators.loginPassword = true;
                state.validators.internalError = true;
            break;
            case 'auth/wrong-password':
                state.validators.loginPassword = false;
                state.validators.emailInUse = true;
                state.validators.internalError = true;
            break;
            case 'auth/internal-error':
                state.validators.internalError = false;
                state.validators.loginPassword = true;
                state.validators.emailInUse = true;
            default:
                state.validators.emailInUse = true;
                state.validators.loginPassword = true;
                state.validators.internalError = true;
        };
    });
}})

// Action creators are generated for each case reducer function
export const { showEditAccount, showOrders, showFavourites, setNewData, validateData, initNewData, showExtraPasswordField, setCurrentPassword, setNewPassword, setConfirmPassword } = accountSlice.actions
export const selectAccount = (state) => state.account;

export default accountSlice.reducer
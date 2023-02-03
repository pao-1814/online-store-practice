import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth, signInWithEmailAndPassword, updatePassword, updateEmail, updateProfile } from '../../firebase';
import { getDatabase, ref, set, child, get, update } from "firebase/database";
import Api from '../../Api/Api';
import { faL } from '@fortawesome/free-solid-svg-icons';

const initialState = {
    cart: [],
    cartItems: [],
    loading: false,
    popUp: {
        showPopUp: false,
        title: '',
        added: false,
    },
    totalItems: 0,
    totalPrice: 0,
    userInfo: {
        fullName: '',
        phone: '',
        country: '',
        city: '',
        address: '',
    },
    validators: {
        fullname: false,
        phone: false,
        country: false,
        city: false,
        address: false,
        allValid: false,
    },
    showOrderPopUp: false,
}

export const hidePopUpAsync = createAsyncThunk('cart/hidePopUpAsync', async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 3000);
    })
})

export const hideOrderPopUpAsync = createAsyncThunk('cart/hideOrderPopUpAsync', async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 5000);
    })
})

export const initCart = createAsyncThunk('cart/initCart', async(uid, {rejectWithValue}) => {
    const promise = get(child(ref(getDatabase()), `users/${uid}`))
        .then((snapshot) => {
            const cart = snapshot.val().cart;
            return cart.length ? cart : []
        })
        .then((cart) => new Promise((resolve, reject) => resolve(cart)))
        .catch(err => rejectWithValue(err));
    return await promise;
})

export const addToCart = createAsyncThunk('cart/addToCart', async (data, {rejectWithValue}) => {
    const {itemId, quantity, uid} = data;
    return await get(child(ref(getDatabase()), `users/${uid}`)).then((snapshot) => {
        let newCart;
        if(!snapshot.val().cart){
            newCart = []
        }
        else{
            newCart = [...snapshot.val().cart]
        }
        if(newCart.filter(item => item.itemId === itemId).length){
            newCart.forEach((item) => {
                if(item.itemId === itemId){
                    item.quantity = item.quantity + quantity;
                }
            });
        }
        else{
            newCart.push({itemId: itemId, quantity: quantity})
        }
        return newCart;
      })
      .then((newCart) => {
        update(ref(getDatabase(), `users/${uid}`), {cart: [...newCart]});
        return newCart;
      })
      .then((newCart) => new Promise((resolve) => resolve(newCart)))
      .catch(err => rejectWithValue(err))
});

export const getCartItems = createAsyncThunk('cart/getCartItems', async(data, {rejectWithValue}) => {
    const {uid, cart} = data;
    const promise = get(child(ref(getDatabase()), `users/${uid}`))
        .then(async (snapshot) => {
            let cartItems = [];
            const dbCart = snapshot.val().cart;
            if(dbCart){
                cartItems = dbCart.map(async (item) => {
                    const res = await Api.fetchProducts(`products/${item.itemId}`);
                    res.quantity = item.quantity;
                    return res;
                })
                return cartItems;
            }
            else{
                return cartItems;
            }
        })
        .then((cartItems) => Promise.all(cartItems))
        .then((cartItems) => new Promise((resolve) => resolve(cartItems)))
        .catch(err => rejectWithValue(err))
    return await promise;
})

export const removeItem = createAsyncThunk('cart/removeItem', async(data, {rejectWithValue}) => {
    const {uid, itemId} = data;
    const promise = get(child(ref(getDatabase()), `users/${uid}`))
        .then((snapshot) => {
            const dbCart = snapshot.val().cart;
            const newCart = dbCart.filter((item) => item.itemId !== itemId);
            return newCart;
        })
        .then((newCart) => {
            update(ref(getDatabase(), `users/${uid}`), {cart: [...newCart]});
            return newCart;
          })
        .then((newCart) => new Promise((resolve) => resolve({newCart: newCart, itemId: itemId})))
        .catch(err => rejectWithValue(err))
    return await promise
});

export const changeQuantity = createAsyncThunk('cart/changeQuantity', async (data, {rejectWithValue}) => {
    const {itemId, uid, action} = data;
    return await get(child(ref(getDatabase()), `users/${uid}`)).then((snapshot) => {
        const newCart = snapshot.val().cart;
        newCart.forEach((item) => {
            if(item.itemId === itemId){
                item.quantity = action === '+' ? item.quantity + 1 : item.quantity - 1
            }
        })
        return newCart;
      })
      .then((newCart) => {
        update(ref(getDatabase(), `users/${uid}`), {cart: [...newCart]});
        return newCart;
      })
      .then((newCart) => new Promise((resolve) => resolve({newCart: newCart, itemId: itemId, action: action})))
      .catch(err => rejectWithValue(err))
});

export const confirmOrder = createAsyncThunk('cart/confirmOrder', async (data, {rejectWithValue}) => {
    const {uid, order} = data;
    const promise = update(ref(getDatabase(), `users/${uid}`), {cart: []})
        .then(() => {
            const orderId = Math.round(Date.now()*Math.random()/10000)
            set(ref(getDatabase(), `users/${uid}/orders/${orderId}`), order);
            return order;
          })
        .then(() => get(child(ref(getDatabase()), `users/${uid}`)))
        .then((order) => new Promise((resolve) => resolve(order)))
        .catch(err => rejectWithValue(err))
    return await promise;
})

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    hidePopUp: (state) => {
        state.popUp.showPopUp = false;
    },
    setTitle: (state, action) => {
        state.popUp.title = action.payload;
    },
    setUserInfo: (state, action) => {
        state.userInfo[action.payload.element] = action.payload.value;
        for(let key in state.userInfo){
            state.validators[key] = state.userInfo[key].length ? true : false;
        }
        state.validators.allValid = state.validators.fullName && state.validators.phone && state.validators.country && state.validators.city && state.validators.address;
    },
    initUserInfo: (state, action) => {
        state.userInfo = {...action.payload};
        for(let key in state.userInfo){
            state.validators[key] = state.userInfo[key].length ? true : false
        }
        state.validators.allValid = state.validators.fullName && state.validators.phone && state.validators.country && state.validators.city && state.validators.address;
    },
    toggleOrderPopUp: (state) => {
        state.showOrderPopUp = !state.showOrderPopUp;
    },
    resetTotalCount: (state) => {
        state.totalItems = 0;
    }
  },
  extraReducers(builder) {
    // addToCart cases
    builder.addCase(addToCart.pending, state => {
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
        state.cart = [...action.payload];
        state.totalItems = state.cart.reduce((partialSum, a) => partialSum + a.quantity, 0);
        state.popUp.showPopUp = true;
        state.popUp.added = true;
    });
    builder.addCase(addToCart.rejected, (state, action) => {
        const errMsg = JSON.stringify(action.payload);
        const parsedMsg = JSON.parse(errMsg).code;
    });
    // getCartItems cases
    builder.addCase(getCartItems.pending, state => {
        state.loading = true
    });
    builder.addCase(getCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = [...action.payload];
        state.totalItems = state.cartItems.reduce((partialSum, a) => partialSum + a.quantity, 0);
        state.totalPrice = state.cartItems.reduce((partialSum, a) => partialSum + a.price*a.quantity, 0);
    });
    builder.addCase(getCartItems.rejected, (state, action) => {
        state.loading = false;
        const errMsg = JSON.stringify(action.payload);
        const parsedMsg = JSON.parse(errMsg).code;
    });
    // removeItem cases
    builder.addCase(removeItem.pending, state => {
        state.loading = true;
    });
    builder.addCase(removeItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = [...action.payload.newCart];
        state.cartItems = state.cartItems.filter((item) => item.id !== action.payload.itemId)
        state.totalItems = state.cartItems.reduce((partialSum, a) => partialSum + a.quantity, 0);
        state.totalPrice = state.cartItems.reduce((partialSum, a) => partialSum + a.price*a.quantity, 0);
        state.popUp.showPopUp = true;
    });
    builder.addCase(removeItem.rejected, (state, action) => {
        state.loading = false;
        const errMsg = JSON.stringify(action.payload);
        const parsedMsg = JSON.parse(errMsg).code;
    });
    // changeQuantity cases
    builder.addCase(changeQuantity.pending, state => {
    });
    builder.addCase(changeQuantity.fulfilled, (state, action) => {
        state.cart = [...action.payload.newCart];
        state.cartItems.forEach((item) => {
            if(item.id === action.payload.itemId) {
                item.quantity = action.payload.action === '+' ? item.quantity + 1 : item.quantity - 1;
            }
        });
        state.totalItems = state.cartItems.reduce((partialSum, a) => partialSum + a.quantity, 0);
        state.totalPrice = state.cartItems.reduce((partialSum, a) => partialSum + a.price*a.quantity, 0);
    });
    builder.addCase(changeQuantity.rejected, (state, action) => {
        const errMsg = JSON.stringify(action.payload);
        const parsedMsg = JSON.parse(errMsg).code;
    });
    // hidePopUpAsync cases
    builder.addCase(hidePopUpAsync.fulfilled, (state) => {
        state.popUp.showPopUp = false;
        state.popUp.added = false;
    });
    // confirm order
    builder.addCase(confirmOrder.pending, state => {
        state.loading = true;
    });
    builder.addCase(confirmOrder.fulfilled, (state, action) => {
        state.cart = [];
        state.cartItems = [];
        state.totalItems = 0;
        state.userInfo = {...initialState.userInfo};
        state.loading = false;
        state.showOrderPopUp = true;
    });
    builder.addCase(confirmOrder.rejected, (state, action) => {
        state.loading = false;
        const errMsg = JSON.stringify(action.payload);
        const parsedMsg = JSON.parse(errMsg).code;
    });
    // hideOrderPopUpAsync cases
    builder.addCase(hideOrderPopUpAsync.fulfilled, (state) => {
        state.showOrderPopUp = false;
    });
    // initCart cases
    builder.addCase(initCart.pending, state => {
    });
    builder.addCase(initCart.fulfilled, (state, action) => {
        state.cart = [...action.payload];
        state.totalItems = state.cart.reduce((partialSum, a) => partialSum + a.quantity, 0);
    });
    builder.addCase(initCart.rejected, (state, action) => {
        const errMsg = JSON.stringify(action.payload);
        const parsedMsg = JSON.parse(errMsg).code;
    });
}
})

// Action creators are generated for each case reducer function
export const { hidePopUp, setTitle, setUserInfo, initUserInfo, toggleOrderPopUp, resetTotalCount } = cartSlice.actions
export const selectCart = (state) => state.cart;

export default cartSlice.reducer
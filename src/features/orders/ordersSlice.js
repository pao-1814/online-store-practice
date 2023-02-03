import { createSlice, createAsyncThunk, extraReducers } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword, auth, updateProfile } from '../../firebase';
import { getDatabase, ref, set, get, child } from "firebase/database";
import Api from '../../Api/Api';

export const getAllOrders = createAsyncThunk('orders/getAllOrders', async (uid, {rejectWithValue}) => {
    const promise = get(child(ref(getDatabase()), `users/${uid}/orders`))
      .then((snapshot) => {
        const ordersArr = snapshot.val();
        return ordersArr
      })
      .then((ordersArr) => new Promise((resolve, reject) => resolve(ordersArr)))
      .catch(err => rejectWithValue(err));
    return await promise;
})

export const getOrder = createAsyncThunk('orders/getOrder', async (data, {rejectWithValue}) => {
    const {uid, orderId} = data;
    const promise = get(child(ref(getDatabase()), `users/${uid}/orders/${orderId}`))
        .then((snapshot) => {
            const order = snapshot.val();
            order.orderId = orderId;
            const orderedItems = order.items.map(async (item) => {
                const res = await Api.fetchProducts(`products/${item.itemId}`);
                res.quantity = item.quantity;
                return res;
            });
            const items = Promise.all(orderedItems)
              .then((items) => {order.items = items})
              .then(() => new Promise((resolve, reject) => resolve(order)))
              .catch(err => rejectWithValue(err));
            return items;
        })
    return await promise
})

const initialState = {
    ordersObj: {},
    loading: false,
    orderPageObj: {},
}

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    
  },
  extraReducers(builder) {
    builder.addCase(getAllOrders.pending, state => {
        state.loading = true
    });
    builder.addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.ordersObj = {...action.payload};
    });
    builder.addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;  
        const errMsg = JSON.stringify(action.payload);
        const parsedMsg = JSON.parse(errMsg).code;
    })
    builder.addCase(getOrder.pending, state => {
      state.loading = true
  });
    builder.addCase(getOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderPageObj = {...action.payload};
    });
    builder.addCase(getOrder.rejected, (state, action) => {
        state.loading = false;  
    })
  }
})

// Action creators are generated for each case reducer function
export const { } = ordersSlice.actions
export const selectOrders = (state) => state.orders;

export default ordersSlice.reducer
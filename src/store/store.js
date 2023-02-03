import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import {userReducer} from '../features/user/userSlice.js';
import categoryReducer from '../features/categories/categoriesSlice.js';
import itemsReducer from '../features/homePageItems/ItemsSlice.js';
import searchReducer from '../features/search/searchSlice.js';
import itemPageReducer from '../features/itemPage/itemPageSlice.js';
import loginModalReducer from '../features/loginModal/loginModalSlice.js';
import loginPageReducer from '../features/loginPage/loginPageSlice.js';
import registerPageReducer from '../features/registerPage/registerPageSlice.js';
import accountReducer from '../features/account/accountSlice.js';
import cartReducer from '../features/cart/cartSlice';
import ordersReducer from '../features/orders/ordersSlice';
import favouritesReducer from '../features/favourites/favouritesSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        category: categoryReducer,
        items: itemsReducer,
        search: searchReducer,
        itemPage: itemPageReducer,
        loginModal: loginModalReducer,
        loginPage: loginPageReducer,
        registerPage: registerPageReducer,
        account: accountReducer,
        cart: cartReducer,
        orders: ordersReducer,
        favourites: favouritesReducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  })
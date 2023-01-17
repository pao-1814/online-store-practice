import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice.js';
import categoryReducer from '../features/categories/categoriesSlice.js';
import sortingReducer from '../features/sorting/sortingSlice.js';
import itemsReducer from '../features/homePageItems/ItemsSlice.js';
import searchReducer from '../features/search/searchSlice.js';

export const store = configureStore({
    reducer: {
        user: userReducer,
        category: categoryReducer,
        sorting: sortingReducer,
        items: itemsReducer,
        search: searchReducer,
    },
  })
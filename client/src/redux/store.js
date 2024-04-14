import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";
import authReducer from "./auth/authSlice";
import { apiSlice } from "@/api/appSlice";
// const rootReducer = combineReducers({
//   auth: authReducer,
// });
// const persistConfig = {
//   key: "root",
//   storage,
//   version: 1,
//   blacklist: ["step"], // name of the slice to be excluded from the persistor
// };
// const persistedReducer = persistReducer(persistConfig, rootReducer);
// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
// });
// export const persistor = persistStore(store);

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools:true
});

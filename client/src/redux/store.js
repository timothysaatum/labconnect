import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";
import authReducer from "./auth/authSlice";
import allDeliveriesReducer from "./deliveries/AlldeliveriesSlice";
import allLabsReducer from "./laboratories/AllLabsSlice";
import requestReducer from "./requests/requestsSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  allRequests: requestReducer,
  allDeliveries: allDeliveriesReducer,
  allLabs: allLabsReducer,
});
const persistConfig = {
  key: "root",
  storage,
  version: 1,
  blacklist: ["step", "auth", "allDeliveries", "allLabs,allRequests"], // name of the slice to be excluded from the persistor
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export const persistor = persistStore(store);

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import themeReducer from "./theme/themeSlice";
import userReducer from "./user/userSlice";
import sectionReducer from './profileSection/SectionSlice'
import requestStepReducer from './requestStep/RequestStepSlice'
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";
import authReducer from "./auth/authSlice";
const rootReducer = combineReducers({
  theme: themeReducer,
  user:userReducer,
  section:sectionReducer,
  step:requestStepReducer,
  auth: authReducer,
});
const persistConfig = {
  key: "root",
  storage,
  version: 1,
  blacklist: ["step"] // name of the slice to be excluded from the persistor
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

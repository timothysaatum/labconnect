import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";
import authReducer from "./auth/authSlice";
import labReducer from "./lab/userLabSlice";
import selectedRowsReducer from "./dataTable/selectedrowsSlice";
import sessionExpiredReducer from "./session/sessionSlice";
import branchOpenReducer from "./DialogStates/BranchOpenSlice";
import mylabtabReducer from "./mylabtab/mylabtabSlice";
import SampleTypeReducer from "./samples/sampleTypeSlice";
import TestsDialogReducer from "./DialogStates/TestOpenSlice";
const rootReducer = combineReducers({
  auth: authReducer,
  lab: labReducer,
  selectedRows: selectedRowsReducer,
  session: sessionExpiredReducer,
  branchOpen: branchOpenReducer,
  mylabtab: mylabtabReducer,
  sampleType: SampleTypeReducer,
  testsDialog: TestsDialogReducer,
});
const persistConfig = {
  key: "root",
  storage,
  version: 1,
  blacklist: [
    "auth",
    "lab",
    "selectedRows",
    "sessionExpired",
    "branchOpen",
    "mylabtab",
    "sampleType",
    "testsDialog",
  ], // name of the slice to be excluded from the persistor
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

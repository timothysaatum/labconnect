import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";
import authReducer from "./auth/authSlice";
import labReducer from "./lab/userLabSlice";
import selectedRowsReducer from "./dataTable/selectedrowsSlice";
import sessionExpiredReducer from "./session/sessionSlice";
import branchOpenReducer from "./DialogStates/BranchOpenSlice";
import SampleTypeReducer from "./samples/sampleTypeSlice";
import mylabtabReducer from "./mylabtab/mylabtabSlice";
import sampletabReducer from "./mylabtab/sampletab";
import TestsDialogReducer from "./DialogStates/TestOpenSlice";
import rowCountReducer from "./dataTable/rowcount";

const rootReducer = combineReducers({
  auth: authReducer,
  lab: labReducer,
  selectedRows: selectedRowsReducer,
  session: sessionExpiredReducer,
  branchOpen: branchOpenReducer,
  mylabtab: mylabtabReducer,
  sampletab: sampletabReducer,
  sampleType: SampleTypeReducer,
  testsDialog: TestsDialogReducer,
  rowCount: rowCountReducer,
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
    // "sampletab"
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

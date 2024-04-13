import { createSlice } from "@reduxjs/toolkit";

const initialState = { user: null, accessToken: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { data, access_token } = action.payload;
      state.user = data;
      state.accessToken = access_token;
    },
    LogOut: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});
export const { LogOut, setCredentials } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrenttoken = (state) => state.auth.accessToken;

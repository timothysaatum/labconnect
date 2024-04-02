import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: "djdj",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.auth = action.payload;
    },
  },
});
export const { setAuth } = authSlice.actions;
export default authSlice.reducer;

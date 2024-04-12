import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload;
    },
    setAccess: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});
export const { setAuth, setAccess } = authSlice.actions;
export default authSlice.reducer;

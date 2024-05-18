import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  sessionExpired: false,
};

const SessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    sessionExpired: (state) => {
      state.sessionExpired = true;
    },
  },
});

export const { sessionExpired } = SessionSlice.actions;
export const session = (state) => state.session.sessionExpired;
export default SessionSlice.reducer;

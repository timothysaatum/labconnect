import { createSlice } from "@reduxjs/toolkit";

const initialState = { tab: "Received" };

const sampletabSlice = createSlice({
  name: "sampletab",
  initialState,
  reducers: {
    changeTab: (state, action) => {
      state.tab = action.payload;
    },
  },
});

export const selectCurrentTab = (state) => state.sampletab.tab;
export const { changeTab } = sampletabSlice.actions;
export default sampletabSlice.reducer;

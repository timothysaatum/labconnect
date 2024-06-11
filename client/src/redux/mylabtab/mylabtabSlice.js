import { createSlice } from "@reduxjs/toolkit";

const initialState = { tab: "Tests" };

const mylabtabSlice = createSlice({
  name: "mylabtab",
  initialState,
  reducers: {
    changeTab: (state, action) => {
      state.tab = action.payload;
    },
  },
});

export const selectCurrentTab = (state) => state.mylabtab.tab;

export const { changeTab } = mylabtabSlice.actions;
export default mylabtabSlice.reducer;

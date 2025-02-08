import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  testMethod: null,
};

const updatetestmethodSlice = createSlice({
  name: "updatetestmethod",
  initialState,
  reducers: {
    changeTestMethod: (state, action) => {
      state.testMethod = action.payload;
    },
  },
});

export const selectTestMethod = (state) => state.updatetestmethod.testMethod;
export const { changeTestMethod } = updatetestmethodSlice.actions;
export default updatetestmethodSlice.reducer;

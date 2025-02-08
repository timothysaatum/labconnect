import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sampleData: null,
};

const sampleDataSlice = createSlice({
  initialState,
  name: "sampleData",
  reducers: {
    setSampleData(state, action) {
      state.sampleData = action.payload;
    },
    clearSampleData(state) {
      state.sampleData = null;
    },
  },
});

export const { setSampleData, clearSampleData } = sampleDataSlice.actions;
export const selectSampleData = (state) => state.sampleData.sampleData;
export default sampleDataSlice.reducer;

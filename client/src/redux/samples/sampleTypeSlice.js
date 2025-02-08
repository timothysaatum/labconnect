import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sampleTypes: [],
};

const SampleTypeSlice = createSlice({
  name: "sampleType",
  initialState,
  reducers: {
    setSampleTypes: (state, action) => {
      state.sampleTypes = action.payload;
    },
  },
});
export const { setSampleTypes } = SampleTypeSlice.actions;
export const selectSampleTypes = (state) => state.sampleType.sampleTypes;
export default SampleTypeSlice.reducer;

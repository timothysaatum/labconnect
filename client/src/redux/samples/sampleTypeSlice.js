import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sampleTypes: null,
};

const SampleTypeSlice = createSlice({
  name: "sampleType",
  initialState,
  reducers: {
    setSampleTypes: (state, action) => {
      state.labInfo = action.payload;
    },
  },
});
export const { setSampleTypes } = SampleTypeSlice.actions;
export const selectSampleTypes = (state) => state.sampleType.sampleTypes;
export default SampleTypeSlice.reducer;

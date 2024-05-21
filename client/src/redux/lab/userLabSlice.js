import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  labInfo: null,
};

const labSlice = createSlice({
  name: "lab",
  initialState,
  reducers: {
    setlab: (state, action) => {
      state.labInfo = action.payload;
    },
    removeLab: (state) => {
      state.labInfo = null;
    },
  },
});
export const { setlab, removeLab } = labSlice.actions;
export const selectCurrentLab = (state) => state.lab.labInfo;
export default labSlice.reducer;

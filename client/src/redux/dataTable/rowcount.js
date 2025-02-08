import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rowCount: 5,
};

const rowCountSlice = createSlice({
  name: "rowCount",
  initialState,
  reducers: {
    setRowCount(state, action) {
      state.rowCount = action.payload;
    },
  },
});

export const { setRowCount } = rowCountSlice.actions;
export const selectRowCount = (state) => state.rowCount.rowCount;
export default rowCountSlice.reducer;

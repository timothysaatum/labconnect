import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
};

const TestsDialogSlice = createSlice({
  name: "testsDialog",
  initialState,
  reducers: {
    setTestOpen: (state, action) => {
      state.open = action.payload;
    },
  },
});
export const { setTestOpen } = TestsDialogSlice.actions;
export const selectTestDialogOpen = (state) => state.testsDialog.open;
export default TestsDialogSlice.reducer;

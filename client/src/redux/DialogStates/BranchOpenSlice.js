import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
};

const BranchOpenSlice = createSlice({
  name: "branchOpen",
  initialState,
  reducers: {
    setBranchOpen: (state, action) => {
      state.open = action.payload;
    },
  },
});
export const { setBranchOpen } = BranchOpenSlice.actions;
export const selectBranchOpen = (state) => state.branchOpen.open;
export default BranchOpenSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = { active: null };

const activeBranchSlice = createSlice({
  name: 'activeBranch',
  initialState,
  reducers: {
    changeBranch: (state, action) => {
      state.active = action.payload;
    },
  },
});

export const selectActiveBranch = (state) => state.activeBranch.active;

export const { changeBranch } = activeBranchSlice.actions;
export default activeBranchSlice.reducer;

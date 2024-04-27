import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  labs: [],
  tests:[]
};

const AllLabsSlice = createSlice({
  name: "allLabs",
  initialState,
  reducers: {
    setLabs(state, action) {
      state.labs = action.payload;
    },
    setTests(state, action) {
      state.tests = action.payload;
    },
    
  },
});

export const { setLabs,setTests } = AllLabsSlice.actions;
export const selectAllLabs = (state) => state.allLabs.labs;
export const selectLabTests = (state) => state.allLabs.tests;
export default AllLabsSlice.reducer;

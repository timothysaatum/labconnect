import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  labs: [],
  tests: [],
  departments: [],
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
    setDeparments(state, action) {
      state.departments = action.payload;
    },
  },
});

export const { setLabs, setTests, setDeparments } = AllLabsSlice.actions;
export const selectAllLabs = (state) => state.allLabs.labs;
export const selectLabTests = (state) => state.allLabs.tests;
export const selectDepartments = (state) => state.allLabs.departments;
export default AllLabsSlice.reducer;

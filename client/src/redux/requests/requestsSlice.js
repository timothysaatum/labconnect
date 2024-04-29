import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requests: [],
};

const AllRequestsSlice = createSlice({
  name: "allRequests",
  initialState,
  reducers: {
    setRequests(state, action) {
      state.requests = action.payload;
    },
  },
});

export const { setRequests } = AllRequestsSlice.actions;
export const selectAllRequests = (state) => state.allRequests.requests;
export default AllRequestsSlice.reducer;

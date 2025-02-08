import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  graphTypes: {
    user: "line",
  },
};

const graphTypesSlice = createSlice({
  name: "graphTypes",
  initialState,
  reducers: {
    setGraphType(state, action) {
      state.graphTypes[action.payload.type] = action.payload.value;
    },
  },
});

export const { setGraphType } = graphTypesSlice.actions;
export const selectUserGraph = (state) => state.graphTypes.graphTypes.user;
export default graphTypesSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  selectedRows: null,
};

const selectedRowsSlice = createSlice({
  name: "selectedRows",
  initialState,
  reducers: {
    setSelectedRows: (state, action) => {
      state.selectedRows = action.payload;
    },
    emptyselectedRows: (state) => {
      state.selectedRows = null;
    },
  },
});

export const { emptyselectedRows,setSelectedRows } = selectedRowsSlice.actions;
export const selectSelectedRows = (state) => state.selectedRows.selectedRows;
export default selectedRowsSlice.reducer;

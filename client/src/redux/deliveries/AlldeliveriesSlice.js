import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    deliveries: []
}

const AllDeliveriesSlice = createSlice({
    name: "allDeliveries",
    initialState,
    reducers: {
        setDeliveries(state, action) {
            state.deliveries = action.payload
        }
    }
})

export const { setDeliveries} = AllDeliveriesSlice.actions;
export const selectAllDeliveries = (state) => state.allDeliveries.deliveries;
export default AllDeliveriesSlice.reducer;

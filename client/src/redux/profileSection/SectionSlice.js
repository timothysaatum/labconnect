import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    Section:"update"
}

export const SectionSlice = createSlice({
    name: "Section",
    initialState,
    reducers: {
        setSection: (state, action) => {
            state.Section = action.payload;
        },
    },
})

export const { setSection } = SectionSlice.actions;
export default SectionSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user:null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.currentUser = action.payload;
        },
        logout: (state) => {
            state.currentUser = null;
        },
        signup: (state, action) => {
            state.currentUser = action.payload;
        }
    }
})

export const { login, logout,signup } = userSlice.actions;
export default userSlice.reducer
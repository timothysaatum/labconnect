import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 1,
  limit: 4,
};

export const RequestStepSlice = createSlice({
  name: "step",
  initialState,
  reducers: {
    handlenextStep: (state) => {
      if (state.step < state.limit) {
        state.step = state.step + 1;
      }
    },
    handleprevStep: (state) => {
      if (state.step > 1) {
        state.step = state.step - 1;
      }
    },
    resetStep: (state) => {
        state.step = 1;
    },
  },
});

export const { handlenextStep, handleprevStep,resetStep } = RequestStepSlice.actions;
export default RequestStepSlice.reducer;

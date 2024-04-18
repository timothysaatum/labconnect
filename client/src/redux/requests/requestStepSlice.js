import { createSlice } from "@reduxjs/toolkit";

const initialState = { step: 1 };

const requestStepSlice = createSlice({
  name: "requestStep",
  initialState,
  reducers: {
    NextStep(state) {
      step < 5 ?? state.step++;
    },
    PrevStep(state) {
      step > 1 ?? state.step--;
    },
  },
});

export const { NextStep, PrevStep } = requestStepSlice.actions;
export const currentStep = (state) => state.step.step;
export default requestStepSlice.reducer;

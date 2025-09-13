// redux/slices/globalErrorSlice.js
import { createSlice } from "@reduxjs/toolkit";

const globalErrorSlice = createSlice({
  name: "globalError",
  initialState: [],
  reducers: {
    addGlobalError: (state, action) => {
      state.push(action.payload);
    },
    removeGlobalError: (state, action) => {
      return state.filter(err => err.id !== action.payload);
    },
  },
});

export const { addGlobalError, removeGlobalError } = globalErrorSlice.actions;
export default globalErrorSlice.reducer;

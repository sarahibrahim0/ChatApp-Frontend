import { createSlice } from "@reduxjs/toolkit";


const passwordSlice = createSlice({
    name: 'password',
    initialState: {

        errorPassword: null,
        reseted : null
    },
    reducers: {
        setError(state, action) {
            state.errorPassword = action.payload;
          },
          clearError(state) {
            state.errorPassword = null;
          },
          clearReseted(state) {
            state.reseted = null;
          },
          setReseted(state, action) {
            state.reseted = action.payload;
          },


    }
});

const passwordReducer = passwordSlice.reducer;
const passwordActions = passwordSlice.actions;

export { passwordReducer, passwordActions };

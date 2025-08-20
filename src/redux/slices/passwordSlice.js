import { createSlice } from "@reduxjs/toolkit";


const passwordSlice = createSlice({
    name: 'password',
    initialState: {
       
        errorPassword: null,
        reseted : null,
        resetedMsg : null
    },
    reducers: {
        setError(state, action) {
            state.errorPassword = action.payload;
          },
          clearError(state) {
            state.errorPassword = null;
          },
          setResetedMsg(state, action) {
            state.resetedMsg = action.payload;
          },
          clearResetedMsg(state) {
            state.resetedMsg = null;
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

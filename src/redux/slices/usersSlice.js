import { createSlice } from "@reduxjs/toolkit";

const userSlice =  createSlice({
    name: 'users',
    initialState:{
        error: null,
    users: [],
    searchedUser : "",
    receiverProfile : null
    },
    reducers:{
        setError(state, action) {
            state.errorPassword = action.payload;
          },
          clearError(state) {
            state.errorPassword = null;
          },
     fetchAllUsers(state, action){
        state.users = action.payload
     },
     searchUserEmail(state,action){
      state.searchedUser = action.payload
     },
     getUserProfile(state,action){
      state.receiverProfile = action.payload
     }
    }
});

const usersReducer = userSlice.reducer;
const usersActions = userSlice.actions;

export { usersReducer, usersActions };

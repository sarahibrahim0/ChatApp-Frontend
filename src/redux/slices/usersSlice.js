import { createSlice } from "@reduxjs/toolkit";
import { string } from "yup";

const userSlice =  createSlice({
    name: 'users',
    initialState:{
    error: null,
    loading: false,
    users: [],
    searchedUser : "",
    receiverProfile : null,
    },
    reducers:{
        setError(state, action) {
            state.error = action.payload;
          },
          setLoading(state) {
            state.loading = true;
            state.error = null;
          },
          clearLoading(state) {
            state.loading = false;
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
     clearSearchedUser(state,action){
      state.searchedUser = null;
     }
     ,
     getUserProfile(state,action){
      state.receiverProfile = action.payload
     }
    }
});

const usersReducer = userSlice.reducer;
const usersActions = userSlice.actions;

export { usersReducer, usersActions };

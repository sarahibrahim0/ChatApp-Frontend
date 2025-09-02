import { createSlice } from "@reduxjs/toolkit";

const AUTHsLICE = createSlice({
    name: "auth",
    initialState: {
          user: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
    token:  JSON.parse(localStorage.getItem("token")) || null,
    isActive: localStorage.getItem("isActive")
      ? JSON.parse(localStorage.getItem("isActive"))
      : null,
        registerMessage : null,
        isEmailVerified: false,
        isVerifying: false,
        error: null,
  
                userId: null,loading: false
    },
    reducers: {
    login(state, action){
        state.user = action.payload;
        state.token = action.payload.token;
        state.isActive = action.payload.isActive;
        state.registerMessage = null;
        state.token = action.payload.token;

    },
    setToken(state, action){
        state.token = action.payload;
    },
    logout(state){
              state.user = null;
      state.token = null;
      state.isActive = null;
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        localStorage.removeItem('isActive');
    },
    register(state, action){
    state.registerMessage = action.payload;
    },
    setIseEmailVerified(state){
        state.isEmailVerified=true;
        state.registerMessage = null;
        state.isVerifying = false;
    },
    setIsVerifying(state){
        state.isVerifying=true;
    }
    ,
    clearIsVerifying(state){
        state.isVerifying=false;
    },
    setError(state, action){
        state.error = action.payload
    },
    clearError(state){
        state.error = null;
    },
        setLoading(state){
        state.loading = true;
    },
    clearLoading(state){
        state.loading = false;
    },
           setUserId(state , action){
        state.userId = action.payload;
    },
    clearUserId(state){
        state.userId = null;
    },
     deleteUserProfile(state){
      state.user = null;
      state.token = null;
     },
     
     setUserStatus(state,action){
      state.user.isActive = action.payload.isActive;
      state.isActive = action.payload.isActive;
      
     }
    }
})

const authReducer = AUTHsLICE.reducer;
const authActions = AUTHsLICE.actions


export {authActions, authReducer};
import { createSlice } from "@reduxjs/toolkit";

const AUTHsLICE = createSlice({
    name: "auth",
    initialState: {
        user: localStorage.getItem("userInfo") ?
        JSON.parse(localStorage.getItem('userInfo')) : null,
        registerMessage : null,
        isEmailVerified: false,
        isVerifying: false,
        error: null,
  token: localStorage.getItem("token") 
        ? localStorage.getItem("token") 
        : null,
                userId: null,
        isActive: localStorage.getItem('isActive')? JSON.parse(localStorage.getItem('isActive')) : null
,loading: false
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
        localStorage.removeItem('userInfo');
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
      state.token = null
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
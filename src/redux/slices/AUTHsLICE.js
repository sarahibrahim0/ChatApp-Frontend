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
    },
    reducers: {
    login(state, action){
        state.user = action.payload;
        state.registerMessage = null;
    },
    setToken(state, action){
        state.token = action.payload;
    },
    logout(state){
        state.user = null;
        state.token = null;
        state.error = null;
    },
    register(state, action){
    state.registerMessage = action.payload;
    },
    setUserPhoto(state, action){
        state.user.profilePhoto = action.payload;
    },
    setUserName(state, action){
        state.user.username = action.payload;
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
    }
    }
})

const authReducer = AUTHsLICE.reducer;
const authActions = AUTHsLICE.actions


export {authActions, authReducer};
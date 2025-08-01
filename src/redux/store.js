import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/AUTHsLICE.JS";
import { passwordReducer } from "./slices/passwordSlice";
import { chatReducer } from "./slices/chatSlice";
import { usersReducer } from "./slices/usersSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    password: passwordReducer,
    chat: chatReducer,
    users: usersReducer
  },
});

export default store;

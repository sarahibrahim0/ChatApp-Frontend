import request from "../../utils/request";
import { authActions } from "../slices/AUTHsLICE.JS";
//login user
//Must return anonymous function

export function loginUser(user) {
  return async (dispatch) => {
    try {
      const { data } = await request.post("/users/login", user);
      console.log(data)

      dispatch(authActions.login(data));
      if (data.token) {
        dispatch(authActions.setToken(data.token));
        localStorage.setItem("userInfo", JSON.stringify(data));
      }
    } catch (error) {
      dispatch(authActions.setError(error.response.data.message));
    }
  };
}

export function logoutUser() {
  return (dispatch) => {
    dispatch(authActions.logout());
    localStorage.removeItem("userInfo");
  };
}

export const registerUser = (userData) => {
  return async (dispatch) => {
    try {
      const { data } = await request.post("/users/register", userData);
      dispatch(authActions.register(data.message));
    } catch (error) {
      dispatch(authActions.setError(error.response.data.message));
    }
  };
};

export function verifyEmail(userId, token) {
  return async (dispatch) => {
    try {
      dispatch(authActions.setIsVerifying());
      await request.get(`/users/${userId}/verify/${token}`);
      dispatch(authActions.setIseEmailVerified());
      dispatch(authActions.clearIsVerifying());
    } catch (error) {
      dispatch(authActions.setError(error.response.data.message));
    }
  };
}

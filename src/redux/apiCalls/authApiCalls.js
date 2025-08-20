import { data } from "autoprefixer";
import request from "../../utils/request";
import { authActions } from "../slices/AUTHsLICE.JS";
//login user
//Must return anonymous function

export function loginUser(user ) {
  return async (dispatch) => {
    try {
      dispatch(authActions.setLoading());
      dispatch(authActions.clearError());
      const { data } = await request.post("/users/login", user);

      dispatch(authActions.login(data));
      if (data.token) {
        dispatch(authActions.setToken(data.token));
        localStorage.setItem("userInfo", JSON.stringify(data));
    localStorage.setItem('token', JSON.stringify(data.token)); 
      }
    } catch (error) {
      if ( error.response.data.message.includes("deactivated") ) 
        {
          dispatch(authActions.setUserId(error.response.data.userId));
}
      dispatch(authActions.clearLoading());
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

export const registerUser = (userData , navigate) => {
  return async (dispatch) => {
    try {
      const { data } = await request.post("/users/register", userData);
      dispatch(authActions.register(data.message));
      navigate("/email-sent");

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
      dispatch(authActions.setError(null));

    } catch (error) {
      dispatch(authActions.setError(error.response.data.message));
            dispatch(authActions.clearIsVerifying());

      console.log(error)
    }
  };
};


export function deleteUserProfile(userId) {

return async(dispatch)=>{
try{

const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const token = userInfo?.token;
if(token){
  const { data } = await request.put(`/users/delete-profile`,
   {},
    {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
await dispatch(authActions.deleteUserProfile());
await dispatch(authActions.logout());
}
else {throw new Error('not authorized');}
}
catch (error) {
  console.log(error)
      dispatch(
        authActions.setError(error.response?.data?.message)
);
    }
}
};


export function deactivateUser(id){
  return async (dispatch)=>{
    try{
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const token = userInfo?.token;
if(token){
  const {data} = await request.put(`/users/${id}/deactivate`,
      {},
    {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
  );
 localStorage.removeItem('userInfo');
 localStorage.removeItem('isActive');
  dispatch(authActions.setUserStatus(data));
  dispatch(authActions.logout());
}else {throw new Error('Not Authorized');}

    }
  catch(error){
  dispatch(authActions.setError(error.response?.data?.message));
  }
    }
  };

 export function activateUser(id, email, password, navigate) {
  return async (dispatch) => {
    try {

   await request.put(`/users/${id}/activate`);
   await dispatch(loginUser({ email, password })).unwrap();
          dispatch(authActions.setUserStatus(data.user.isActive));
      
      }

  catch (error) {
      dispatch(authActions.setError(error.response?.data?.message));
    }
  };
}

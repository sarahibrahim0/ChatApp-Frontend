import request from "../../utils/request";
import { authActions } from "../slices/authSlice.js";
import { passwordActions } from "../slices/passwordSlice";

 export function forgotPassword(userEmail) {
    return async (dispatch)=>{
        try {
            const { data } = await request.post("/password/reset-password-link", {
                email: userEmail,
              }); 
            // dispatch(authActions.register(data.message));
            console.log(data)
            dispatch(passwordActions.setResetedMsg(data.message));
            }
        catch(error){
            dispatch(passwordActions.setError(error.response.data.msg));

        }

    }
 };

 export function setNewPassword(newPass , userId, token ) {
    return async (dispatch)=>{
        try {
            const { data } = await request.post(`/password/reset-password/${userId}/${token}` , {
                password: newPass,
            } ); 
            
            dispatch(passwordActions.setReseted(data.message));
            dispatch(passwordActions.clearResetedMsg());
            }
        catch(error){
            dispatch(passwordActions.setError(error.response.data.msg));

        }

    }
 };



import request from "../../utils/request";
import { authActions } from "../slices/AUTHsLICE.JS";
import { passwordActions } from "../slices/passwordSlice";

 export function forgotPassword(userEmail) {
    return async (dispatch)=>{
        try {
            const { data } = await request.post("/password/reset-password-link", {
                email: userEmail,
              }); 
            
            dispatch(authActions.register(data.message));
            }
        catch(error){
            dispatch(passwordActions.setError(error.response.data.message));
            console.log(error);

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
            }
        catch(error){
            dispatch(passwordActions.setError(error.response.data.message));
            console.log(error);

        }

    }
 };



import request from "../../utils/request";
import { authActions } from "../slices/authSlice";
import { usersActions } from "../slices/usersSlice";

export function getAllUsers(){
    return async(dispatch)=>{

        try{

            const {data} =await request.get(`/users`);
            dispatch(usersActions.fetchAllUsers(data));

        }
        catch(error){

            dispatch(usersActions.setError(error.response.data.message));

        }

    }

};

export function getUserByEmail(email) {
  return async (dispatch) => {
    try {
            dispatch(usersActions.setLoading());

      if (!email) throw new Error("Email is required");
            
      const { data } = await request.get(`/users/search?email=${encodeURIComponent(email)}`);
      
      dispatch(usersActions.searchUserEmail(data));
      dispatch(usersActions.clearLoading());

    } catch (error) {
            dispatch(usersActions.searchUserEmail(null));

      dispatch(usersActions.setError(error.response?.data?.message));
      console.log(error.response?.data?.message)
          dispatch(usersActions.clearLoading());


    }
  };
}

export function getUserById(userId){

return async(dispatch)=>{
try{
  const {data} = await request.get(`/users/${userId}`);
  dispatch(usersActions.getUserProfile(data))
}
catch (error) {
      dispatch(
        usersActions.setError(error.response.data.message));
    }
}
}

export function editUserProfile (
  userId , formData
) {

return async(dispatch, getState)=>{
try{
  
  const {data}= await request.put(
        `/users/edit-profile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUser = {
  ...getState().auth.user, // البيانات القديمة
  ...data, // البيانات الجديدة اللي رجعت من السيرفر
};

dispatch(authActions.login(updatedUser));
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));


}
catch (error) {
      dispatch(
        usersActions.setError(
          error.response?.data?.message)
      );
    }
}
}



export function clearSearchedUser () {

return async(dispatch)=>{
try{
  dispatch(usersActions.clearSearchedUser());
}
catch (error) {
      dispatch(
        usersActions.setError(error.response?.data?.message)
      );
    }
}
};




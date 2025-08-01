import request from "../../utils/request";
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
      if (!email) throw new Error("Email is required");
      
      console.log("Searching email:", email);
      
      const { data } = await request.get(`/users/search?email=${encodeURIComponent(email)}`);
      
      dispatch(usersActions.searchUserEmail(data));
    } catch (error) {
      console.error("Search error:", error);
      dispatch(
        usersActions.setError(
          error.response?.data?.message || error.message || "Something went wrong"
        )
      );
    }
  };
}

export function getUserById(userId){

  console.log(userId)
return async(dispatch)=>{
try{
  const {data} = await request.get(`/users/${userId}`);
  dispatch(usersActions.getUserProfile(data))
}
catch (error) {
      console.error("Search error:", error);
      dispatch(
        usersActions.setError(
          error.response?.data?.message || error.message || "Something went wrong"
        )
      );
    }
}
}

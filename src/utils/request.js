// api/request.js
import axios from "axios";
import store from "../redux/store";
import { addGlobalError } from "../redux/slices/globalErrorSlice";

const request = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Interceptor للأخطاء
request.interceptors.response.use(
  response => response,
  error => {
    let message = "Something went wrong";

    if (!error.response) {
      message = "Network error: check your connection";
    }

    else if (error.response.status === 404) {
      message = "Resource not found (404)";
    }
    else if(error.response.status === 403 && error.response.data.message === "This account has been deleted"){
        message = `account has been deleted`
    }
     else if(error.response.status === 403 && error.response.data.message === "Account is deactivated"){
 message = `Account is deactivated`;

    }
    
    else {
      message = `Server error: ${error.response.status}`;
    }

    store.dispatch(addGlobalError({ id: Date.now(), message }));

    return Promise.reject(error);
  }
);

export default request;

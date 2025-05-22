import axios from "axios";
import { BackendURL } from "./constants";

const axiosAuthInstance = axios.create({
  baseURL: BackendURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// logout when token expired
// axiosAuthInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
    
//     if (error.response && error.response.status === 401) {
//       localStorage.clear();
//       window.location.href = "/";
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosAuthInstance;

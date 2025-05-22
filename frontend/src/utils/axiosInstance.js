import axios from "axios";
import { BackendURL } from "./constants";

const axiosInstance = axios.create({
  baseURL: BackendURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;


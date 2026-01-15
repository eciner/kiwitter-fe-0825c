import axios from "axios";
import { removeAuthToken } from "./auth.js";

const axiosInstance = axios.create({
  baseURL: "https://uppro-0825.workintech.com.tr/",
});

export const setToken = (token) => {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const removeToken = () => {
  delete axiosInstance.defaults.headers.common["Authorization"];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      removeAuthToken();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;


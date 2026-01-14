import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://uppro-0825.workintech.com.tr/",
});

export const setToken = (token) => {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const removeToken = () => {
  delete axiosInstance.defaults.headers.common["Authorization"];
};

export default axiosInstance;


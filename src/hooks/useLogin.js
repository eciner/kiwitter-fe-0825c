import { useDispatch } from "react-redux";
import { login } from "../redux/userSlice.js";
import axios, { setToken } from "../utils/axios.js";

export default function useLogin() {
  const dispatch = useDispatch();

  return async (credentials) => {
    const response = await axios.post("/login", credentials);
    const token = response.data.token;
    setToken(token);
    dispatch(login(token));
    return token;
  };
}

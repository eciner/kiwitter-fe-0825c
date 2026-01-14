import { setToken, removeToken } from "./axios.js";

const TOKEN_KEY = 'auth_token';

export function setAuthToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
  setToken(token);
}

export function removeAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
  removeToken();
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

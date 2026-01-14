import { createSlice } from '@reduxjs/toolkit';
import { setAuthToken, removeAuthToken } from '../utils/auth.js';
import { jwtDecode } from 'jwt-decode';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: null,
    user: null,
  },
  reducers: {
    login: (state, action) => {

      const decoded = jwtDecode(action.payload);

      state.token = action.payload;
      state.user = decoded;

      setAuthToken(action.payload);
    },
    logout: (state) => {

      state.token = null;
      state.user = null;

      removeAuthToken();
    },
  },
});

export const { login, logout } = userSlice.actions;

export const selectUser = (state) => state.user.user;

export default userSlice.reducer;

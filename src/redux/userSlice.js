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
      try {
        const decoded = jwtDecode(action.payload);

        state.token = action.payload;
        state.user = decoded;

        setAuthToken(action.payload);
      } catch (error) {
        state.token = null;
        state.user = null;
        removeAuthToken();
      }
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

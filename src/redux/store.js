import { configureStore } from '@reduxjs/toolkit'
import tweetsSlice from './tweetsSlice.js';
import userSlice from './userSlice.js';

export default configureStore({
  reducer: {
    tweets: tweetsSlice,
    user: userSlice,
  },
});

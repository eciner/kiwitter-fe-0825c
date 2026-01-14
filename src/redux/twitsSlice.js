import { createSlice } from '@reduxjs/toolkit';

const twitsSlice = createSlice({
  name: 'twits',
  initialState: {
    twits: [],
  },
  reducers: {
    loadTwits: (state, action) => {

      state.twits = action.payload.sort((a, b) => b.createDate - a.createDate);
    },
    addTwit: (state, action) => {

      const twits = [...state.twits, action.payload];

      state.twits = twits.sort((a, b) => b.createDate - a.createDate);
    },
    likeTwit: (state, action) => {

      const { id } = action.payload;

      const twit = state.twits.find(twit => twit.id === id);

      if (twit) {
        twit.likes++;
        twit.likedByUser = true;
      }
    },
    replyToTwit: (state, action) => {

      const { replyTo, reply } = action.payload;

      const twit = state.twits.find(twit => twit.id === replyTo);

      if (twit) {
        // Ensure replies array exists
        if (!twit.replies) {
          twit.replies = [];
        }
        twit.replies.push(reply);
      }
    },
    deleteTwit: (state, action) => {

      const id = action.payload;

      state.twits = state.twits.filter(twit => twit.id !== id);
    },
    unlikeTwit: (state, action) => {

      const { id } = action.payload;

      const twit = state.twits.find(twit => twit.id === id);

      if (twit) {
        twit.likes--;
        twit.likedByUser = false;
      }
    }
  },
});

export const selectTwits = (mode) => (state) => mode === "normal" ? state.twits.twits : [...state.twits.twits].sort((a, b) => b.likes - a.likes);
export const selectTwitsByUsername = (username) => (state) => state.twits.twits.filter(twit => twit.username === username);

export const { loadTwits, addTwit, likeTwit, unlikeTwit, replyToTwit, deleteTwit } = twitsSlice.actions;

export default twitsSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const tweetsSlice = createSlice({
  name: 'tweets',
  initialState: {
    tweets: [],
  },
  reducers: {
    loadTweets: (state, action) => {

      state.tweets = action.payload.sort((a, b) => b.createDate - a.createDate);
    },
    addTweet: (state, action) => {

      const tweets = [...state.tweets, action.payload];

      state.tweets = tweets.sort((a, b) => b.createDate - a.createDate);
    },
    likeTweet: (state, action) => {

      const { id } = action.payload;

      const tweet = state.tweets.find(tweet => tweet.id === id);

      if (tweet) {
        tweet.likes++;
        tweet.likedByUser = true;
      }
    },
    replyToTweet: (state, action) => {

      const { replyTo, reply } = action.payload;

      const tweet = state.tweets.find(tweet => tweet.id === replyTo);

      if (tweet) {
        // Ensure replies array exists
        if (!tweet.replies) {
          tweet.replies = [];
        }
        tweet.replies.push(reply);
      }
    },
    deleteTweet: (state, action) => {

      const id = action.payload;

      state.tweets = state.tweets.filter(tweet => tweet.id !== id);
    },
    unlikeTweet: (state, action) => {

      const { id } = action.payload;

      const tweet = state.tweets.find(tweet => tweet.id === id);

      if (tweet) {
        tweet.likes--;
        tweet.likedByUser = false;
      }
    }
  },
});

export const selectTweets = (mode) => (state) => mode === "timeline" ? state.tweets.tweets : [...state.tweets.tweets].sort((a, b) => b.likes - a.likes);
export const selectTweetsByUsername = (username) => (state) => state.tweets.tweets.filter(tweet => tweet.username === username);

export const { loadTweets, addTweet, likeTweet, unlikeTweet, replyToTweet, deleteTweet } = tweetsSlice.actions;

export default tweetsSlice.reducer;

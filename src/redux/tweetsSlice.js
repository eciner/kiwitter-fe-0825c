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

      const findTweetById = (tweets, targetId) => {
        for (const tweet of tweets) {
          if (tweet.id === targetId) return tweet;
          if (tweet.replies && tweet.replies.length > 0) {
            const found = findTweetById(tweet.replies, targetId);
            if (found) return found;
          }
        }
        return null;
      };

      const tweet = findTweetById(state.tweets, id);

      if (tweet) {
        tweet.likes++;
        tweet.likedByUser = true;
      }
    },
    replyToTweet: (state, action) => {

      const { replyTo, reply } = action.payload;

      const findTweetById = (tweets, id) => {
        for (const tweet of tweets) {
          if (tweet.id === id) {
            return tweet;
          }
          if (tweet.replies && tweet.replies.length > 0) {
            const found = findTweetById(tweet.replies, id);
            if (found) {
              return found;
            }
          }
        }
        return null;
      };

      const tweet = findTweetById(state.tweets, replyTo);

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

      const removeTweetById = (tweets, targetId) =>
        tweets
          .filter((tweet) => tweet.id !== targetId)
          .map((tweet) => {
            if (tweet.replies && tweet.replies.length > 0) {
              return {
                ...tweet,
                replies: removeTweetById(tweet.replies, targetId),
              };
            }
            return tweet;
          });

      state.tweets = removeTweetById(state.tweets, id);
    },
    unlikeTweet: (state, action) => {

      const { id } = action.payload;

      const findTweetById = (tweets, targetId) => {
        for (const tweet of tweets) {
          if (tweet.id === targetId) return tweet;
          if (tweet.replies && tweet.replies.length > 0) {
            const found = findTweetById(tweet.replies, targetId);
            if (found) return found;
          }
        }
        return null;
      };

      const tweet = findTweetById(state.tweets, id);

      if (tweet) {
        tweet.likes--;
        tweet.likedByUser = false;
      }
    }
  },
});

export const selectTweets = (mode) => (state) => {
  const allTweets = state.tweets.tweets;

  const flattenTweets = (tweets, isReply = false) => {
    const result = [];
    tweets.forEach((tweet) => {
      if (isReply) {
        result.push({ ...tweet, isReply: true });
      } else {
        result.push(tweet);
      }

      if (tweet.replies && tweet.replies.length > 0) {
        result.push(...flattenTweets(tweet.replies, true));
      }
    });
    return result;
  };

  const flattenedTweets = flattenTweets(allTweets);
  
  if (mode === "tweets") {
    // Only return main tweets (not replies), sorted by creation date
    return flattenedTweets.filter(tweet => !tweet.isReply).sort((a, b) => b.createDate - a.createDate);
  } else if (mode === "replies") {
    // Only return replies, sorted by creation date
    return flattenedTweets.filter(tweet => tweet.isReply).sort((a, b) => b.createDate - a.createDate);
  } else if (mode === "timeline") {
    return flattenedTweets.sort((a, b) => b.createDate - a.createDate);
  } else {
    // most_liked mode
    return [...flattenedTweets].sort((a, b) => b.likes - a.likes);
  }
};

export const selectTweetsByUsername = (username) => (state) => state.tweets.tweets.filter(tweet => tweet.username === username);

export const { loadTweets, addTweet, likeTweet, unlikeTweet, replyToTweet, deleteTweet } = tweetsSlice.actions;

export default tweetsSlice.reducer;

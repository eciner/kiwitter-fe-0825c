import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import PageLayout from "../layouts/PageLayout.jsx";
import Post from "../components/Post.jsx";

import axios from "../utils/axios.js";
import { selectUser } from "../redux/userSlice.js";
import { isPostOwner } from "../utils/ownership.js";

export default function Detail() {
  const { tweetId } = useParams();
  const [currentTweet, setCurrentTweet] = useState(null);
  const [parentTweet, setParentTweet] = useState(null);
  const [siblingReplies, setSiblingReplies] = useState([]);
  const [repliesForCurrentTweet, setRepliesForCurrentTweet] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const allTweets = useSelector((state) => state.tweets.tweets);
  const currentUser = useSelector(selectUser);

  const handleReplyAdded = useCallback((reply) => {
    setRepliesForCurrentTweet((prev) => [...(prev || []), reply]);
  }, []);

  const hasParentHint = useCallback((tweet) => {
    if (!tweet) return false;
    return Boolean(
      tweet.isReply ||
        tweet.replyTo ||
        tweet.replyToId ||
        tweet.parentId ||
        tweet.parentTweetId
    );
  }, []);

  const isRootTweet = useCallback(
    (tweet) => {
      if (!tweet) return false;
      if (hasParentHint(tweet)) return false;
      if (!allTweets || allTweets.length === 0) return true;
      return allTweets.some((t) => t.id === tweet.id);
    },
    [allTweets, hasParentHint]
  );

  // Fetch specific tweet and build thread
  useEffect(() => {
    setIsLoading(true);

    const findTweetAndParent = (tweets, id, parent = null) => {
      for (const tweet of tweets) {
        if (tweet.id === id) {
          return { tweet, parent };
        }
        if (tweet.replies && tweet.replies.length > 0) {
          const result = findTweetAndParent(tweet.replies, id, tweet);
          if (result) {
            return result;
          }
        }
      }
      return null;
    };

    axios
      .get(`/tweets/${tweetId}`)
      .then((response) => {
        const fetchedTweet = response.data;
        const result = findTweetAndParent(allTweets, tweetId);

        setCurrentTweet(fetchedTweet);

        if (result?.tweet) {
          setParentTweet(result.parent || null);
          setSiblingReplies(result.parent?.replies || []);
          setRepliesForCurrentTweet(
            fetchedTweet?.replies || result.tweet.replies || []
          );
        } else {
          setParentTweet(null);
          setSiblingReplies([]);
          setRepliesForCurrentTweet(fetchedTweet?.replies || []);
        }
      })
      .catch((error) => {
        // Try to find the tweet in Redux store (might be a nested reply)
        const result = findTweetAndParent(allTweets, tweetId);

        if (result?.tweet) {
          setCurrentTweet(result.tweet);
          setParentTweet(result.parent || null);
          // Set sibling replies - all replies to the parent tweet
          setSiblingReplies(result.parent?.replies || []);
          // Replies to the current tweet (may be empty)
          setRepliesForCurrentTweet(result.tweet.replies || []);
        } else {
          toast.error("Tweet bulunamadı");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [tweetId, allTweets]);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="text-center text-2xl font-heading font-bold text-white">
          Yüklüyor...
        </div>
      </PageLayout>
    );
  }

  if (!currentTweet) {
    return (
      <PageLayout>
        <div className="text-center text-2xl font-heading font-bold text-white">
          Tweet bulunamadı
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout className="">
      <div className="flex flex-col container mx-auto w-full max-w-3xl p-4 sm:p-6 gap-4 items-center">
        {/* Thread structure: Parent Tweet → Current Tweet → Other Replies sorted by date */}

        {/* Main parent tweet at top */}
        {parentTweet && (
          <div className="w-full relative">
            <div className="absolute top-3 left-4 z-10 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
              {isRootTweet(parentTweet)
                ? "Ana Tweet"
                : isPostOwner(currentUser, parentTweet)
                ? "Yanıtın"
                : "Yanıt"}
            </div>
            <Post post={parentTweet} className="!bg-white !shadow-lg" />
          </div>
        )}

        {/* Current tweet being viewed in detail - highlighted */}
        <div className="w-full relative pt-1 border-t-4 border-primary">
          <div className="absolute top-3 left-4 z-10 bg-accent text-white text-xs font-bold px-2 py-1 rounded">
            {isRootTweet(currentTweet)
              ? "Ana Tweet"
              : isPostOwner(currentUser, currentTweet)
              ? "Yanıtın"
              : "Yanıt"}
          </div>
          <Post
            post={currentTweet}
            isDetail={true}
            className="!shadow-xl"
            repliesOverride={repliesForCurrentTweet || []}
            onReplyAdded={handleReplyAdded}
            enableReplyOnReply={true}
          />
        </div>

        {/* Other sibling replies sorted newest to latest */}
        {siblingReplies && siblingReplies.length > 1 && (
          <div className="w-full flex flex-col gap-3">
            <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wide px-2 drop-shadow-sm">
              Diğer Yanıtlar
            </h3>
            {siblingReplies
              .filter((reply) => reply.id !== tweetId) // Exclude current tweet
              .sort((a, b) => b.createDate - a.createDate) // Sort newest to latest
              .map((reply) => (
                <div key={reply.id} className="relative">
                  <div className="absolute top-3 left-4 z-10 bg-gray-400 text-white text-xs font-bold px-2 py-1 rounded">
                    {isPostOwner(currentUser, reply) ? "Yanıtın" : "Yanıt"}
                  </div>
                  <Post
                    post={reply}
                    isReply={true}
                    className="w-full !rounded-lg !bg-white !shadow-md hover:!shadow-lg !border-l-4 !border-primary/40 hover:!border-primary"
                    enableReplyOnReply={true}
                  />
                </div>
              ))}
          </div>
        )}

      </div>
    </PageLayout>
  );
}

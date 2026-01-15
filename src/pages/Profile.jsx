import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectTweetsByUsername,
  selectTweets,
  loadTweets,
  addTweet,
} from "../redux/tweetsSlice.js";
import { selectUser } from "../redux/userSlice.js";
import { toast } from "react-toastify";

import PageLayout from "../layouts/PageLayout.jsx";
import Timeline from "../components/Timeline.jsx";
import PostEditor from "../components/PostEditor.jsx";

import axios from "../utils/axios.js";

export default function Profile() {
  const { username } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("tweets");
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const isCurrentUser = user?.nickname === username;

  // Fetch user info
  useEffect(() => {
    axios
      .get(`/users/${isCurrentUser ? "me" : username}`)
      .then((response) => {
        setUserInfo(response.data);
      })
      .catch((error) => {
        // Handle user info fetch errors silently
      });
  }, [username, isCurrentUser]);

  // Fetch all tweets
  useEffect(() => {
    const fetchTweets = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/tweets");
        dispatch(loadTweets(response.data.tweets));
        setIsSuccess(true);
      } catch (error) {
        toast.error("Tweet'ler yüklenemedi");
        setIsSuccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTweets();
  }, [dispatch]);

  const allTweets = useSelector(selectTweetsByUsername(username));
  const flattenedTimeline = useSelector(selectTweets("timeline"));
  const likedTweets = flattenedTimeline.filter(
    (tweet) => tweet.likedByUser === true
  );

  // Get all replies made by the user (including nested replies)
  const userReplies = useSelector((state) =>
    selectTweets("replies")(state)
      .filter((reply) => reply.username === username)
      .sort((a, b) => b.createDate - a.createDate)
  );

  const handleAddPost = (post) => {
    dispatch(addTweet(post));
  };

  if (!userInfo) {
    return (
      <PageLayout>
        <div className="text-center text-2xl font-heading font-bold text-white animate-pulse">
          Yükleniyor...
        </div>
      </PageLayout>
    );
  }

  const displayedTweets =
    activeTab === "tweets"
      ? allTweets
      : activeTab === "likes"
      ? likedTweets
      : userReplies;

  return (
    <PageLayout className="">
      <div className="flex flex-col container mx-auto w-full max-w-4xl p-4 sm:p-6 gap-6 items-center">
        <img
          src={`https://i.pravatar.cc/1200?u=${
            allTweets.length > 0 ? allTweets[0].authorId : userInfo.id
          }`}
          alt={userInfo.name}
          className="w-32 sm:w-40 md:w-48 rounded-full aspect-square cursor-pointer shadow-2xl border-4 border-white/10 hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
        />
        <div className="text-center">
          <h1 className="text-3xl font-heading font-bold text-white pb-1">
            {userInfo.name}
          </h1>
          <span className="text-base text-gray-200 italic font-body">
            (@{userInfo.username})
          </span>
        </div>
        {isCurrentUser && <PostEditor addPost={handleAddPost} />}
        <nav
          className="w-full max-w-3xl mx-auto overflow-x-auto"
          aria-label="Profile tabs"
        >
          <ul
            className="flex flex-row gap-4 sm:gap-6 text-white mt-4 px-2 text-sm font-body font-semibold border-b border-white/20 whitespace-nowrap"
            role="tablist"
          >
            <li>
              <button
                className={`${
                  activeTab === "tweets"
                    ? "border-b-2 pb-2 border-white font-bold transition-all inline-block"
                    : "pb-2 inline-block font-semibold hover:text-gray-200 hover:border-b-2 hover:border-gray-300 transition-all"
                } bg-transparent border-0 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded`}
                type="button"
                role="tab"
                aria-selected={activeTab === "tweets"}
                onClick={() => setActiveTab("tweets")}
              >
                Tweetler
              </button>
            </li>
            {isCurrentUser && (
              <li>
                <button
                  className={`${
                    activeTab === "likes"
                      ? "border-b-2 pb-2 border-white font-bold transition-all inline-block"
                      : "pb-2 inline-block font-semibold hover:text-gray-200 hover:border-b-2 hover:border-gray-300 transition-all"
                  } bg-transparent border-0 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded`}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "likes"}
                  onClick={() => setActiveTab("likes")}
                >
                  Beğendiklerim
                </button>
              </li>
            )}
            <li>
              <button
                className={`${
                  activeTab === "replies"
                    ? "border-b-2 pb-2 border-white font-bold transition-all inline-block"
                    : "pb-2 inline-block font-semibold hover:text-gray-200 hover:border-b-2 hover:border-gray-300 transition-all"
                } bg-transparent border-0 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded`}
                type="button"
                role="tab"
                aria-selected={activeTab === "replies"}
                onClick={() => setActiveTab("replies")}
              >
                Yanıtlar
              </button>
            </li>
          </ul>
        </nav>
        <Timeline
          posts={displayedTweets}
          isLoading={isLoading}
          isSuccess={isSuccess}
        />
      </div>
    </PageLayout>
  );
}

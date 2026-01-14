import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectTweetsByUsername,
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
  const likedTweets = useSelector((state) =>
    state.tweets.tweets.filter((tweet) => tweet.likedByUser === true)
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

  const displayedTweets = activeTab === "tweets" ? allTweets : likedTweets;

  return (
    <PageLayout className="">
      <div className="flex flex-col container mx-auto w-[60vw] p-4 gap-6 items-center">
        <img
          src={`https://i.pravatar.cc/1200?u=${userInfo.id}`}
          alt={userInfo.name}
          className="w-48 rounded-full aspect-square cursor-pointer shadow-2xl border-4 border-white/10 hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
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
        {isCurrentUser && (
          <nav className="w-[40vw]">
            <ul className="flex flex-row gap-6 text-white mt-4 px-2 text-sm font-body font-semibold border-b border-white/20">
              <li>
                <a
                  className={
                    activeTab === "tweets"
                      ? "border-b-2 pb-2 border-white font-bold transition-all inline-block"
                      : "pb-2 inline-block font-semibold hover:text-gray-200 hover:border-b-2 hover:border-gray-300 transition-all"
                  }
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("tweets");
                  }}
                >
                  Tweetlerim
                </a>
              </li>
              <li>
                <a
                  className={
                    activeTab === "likes"
                      ? "border-b-2 pb-2 border-white font-bold transition-all inline-block"
                      : "pb-2 inline-block font-semibold hover:text-gray-200 hover:border-b-2 hover:border-gray-300 transition-all"
                  }
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("likes");
                  }}
                >
                  Beğendiklerim
                </a>
              </li>
            </ul>
          </nav>
        )}
        <Timeline
          posts={displayedTweets}
          isLoading={isLoading}
          isSuccess={isSuccess}
        />
      </div>
    </PageLayout>
  );
}

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadTweets, addTweet, selectTweets } from "../redux/tweetsSlice.js";
import { selectUser } from "../redux/userSlice.js";
import { toast } from "react-toastify";

import PageLayout from "../layouts/PageLayout.jsx";
import Timeline from "../components/Timeline.jsx";
import PostEditor from "../components/PostEditor.jsx";
import TimelineSelector from "../components/TimelineSelector.jsx";

import axios from "../utils/axios.js";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timelineMode, setTimelineMode] = useState("timeline");
  const dispatch = useDispatch();

  const posts = useSelector(selectTweets(timelineMode));
  const user = useSelector(selectUser);

  const isLoggedIn = !!user;

  useEffect(() => {
    setIsLoading(true);

    axios
      .get("/tweets")
      .then((response) => {
        dispatch(loadTweets(response.data.tweets));
        setIsSuccess(true);
      })
      .catch((error) => {
        toast.error("Bir hata oluştu");
        setIsSuccess(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [dispatch]);

  const handleAddPost = useCallback(
    (post) => {
      dispatch(addTweet(post));
    },
    [dispatch]
  );

  const handleTimelineModeChange = useCallback((mode) => {
    setTimelineMode(mode);
  }, []);

  return (
    <PageLayout className="">
      {isLoggedIn && <PostEditor addPost={handleAddPost} />}
      <TimelineSelector
        mode={timelineMode}
        setMode={handleTimelineModeChange}
      />
      <Timeline posts={posts} isLoading={isLoading} isSuccess={isSuccess} />
    </PageLayout>
  );
}

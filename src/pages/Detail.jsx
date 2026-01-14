import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import PageLayout from "../layouts/PageLayout.jsx";
import Post from "../components/Post.jsx";

import axios from "../utils/axios.js";

export default function Detail() {
  const { tweetId } = useParams();
  const [tweet, setTweet] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch specific tweet
  useEffect(() => {
    setIsLoading(true);

    axios
      .get(`/tweets/${tweetId}`)
      .then((response) => {
        setTweet(response.data);
      })
      .catch((error) => {
        toast.error("Tweet bulunamadı");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [tweetId]);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="text-center text-2xl font-heading font-bold text-white">
          Yüklüyor...
        </div>
      </PageLayout>
    );
  }

  if (!tweet) {
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
      <div className="flex flex-col container mx-auto w-full max-w-3xl p-4 sm:p-6 gap-6 items-center">
        <Post post={tweet} isDetail={true} />
      </div>
    </PageLayout>
  );
}

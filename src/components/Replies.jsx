import { useDispatch } from "react-redux";
import { replyToTweet } from "../redux/tweetsSlice.js";
import { memo, useCallback } from "react";
import Post from "./Post.jsx";
import PostEditor from "./PostEditor.jsx";
import PropTypes from "prop-types";

const Replies = memo(function Replies({ parentPost, replies }) {
  const dispatch = useDispatch();

  const addPost = useCallback(
    (post) => {
      dispatch(replyToTweet({ replyTo: parentPost.id, reply: post }));
    },
    [dispatch, parentPost.id]
  );

  return (
    <div className="flex flex-col container mx-auto bg-white w-full max-w-3xl rounded-b-xl shadow-2xl p-4 sm:p-5 md:p-6 gap-5 border-t-4 border-primary transition-all duration-300">
      <div className="flex flex-col gap-3 pb-4 border-b border-gray-200">
        <h3 className="text-sm font-heading font-bold text-primary uppercase tracking-wide">
          Yanıtlar
        </h3>
        <PostEditor
          addPost={addPost}
          className="w-full"
          isReply={true}
          parentId={parentPost.id}
        />
      </div>
      <div className="flex flex-col gap-4">
        {replies && replies.length > 0 ? (
          replies.map((reply) => (
            <Post
              key={reply.id}
              post={reply}
              isReply={true}
              className="w-full"
            />
          ))
        ) : (
          <span className="text-gray-400 text-sm font-body text-center py-6 italic">
            Henüz yanıt yok
          </span>
        )}
      </div>
    </div>
  );
});

Replies.propTypes = {
  parentPost: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  replies: PropTypes.array,
};

export default Replies;

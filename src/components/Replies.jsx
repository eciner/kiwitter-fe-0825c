import { useDispatch, useSelector } from "react-redux";
import { replyToTweet } from "../redux/tweetsSlice.js";
import { selectUser } from "../redux/userSlice.js";
import { memo, useCallback } from "react";
import Post from "./Post.jsx";
import PostEditor from "./PostEditor.jsx";
import PropTypes from "prop-types";
import { isPostOwner } from "../utils/ownership.js";

const Replies = memo(function Replies({ parentPost, replies, onReplyAdded }) {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);

  const addPost = useCallback(
    (post) => {
      dispatch(replyToTweet({ replyTo: parentPost.id, reply: post }));
      if (onReplyAdded) {
        onReplyAdded(post);
      }
    },
    [dispatch, parentPost.id, onReplyAdded]
  );

  return (
    <div className="flex flex-col container mx-auto bg-gradient-to-b from-primary/5 via-blue-50 to-white w-full max-w-3xl rounded-b-2xl shadow-2xl border-t-4 border-primary transition-all duration-300 overflow-hidden relative">
      {/* Accent line decoration */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-accent to-primary opacity-80"></div>

      <div className="flex flex-col gap-3 px-4 sm:px-5 md:px-6 pt-5 sm:pt-6 md:pt-7 pb-5 border-b-2 border-primary/15">
        <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wide flex items-center gap-2 drop-shadow-md">
          💬 Yanıtlar
          <span className="inline-flex items-center justify-center w-6 h-6 bg-primary rounded-full text-xs font-bold text-white shadow-md hover:scale-105 transition-transform duration-200">
            {replies?.length || 0}
          </span>
        </h3>
        <PostEditor
          addPost={addPost}
          className="w-full !bg-white !shadow-lg hover:!shadow-xl !border-2 !border-primary/25 !rounded-xl"
          isReply={true}
          parentId={parentPost.id}
        />
      </div>
      <div className="flex flex-col gap-3 p-3 sm:p-4 md:p-5 bg-gradient-to-b from-white/30 via-white/50 to-white">
        {replies && replies.length > 0 ? (
          [...replies]
            .sort((a, b) => b.createDate - a.createDate)
            .map((reply, index) => (
              <div
                key={reply.id}
                className="animate-fadeIn relative"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`absolute top-3 left-3 sm:left-4 z-10 text-white text-xs font-bold px-2 py-1 rounded ${
                    isPostOwner(currentUser, reply)
                      ? "bg-accent"
                      : "bg-gray-400"
                  }`}
                >
                  {isPostOwner(currentUser, reply) ? "Yanıtın" : "Yanıt"}
                </div>
                <Post
                  post={reply}
                  isReply={true}
                  className="w-full !rounded-lg !bg-white !shadow-md hover:!shadow-lg hover:!bg-blue-50/40 !border-l-4 !border-primary/40 hover:!border-primary !transform hover:scale-100 transition-all duration-200"
                />
              </div>
            ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <span className="text-4xl opacity-10 transition-transform duration-300 hover:scale-105">
              💬
            </span>
            <span className="text-gray-400 text-base font-body text-center italic font-medium">
              Henüz yanıt yok
            </span>
          </div>
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
  onReplyAdded: PropTypes.func,
};

export default Replies;

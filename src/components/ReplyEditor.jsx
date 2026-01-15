import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { replyToTweet } from "../redux/tweetsSlice.js";
import PropTypes from "prop-types";
import PostEditor from "./PostEditor.jsx";

export default function ReplyEditor({ parentPost, onReplyAdded, className = "" }) {
  const dispatch = useDispatch();

  const handleAddPost = useCallback(
    (post) => {
      dispatch(replyToTweet({ replyTo: parentPost.id, reply: post }));
      if (onReplyAdded) {
        onReplyAdded(post);
      }
    },
    [dispatch, parentPost.id, onReplyAdded]
  );

  return (
    <PostEditor
      addPost={handleAddPost}
      isReply={true}
      parentId={parentPost.id}
      className={className}
    />
  );
}

ReplyEditor.propTypes = {
  parentPost: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  onReplyAdded: PropTypes.func,
  className: PropTypes.string,
};

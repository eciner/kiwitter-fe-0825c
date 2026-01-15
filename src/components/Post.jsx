import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { useState, useRef, useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { likeTweet, unlikeTweet, deleteTweet } from "../redux/tweetsSlice.js";
import axios from "../utils/axios.js";
import Replies from "./Replies.jsx";
import PropTypes from "prop-types";
import { isPostOwner } from "../utils/ownership.js";

const Post = memo(function Post({
  post,
  isReply = false,
  className = "",
  isDetail = false,
  showReplyLabel = false,
  repliesOverride = null,
  onReplyAdded,
  enableReplyOnReply = false,
}) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.user);
  const date = dayjs(post.createDate).fromNow();
  const [isRepliesVisible, setIsRepliesVisible] = useState(isDetail);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isOwner = isPostOwner(currentUser, post);

  const handleLike = () => {
    axios
      .post(`/tweets/${post.id}/like`)
      .then(() => {
        dispatch(likeTweet({ id: post.id }));
      })
      .catch((error) => {
        toast.error("Beğeni gönderilemedi");
      });
  };

  const handleUnlike = () => {
    axios
      .delete(`/tweets/${post.id}/like`)
      .then(() => {
        dispatch(unlikeTweet({ id: post.id }));
      })
      .catch((error) => {
        toast.error("Beğeni kaldırılamadı");
      });
  };

  const handleRepliesVisibilityToggle = () => {
    setIsRepliesVisible(!isRepliesVisible);
  };

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDelete = () => {
    setIsMenuOpen(false);

    if (confirm("Bu tweet'i silmek istediğinize emin misiniz?")) {
      axios
        .delete(`/tweets/${post.id}`)
        .then(() => {
          dispatch(deleteTweet(post.id));
          toast.success("Tweet başarıyla silindi");
        })
        .catch((error) => {
          toast.error("Sunucu hatası: Tweet silinemiyor");
        });
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const replies = repliesOverride ?? post.replies ?? [];
  const canShowReplies =
    isRepliesVisible && (!isReply || enableReplyOnReply);

  const iconClass = post.likedByUser
    ? "bi bi-suit-heart-fill cursor-pointer hover:text-accent text-primary"
    : "bi bi-suit-heart cursor-pointer hover:text-primary text-gray-500";

  return (
    <div className="w-full">
      <div
        className={`relative flex flex-col sm:flex-row container mx-auto w-full max-w-3xl rounded-xl ${
          isRepliesVisible ? "rounded-b-none" : ""
        } p-4 sm:p-5 md:p-6 gap-4 sm:gap-6 transition-all duration-200 ${
          isReply
            ? "bg-gradient-to-r from-white via-blue-50/30 to-white shadow-sm hover:shadow-md border-l-4 border-primary/40 hover:border-primary/70"
            : "bg-white shadow-xl hover:shadow-2xl hover:bg-gray-50"
        } ${className}`}
      >
        {showReplyLabel && (
          <div className="absolute top-3 left-4 z-20 bg-primary text-white text-xs font-bold px-2 py-1 rounded shadow-md">
            {isPostOwner(currentUser, post) ? "Yanıtın" : "Yanıt"}
          </div>
        )}
        <div className="flex flex-col justify-start w-20 sm:w-24 self-start flex-shrink-0 mx-auto sm:mx-0">
          <Link
            to={`/${post.username}`}
            className="block rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <img
              src={`https://i.pravatar.cc/150?u=${post.authorId}`}
              alt={post.name}
              className={`w-full rounded-full aspect-square cursor-pointer transition-all duration-200 ${
                isReply
                  ? "hover:shadow-md hover:shadow-primary/30 hover:ring-2 hover:ring-primary/40"
                  : "hover:shadow-lg hover:shadow-primary/50 hover:ring-2 hover:ring-primary"
              }`}
            />
          </Link>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-row justify-between items-center gap-3">
            <Link
              to={`/${post.username}`}
              className="cursor-pointer flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
            >
              <span
                className={`font-heading font-bold break-words ${
                  isReply ? "text-gray-800 text-sm" : "text-gray-900"
                } hover:underline`}
              >
                {post.name}
              </span>
              <span
                className={`sm:ml-2 font-body hover:underline break-all ${
                  isReply ? "text-gray-600 text-sm" : "text-gray-600"
                }`}
              >
                @{post.username}
              </span>
              <span
                className={`sm:ml-2 font-body ${
                  isReply ? "text-gray-500 text-xs" : "text-gray-500 text-sm"
                }`}
              >
                {date}
              </span>
            </Link>
            {isOwner && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={handleMenuToggle}
                  className={`transition-colors duration-200 bg-transparent border-0 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded ${
                    isReply
                      ? "text-gray-400 hover:text-primary/70"
                      : "text-gray-500 hover:text-primary"
                  }`}
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isMenuOpen}
                  aria-label="Tweet menüsü"
                >
                  <i className="bi bi-three-dots"></i>
                </button>
                {isMenuOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-32 border rounded-md shadow-lg z-10 animate-fadeIn ${
                      isReply
                        ? "bg-white border-primary/20"
                        : "bg-white border-gray-300"
                    }`}
                    role="menu"
                  >
                    <button
                      onClick={handleDelete}
                      className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-bold transition-colors duration-200"
                      type="button"
                      role="menuitem"
                    >
                      Sil
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <Link
            to={`/detail/${post.id}`}
            className="text-gray-900 cursor-pointer font-body leading-relaxed break-words focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
          >
            {post.content}
          </Link>
          <div
            className={`flex flex-row flex-wrap gap-4 sm:gap-6 text-sm font-body ${
              isReply ? "text-gray-500" : "text-gray-600"
            }`}
          >
            <div className="flex flex-row gap-2 items-center group">
              <button
                type="button"
                className={`bi bi-chat group-hover:text-primary transition-colors duration-200 bg-transparent border-0 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded ${
                  isReply ? "text-gray-400" : ""
                }`}
                onClick={handleRepliesVisibilityToggle}
                aria-label={
                  isRepliesVisible ? "Yanıtları gizle" : "Yanıtları göster"
                }
                aria-expanded={isRepliesVisible}
              ></button>
              <span className="group-hover:text-primary transition-colors duration-200">
                {replies.length}
              </span>
            </div>
            <div className="flex flex-row gap-2 items-center group">
              <button
                type="button"
                className={`transition-all duration-200 bg-transparent border-0 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded ${iconClass}`}
                onClick={post.likedByUser ? handleUnlike : handleLike}
                aria-label={post.likedByUser ? "Beğeniyi kaldır" : "Beğen"}
                aria-pressed={post.likedByUser}
              ></button>
              <span
                className={`${
                  post.likedByUser ? "text-accent" : "group-hover:text-accent"
                } transition-colors duration-200`}
              >
                {post.likes}
              </span>
            </div>
            <div className="flex flex-row gap-2 items-center group">
              <span
                className={`bi bi-arrow-repeat group-hover:text-primary transition-colors duration-200 ${
                  isReply ? "text-gray-400" : ""
                }`}
                aria-hidden="true"
              ></span>
              <span className="group-hover:text-primary transition-colors duration-200">
                {post.retweets || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
      {canShowReplies && (
        <Replies
          parentPost={post}
          replies={replies}
          onReplyAdded={onReplyAdded}
          enableReplyOnReply={enableReplyOnReply}
        />
      )}
    </div>
  );
});

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    authorId: PropTypes.number.isRequired,
    createDate: PropTypes.number.isRequired,
    likes: PropTypes.number.isRequired,
    retweets: PropTypes.number,
    likedByUser: PropTypes.bool,
    replies: PropTypes.array,
  }).isRequired,
  isReply: PropTypes.bool,
  className: PropTypes.string,
  isDetail: PropTypes.bool,
  showReplyLabel: PropTypes.bool,
  repliesOverride: PropTypes.array,
  onReplyAdded: PropTypes.func,
  enableReplyOnReply: PropTypes.bool,
};

export default Post;

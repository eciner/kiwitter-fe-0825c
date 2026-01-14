import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { useState, useRef, useEffect, memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { likeTweet, unlikeTweet, deleteTweet } from "../redux/tweetsSlice.js";
import axios from "../utils/axios.js";
import Replies from "./Replies.jsx";
import PropTypes from "prop-types";

const Post = memo(function Post({
  post,
  isReply = false,
  className = "",
  isDetail = false,
}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const date = dayjs(post.createDate).fromNow();
  const [isRepliesVisible, setIsRepliesVisible] = useState(isDetail);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLike = (e) => {
    e.preventDefault();

    axios
      .post(`/tweets/${post.id}/like`)
      .then(() => {
        dispatch(likeTweet({ id: post.id }));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleUnlike = (e) => {
    e.preventDefault();

    axios
      .delete(`/tweets/${post.id}/like`)
      .then(() => {
        dispatch(unlikeTweet({ id: post.id }));
      })
      .catch((error) => {
        // Silently handle unlike errors
      });
  };

  const handleRepliesVisibilityToggle = (e) => {
    e.preventDefault();
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
        })
        .catch((error) => {
          // Handle delete errors silently
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

  const handleProfileClick = () => {
    history.push(`/${post.username}`);
  };

  const handleDetailClick = () => {
    history.push(`/detail/${post.id}`);
  };

  const iconClass = post.likedByUser
    ? "bi bi-suit-heart-fill cursor-pointer hover:text-accent text-primary"
    : "bi bi-suit-heart cursor-pointer hover:text-primary text-gray-500";

  return (
    <div>
      <div
        className={`flex flex-col sm:flex-row container mx-auto bg-white w-full max-w-3xl rounded-xl ${
          isRepliesVisible ? "rounded-b-none" : ""
        } shadow-xl hover:shadow-2xl p-4 sm:p-5 md:p-6 gap-4 sm:gap-6 transition-all duration-200 hover:bg-gray-100 ${className}`}
      >
        <div className="flex flex-col justify-start w-20 sm:w-24 self-start flex-shrink-0">
          <img
            onClick={handleProfileClick}
            src={`https://i.pravatar.cc/150?u=${post.authorId}`}
            alt={post.name}
            className="w-full rounded-full aspect-square cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-primary/50 hover:ring-2 hover:ring-primary"
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-row justify-between items-center">
            <div onClick={handleProfileClick} className="cursor-pointer">
              <span className="font-heading font-bold text-gray-900 hover:underline">
                {post.name}
              </span>
              <span className="text-gray-600 ml-2 font-body hover:underline">
                @{post.username}
              </span>
              <span className="text-gray-500 ml-2 text-sm font-body">
                {date}
              </span>
            </div>
            <div className="relative" ref={menuRef}>
              <button
                onClick={handleMenuToggle}
                className="text-gray-500 hover:text-primary"
              >
                <i className="bi bi-three-dots"></i>
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  <button
                    onClick={handleDelete}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 font-bold"
                  >
                    Sil
                  </button>
                </div>
              )}
            </div>
          </div>
          <p
            className="text-gray-900 cursor-pointer font-body leading-relaxed"
            onClick={handleDetailClick}
          >
            {post.content}
          </p>
          {!isReply && (
            <div className="flex flex-row gap-6 text-gray-600 text-sm font-body">
              <div className="flex flex-row gap-2 items-center">
                <i
                  className="bi bi-chat cursor-pointer hover:text-primary transition-colors"
                  onClick={handleRepliesVisibilityToggle}
                ></i>
                <span>{post.replies?.length || 0}</span>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <i
                  className={iconClass}
                  onClick={post.likedByUser ? handleUnlike : handleLike}
                ></i>
                <span>{post.likes}</span>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <i className="bi bi-arrow-repeat cursor-pointer hover:text-primary transition-colors"></i>
                <span>{post.retweets || 0}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      {!isReply && isRepliesVisible && post.replies && (
        <Replies parentPost={post} replies={post.replies} />
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
};

export default Post;

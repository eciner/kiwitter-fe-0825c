import { useState, memo, useCallback } from "react";
import axios from "../utils/axios.js";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const MAX_LENGTH = 160;

const PostEditor = memo(function PostEditor({
  addPost,
  className = "",
  isReply = false,
  parentId = null,
}) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    setText(e.target.value.slice(0, MAX_LENGTH));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim()) {
      toast.error(isReply ? "Yanıt boş olamaz" : "Tweet boş olamaz");
      return;
    }

    setIsSubmitting(true);

    const endpoint = isReply ? `/tweets/${parentId}/replies` : "/tweets";
    const payload = { content: text };

    axios
      .post(endpoint, payload)
      .then((resp) => {
        const newPost = isReply ? resp.data.reply : resp.data.tweet;
        addPost(newPost);
        setText("");
        toast.success(isReply ? "Yanıt gönderildi" : "Tweet gönderildi");
      })
      .catch((error) => {
        toast.error(isReply ? "Yanıt gönderilemedi" : "Tweet gönderilemedi");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const disabled = text.length === 0 || isSubmitting;

  return (
    <div
      className={`flex flex-col container mx-auto ${
        isReply
          ? "bg-gray-50 rounded-lg shadow-sm border border-gray-200"
          : "bg-white rounded-xl shadow-xl"
      } w-[40vw] p-4 gap-4 ${className}`}
    >
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full h-28 border-2 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body resize-none transition-all duration-200 hover:border-primary/20 bg-white"
          placeholder={isReply ? "Yanıtını yaz..." : "Düşüncelerini yaz"}
          value={text}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        <div className="flex flex-row justify-between items-center mt-3">
          <span
            className={`text-xs font-body font-medium ${
              MAX_LENGTH - text.length < 20 ? "text-red-500" : "text-gray-500"
            }`}
          >
            {MAX_LENGTH - text.length} karakter
          </span>
          <button
            type="submit"
            disabled={disabled}
            className={`${
              disabled
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-primary hover:bg-accent hover:shadow-lg hover:scale-[1.05] active:scale-[0.95]"
            } text-white px-5 py-2 rounded-lg font-bold text-sm font-body transition-all duration-200`}
          >
            {isSubmitting ? "Gönderiliyor..." : isReply ? "Yanıtla" : "Gönder"}
          </button>
        </div>
      </form>
    </div>
  );
});

PostEditor.propTypes = {
  addPost: PropTypes.func.isRequired,
  className: PropTypes.string,
  isReply: PropTypes.bool,
  parentId: PropTypes.string,
};

export default PostEditor;

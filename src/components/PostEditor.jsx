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
      className={`flex flex-col container mx-auto w-full max-w-3xl ${
        isReply
          ? "bg-gradient-to-r from-blue-50/80 via-white to-blue-50/80 rounded-lg shadow-md border-2 border-primary/20 hover:border-primary/40 hover:shadow-lg"
          : "bg-white rounded-xl shadow-xl"
      } p-4 sm:p-5 md:p-6 gap-4 transition-all duration-200 ${className}`}
    >
      <form onSubmit={handleSubmit}>
        <textarea
          className={`w-full border-2 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body resize-none transition-all duration-200 ${
            isReply
              ? "h-20 bg-white hover:bg-blue-50/70 hover:border-primary/40 border-primary/15"
              : "h-28 bg-white hover:border-primary/20 border-gray-300"
          }`}
          aria-label={isReply ? "Yanıt" : "Tweet"}
          placeholder={isReply ? "Yanıtını yaz..." : "Düşüncelerini yaz"}
          value={text}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mt-3">
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
            } text-white px-5 py-2 rounded-lg font-bold text-sm font-body transition-all duration-200 w-full sm:w-auto`}
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

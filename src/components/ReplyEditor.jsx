import { useState } from "react";
import axios from "../utils/axios.js";
import { useDispatch } from "react-redux";
import { replyToTweet } from "../redux/tweetsSlice.js";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const MAX_LENGTH = 160;

export default function ReplyEditor({
  parentPost,
  onReplyAdded,
  className = "",
}) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim()) {
      toast.error("Yanıt boş olamaz");
      return;
    }

    setIsSubmitting(true);

    axios
      .post(`/tweets/${parentPost.id}/replies`, { content: text })
      .then((resp) => {
        const newReply = resp.data.reply;
        dispatch(replyToTweet({ replyTo: parentPost.id, reply: newReply }));
        setText("");
        toast.success("Yanıt gönderildi");
        if (onReplyAdded) {
          onReplyAdded(newReply);
        }
      })
      .catch((error) => {
        toast.error("Yanıt gönderilemedi");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const disabled = text.length === 0 || isSubmitting;

  return (
    <div
      className={`flex flex-col container mx-auto bg-white w-full max-w-3xl rounded-xl shadow-xl p-4 sm:p-5 md:p-6 gap-6 ${className}`}
    >
      <h3 className="text-lg font-heading font-bold text-gray-900">
        Yanıt Yaz
      </h3>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full h-20 border-2 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body resize-none"
          placeholder="Düşünceni paylaş..."
          value={text}
          onChange={handleChange}
          maxLength={MAX_LENGTH}
          disabled={isSubmitting}
        />
        <div className="flex flex-row justify-between items-center mt-2">
          <span className="text-sm text-gray-500 font-body font-medium">
            {MAX_LENGTH - text.length} karakter kaldı
          </span>
          <button
            type="submit"
            disabled={disabled}
            className={`${
              disabled
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-primary hover:bg-accent"
            } text-white px-6 py-2 rounded-lg font-bold font-body transition-colors duration-200`}
          >
            {isSubmitting ? "Gönderiliyor..." : "Yanıtla"}
          </button>
        </div>
      </form>
    </div>
  );
}

ReplyEditor.propTypes = {
  parentPost: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  onReplyAdded: PropTypes.func,
  className: PropTypes.string,
};

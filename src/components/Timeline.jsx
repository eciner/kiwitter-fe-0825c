import { memo } from "react";
import Post from "./Post.jsx";
import PropTypes from "prop-types";

const Timeline = memo(function Timeline({ posts, isLoading, isSuccess }) {
  if (isLoading) {
    return (
      <span className="text-white font-body text-lg animate-pulse">
        Yükleniyor...
      </span>
    );
  }

  if (!isSuccess) {
    return (
      <span className="text-white font-body text-base opacity-75">
        Bir şeyler ters gitti
      </span>
    );
  }

  const postItems = posts.map((post) => <Post key={post.id} post={post} />);

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
      <div className="flex flex-col gap-6">
        {postItems.length > 0 ? (
          postItems
        ) : (
          <span className="text-white font-body text-center py-8 opacity-60">
            Bu kullanıcının tweet'leri yok
          </span>
        )}
      </div>
    </div>
  );
});

Timeline.propTypes = {
  posts: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isSuccess: PropTypes.bool.isRequired,
};

export default Timeline;

import PropTypes from "prop-types";

export default function TimelineSelector({ setMode, mode }) {
  return (
    <nav
      className="w-full max-w-3xl mx-auto overflow-x-auto"
      aria-label="Timeline tabs"
    >
      <ul
        className="flex flex-row gap-4 sm:gap-6 text-white mt-4 px-2 text-sm font-body font-semibold border-b border-white/20 whitespace-nowrap"
        role="tablist"
      >
        <li>
          <button
            className={`${
              mode === "timeline"
                ? "border-b-2 pb-2 border-white font-bold transition-all inline-block"
                : "pb-2 inline-block font-semibold hover:text-gray-200 hover:border-b-2 hover:border-gray-300 transition-all"
            } bg-transparent border-0 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded`}
            type="button"
            role="tab"
            aria-selected={mode === "timeline"}
            onClick={() => setMode("timeline")}
          >
            Timeline
          </button>
        </li>
        <li>
          <button
            className={`${
              mode === "tweets"
                ? "border-b-2 pb-2 border-white font-bold transition-all inline-block"
                : "pb-2 inline-block font-semibold hover:text-gray-200 hover:border-b-2 hover:border-gray-300 transition-all"
            } bg-transparent border-0 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded`}
            type="button"
            role="tab"
            aria-selected={mode === "tweets"}
            onClick={() => setMode("tweets")}
          >
            Tweetler
          </button>
        </li>
        <li>
          <button
            className={`${
              mode === "replies"
                ? "border-b-2 pb-2 border-white font-bold transition-all inline-block"
                : "pb-2 inline-block font-semibold hover:text-gray-200 hover:border-b-2 hover:border-gray-300 transition-all"
            } bg-transparent border-0 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded`}
            type="button"
            role="tab"
            aria-selected={mode === "replies"}
            onClick={() => setMode("replies")}
          >
            Yanıtlar
          </button>
        </li>
        <li>
          <button
            className={`${
              mode === "most_liked"
                ? "border-b-2 pb-2 border-white font-bold transition-all inline-block"
                : "pb-2 inline-block font-semibold hover:text-gray-200 hover:border-b-2 hover:border-gray-300 transition-all"
            } bg-transparent border-0 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded`}
            type="button"
            role="tab"
            aria-selected={mode === "most_liked"}
            onClick={() => setMode("most_liked")}
          >
            En Beğenilenler
          </button>
        </li>
      </ul>
    </nav>
  );
}

TimelineSelector.propTypes = {
  mode: PropTypes.string.isRequired,
  setMode: PropTypes.func.isRequired,
};

import PropTypes from "prop-types";

export default function TimelineSelector({ setMode, mode }) {
  return (
    <nav className="w-full max-w-3xl mx-auto overflow-x-auto">
      <ul className="flex flex-row gap-4 sm:gap-6 text-white mt-4 px-2 text-sm font-body font-semibold border-b border-white/20 whitespace-nowrap">
        <li>
          <a
            className={
              mode === "timeline"
                ? "border-b-2 pb-2 border-white font-bold transition-all inline-block"
                : "pb-2 inline-block font-semibold hover:text-gray-200 hover:border-b-2 hover:border-gray-300 transition-all"
            }
            href="#"
            onClick={() => setMode("timeline")}
          >
            Timeline
          </a>
        </li>
        <li>
          <a
            className={
              mode === "most_liked"
                ? "border-b-2 pb-2 border-white font-bold transition-all inline-block"
                : "pb-2 inline-block font-semibold hover:text-gray-200 hover:border-b-2 hover:border-gray-300 transition-all"
            }
            href="#"
            onClick={() => setMode("most_liked")}
          >
            En Beğenilenler
          </a>
        </li>
      </ul>
    </nav>
  );
}

TimelineSelector.propTypes = {
  mode: PropTypes.string.isRequired,
  setMode: PropTypes.func.isRequired,
};

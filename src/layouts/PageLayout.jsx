import Header from "../components/Header.jsx";
import PropTypes from "prop-types";

export default function PageLayout({
  children,
  className = "container mx-auto w-full max-w-5xl bg-white min-h-96 rounded-none sm:rounded-xl shadow-xl px-4 sm:px-6 md:px-8 py-6 transition-all duration-300 hover:shadow-2xl",
}) {
  return (
    <div className="relative">
      <div className="sticky top-0 bg-primary shadow-lg z-10 transition-shadow duration-300 hover:shadow-xl">
        <Header />
      </div>
      <div className="pt-6 pb-12">
        <main className={`${className} flex flex-col items-center gap-6`}>
          {children}
        </main>
      </div>
    </div>
  );
}

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

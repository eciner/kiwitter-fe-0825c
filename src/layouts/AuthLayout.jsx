import PropTypes from "prop-types";
import LogoDark from "../icon/logo-dark.svg";

export default function AuthLayout({ children }) {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-0 transition-all duration-500">
      <main className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-2xl p-8 sm:p-10 transform hover:shadow-3xl transition-all duration-300">
        <div className="flex justify-center mb-8">
          <img src={LogoDark} alt="Kiwitter logo" className="w-8 h-8" />
        </div>
        {children}
      </main>
    </div>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, logout } from "../redux/userSlice.js";
import { useState } from "react";
import LoginModal from "./LoginModal.jsx";
import LogoLight from "../icon/logo-light.svg";

export default function Header() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoggedIn = !!user;
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const history = useHistory();

  const handleLogout = () => {
    dispatch(logout());
    history.push("/login");
  };

  let links;

  if (isLoggedIn) {
    links = (
      <>
        <Link
          to={`/${user.nickname}`}
          className="flex items-center gap-2 hover:text-gray-300 transition-colors duration-200 hover:underline underline-offset-2"
        >
          <img
            src={`https://i.pravatar.cc/150?u=${user.sub ?? user.id}`}
            alt={user.name}
            className="w-8 h-8 rounded-full border-2 border-white/20"
          />
          Profilim
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="hover:text-gray-300 transition-colors duration-200 hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded"
        >
          Çıkış Yap
        </button>
      </>
    );
  } else {
    links = (
      <>
        <button
          type="button"
          onClick={() => setIsLoginModalOpen(true)}
          className="hover:text-gray-300 transition-colors duration-200 hover:underline underline-offset-2 bg-none border-none cursor-pointer text-white font-body text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded"
        >
          Giriş Yap
        </button>
        <Link
          to="/signup"
          className="px-4 py-2 bg-accent rounded-lg hover:bg-accent/80 transition-all duration-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          Kayıt Ol
        </Link>
      </>
    );
  }

  return (
    <>
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <Link
          to="/"
          className="hover:opacity-80 transition-opacity duration-200 flex items-center gap-2"
        >
          <img src={LogoLight} alt="Kiwitter logo" className="w-6 h-6" />
          <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-wide">
            kiwitter
          </h1>
        </Link>
        <nav className="font-body font-bold text-xs sm:text-sm flex flex-row flex-wrap gap-3 sm:gap-4 items-center justify-start sm:justify-end text-left sm:text-right w-full sm:w-auto">
          {links}
        </nav>
      </header>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}

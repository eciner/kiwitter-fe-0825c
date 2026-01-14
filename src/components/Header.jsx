import { Link } from "react-router-dom";
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

  const handleLogout = () => {
    dispatch(logout());
  };

  let links;

  if (isLoggedIn) {
    links = (
      <>
        <Link
          to={`/${user.nickname}`}
          className="hover:text-gray-300 transition-colors duration-200 hover:underline underline-offset-2"
        >
          Profilim
        </Link>
        <a
          href="#"
          onClick={handleLogout}
          className="hover:text-gray-300 transition-colors duration-200 hover:underline underline-offset-2"
        >
          Çıkış Yap
        </a>
      </>
    );
  } else {
    links = (
      <>
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="hover:text-gray-300 transition-colors duration-200 hover:underline underline-offset-2 bg-none border-none cursor-pointer text-white font-body text-sm font-bold"
        >
          Giriş Yap
        </button>
        <Link
          to="/signup"
          className="px-4 py-2 bg-accent rounded-lg hover:bg-accent/80 transition-all duration-200 hover:shadow-lg"
        >
          Kayıt Ol
        </Link>
      </>
    );
  }

  return (
    <>
      <header className="container mx-auto p-6 text-white flex flex-row justify-between items-center">
        <Link
          to="/"
          className="hover:opacity-80 transition-opacity duration-200 flex items-center gap-2"
        >
          <img src={LogoLight} alt="Kiwitter logo" className="w-6 h-6" />
          <h1 className="text-3xl font-display font-bold tracking-wide">
            kiwitter
          </h1>
        </Link>
        <nav className="font-body font-bold text-sm flex flex-row gap-4 items-center">
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

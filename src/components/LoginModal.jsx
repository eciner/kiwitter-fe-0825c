import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../redux/userSlice.js";
import axios, { setToken } from "../utils/axios.js";
import PropTypes from "prop-types";
import LogoDark from "../icon/logo-dark.svg";

export default function LoginModal({ isOpen, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
  });

  function handleLogin(data) {
    setIsSubmitting(true);
    axios
      .post("/login", data)
      .then((resp) => {
        const token = resp.data.token;
        setToken(token);
        dispatch(login(token));
        toast.success("Giriş başarılı");
        reset();
        setIsSubmitting(false);
        onClose();
        // Force a small delay to ensure state updates
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .catch((error) => {
        const errorMsg =
          error.response?.data?.message ||
          "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.";
        toast.error(errorMsg);
        setIsSubmitting(false);
      });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-all duration-200">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-in fade-in scale-in duration-300">
        <div className="flex justify-center mb-6">
          <img src={LogoDark} alt="Kiwitter logo" className="w-8 h-8" />
        </div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-heading font-bold text-primary">
            Hoş Geldin!
          </h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors text-2xl w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(handleLogin)}>
          <div className="pt-4">
            <div className="flex justify-between gap-2 items-baseline pb-1">
              <label htmlFor="nickname" className="font-body font-medium">
                Kullanıcı adı
              </label>
              <span className="text-sm font-medium text-red-600 font-body">
                {errors.nickname && errors.nickname.message.toString()}
              </span>
            </div>
            <input
              type="text"
              id="nickname"
              className="w-full h-11 px-4 border-2 rounded-lg border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none font-body transition-all duration-200 hover:border-gray-400"
              {...register("nickname", { required: "Bu alan zorunlu" })}
            />
          </div>

          <div className="pt-4">
            <div className="flex justify-between gap-2 items-baseline pb-1">
              <label htmlFor="password" className="font-body font-medium">
                Şifre
              </label>
              <span className="text-sm font-medium text-red-600 font-body">
                {errors.password && errors.password.message.toString()}
              </span>
            </div>
            <input
              type="password"
              id="password"
              className="w-full h-11 px-4 border-2 rounded-lg border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none font-body transition-all duration-200 hover:border-gray-400"
              {...register("password", { required: "Bu alan zorunlu" })}
            />
          </div>

          <div className="pt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-lg border-2 border-gray-300 text-gray-700 font-bold font-body transition-all duration-200 hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 rounded-lg bg-primary text-white font-bold font-body transition-all duration-200 hover:bg-accent hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Giriş yapılıyor..." : "GİRİŞ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

LoginModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

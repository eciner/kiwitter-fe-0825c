import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import LogoDark from "../icon/logo-dark.svg";
import useLogin from "../hooks/useLogin.js";

export default function LoginModal({ isOpen, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const loginUser = useLogin();
  const modalRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setFocus,
  } = useForm({
    mode: "onChange",
  });

  function handleLogin(data) {
    setIsSubmitting(true);
    loginUser(data)
      .then(() => {
        toast.success("Giriş başarılı");
        reset();
        onClose();
      })
      .catch((error) => {
        const errorMsg =
          error.response?.data?.message ||
          "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.";
        toast.error(errorMsg);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setFocus("nickname");
      });
    }
  }, [isOpen, setFocus]);

  if (!isOpen) return null;

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      onClose();
    }

    if (event.key === "Tab" && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-all duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto animate-in fade-in scale-in duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        onKeyDown={handleKeyDown}
        ref={modalRef}
      >
        <div className="flex justify-center mb-6">
          <img src={LogoDark} alt="Kiwitter logo" className="w-8 h-8" />
        </div>
        <div className="flex justify-between items-center mb-6">
          <h1
            id="login-modal-title"
            className="text-3xl font-heading font-bold text-primary"
          >
            Hoş Geldin!
          </h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors text-2xl w-8 h-8 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
            aria-label="Kapat"
            type="button"
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
              <span
                id="login-nickname-error"
                className="text-sm font-medium text-red-600 font-body"
                role="alert"
              >
                {errors.nickname && errors.nickname.message.toString()}
              </span>
            </div>
            <input
              type="text"
              id="nickname"
              className="w-full h-11 px-4 border-2 rounded-lg border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none font-body transition-all duration-200 hover:border-gray-400"
              aria-invalid={Boolean(errors.nickname)}
              aria-describedby={
                errors.nickname ? "login-nickname-error" : undefined
              }
              {...register("nickname", { required: "Bu alan zorunlu" })}
            />
          </div>

          <div className="pt-4">
            <div className="flex justify-between gap-2 items-baseline pb-1">
              <label htmlFor="password" className="font-body font-medium">
                Şifre
              </label>
              <span
                id="login-password-error"
                className="text-sm font-medium text-red-600 font-body"
                role="alert"
              >
                {errors.password && errors.password.message.toString()}
              </span>
            </div>
            <input
              type="password"
              id="password"
              className="w-full h-11 px-4 border-2 rounded-lg border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none font-body transition-all duration-200 hover:border-gray-400"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? "login-password-error" : undefined
              }
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

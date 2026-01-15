import AuthLayout from "../layouts/AuthLayout.jsx";
import Header from "../components/Header.jsx";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useState } from "react";
import useLogin from "../hooks/useLogin.js";

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const history = useHistory();
  const loginUser = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  function handleLogin(data) {
    setIsSubmitting(true);
    loginUser(data)
      .then(() => {
        toast.success("Giriş başarılı");
        setTimeout(() => {
          history.push("/");
        }, 1000);
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

  return (
    <>
      <Header />
      <AuthLayout>
        <h1 className="text-3xl text-center font-heading font-bold tracking-tight text-primary mb-6">
          Hoş Geldin!
        </h1>
        <form onSubmit={handleSubmit(handleLogin)}>
          <div className="pt-4">
            <div className="flex justify-between gap-2 items-baseline pb-1">
              <label htmlFor="nickname" className="font-body font-medium">
                Kullanıcı adı
              </label>
              <span
                id="login-page-nickname-error"
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
                errors.nickname ? "login-page-nickname-error" : undefined
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
                id="login-page-password-error"
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
                errors.password ? "login-page-password-error" : undefined
              }
              {...register("password", { required: "Bu alan zorunlu" })}
            />
          </div>
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 text-center block w-full rounded-lg bg-primary hover:bg-accent text-white font-bold font-body transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Giriş yapılıyor..." : "GİRİŞ"}
            </button>
          </div>
        </form>
      </AuthLayout>
    </>
  );
}

import queryString from "query-string";
import AuthLayout from "../layouts/AuthLayout.jsx";
import Header from "../components/Header.jsx";
import { useLocation, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../redux/userSlice.js";
import axios, { setToken } from "../utils/axios.js";
import { useState } from "react";

export default function Login() {
  const { search } = useLocation();
  const values = queryString.parse(search);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
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
        setTimeout(() => {
          history.push("/");
        }, 1000);
      })
      .catch((error) => {
        const errorMsg =
          error.response?.data?.message ||
          "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.";
        toast.error(errorMsg);
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
              <label htmlFor="nickname " className="font-body font-medium">
                Kullanıcı adı
              </label>
              <span className="text-sm font-medium text-red-600 font-body">
                {errors.nickname && errors.nickname.message.toString()}
              </span>
            </div>
            <input
              type="text"
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
              className="w-full h-11 px-4 border-2 rounded-lg border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none font-body transition-all duration-200 hover:border-gray-400"
              {...register("password", { required: "Bu alan zorunlu" })}
            />
          </div>
          <div className="pt-6">
            <button
              type="submit"
              className="h-12 text-center block w-full rounded-lg bg-primary hover:bg-accent text-white font-bold font-body transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              GİRİŞ
            </button>
          </div>
        </form>
      </AuthLayout>
    </>
  );
}

import AuthLayout from "../layouts/AuthLayout.jsx";
import Header from "../components/Header.jsx";
import { useForm } from "react-hook-form";
import axios from "../utils/axios.js";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

export default function Signup() {
  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  function handleSignup(data) {
    axios
      .post("/signup", data)
      .then((response) => {
        toast.success("Kayıt başarılı. Giriş yapabilirsiniz");
        setTimeout(() => {
          history.push("/login");
        }, 2000);
      })
      .catch((error) => {
        toast.error("Kayıt başarısız");
      });
  }

  return (
    <>
      <Header />
      <AuthLayout>
        <h1 className="text-3xl text-center font-heading font-bold tracking-tight text-primary mb-6">
          Hoş Geldin!
        </h1>
        <form onSubmit={handleSubmit(handleSignup)}>
          <div className="pt-4">
            <div className="flex justify-between gap-2 items-baseline pb-1">
              <label htmlFor="name" className="font-body font-medium">
                İsim Soyisim
              </label>
              <span className="text-sm font-medium text-red-600 font-body">
                {errors.name && errors.name.message.toString()}
              </span>
            </div>
            <input
              type="text"
              id="name"
              className="w-full h-11 px-4 border-2 rounded-lg border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none font-body transition-all duration-200 hover:border-gray-400"
              {...register("name", { required: "Bu alan zorunlu" })}
            />
          </div>

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
              <label htmlFor="email" className="font-body font-medium">
                Email
              </label>
              <span className="text-sm font-medium text-red-600 font-body">
                {errors.email && errors.email.message.toString()}
              </span>
            </div>
            <input
              type="email"
              id="email"
              className="w-full h-11 px-4 border-2 rounded-lg border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none font-body transition-all duration-200 hover:border-gray-400"
              {...register("email", {
                required: "Bu alan zorunlu",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Geçerli bir email adresi girin",
                },
              })}
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

          <div className="pt-6">
            <button
              type="submit"
              className="h-12 text-center block w-full rounded-lg bg-primary hover:bg-accent text-white font-bold font-body transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              KAYIT OL
            </button>
          </div>
        </form>
      </AuthLayout>
    </>
  );
}

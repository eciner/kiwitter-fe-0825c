import { useState, useEffect, lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { getAuthToken } from "./utils/auth.js";
import { setToken } from "./utils/axios.js";
import { useDispatch } from "react-redux";
import { login } from "./redux/userSlice.js";

// Lazy load pages for better initial load performance
const Login = lazy(() => import("./pages/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Detail = lazy(() => import("./pages/Detail.jsx"));

import "./utils/devserver.js";
import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      dispatch(login(token));
      setToken(token);
    }
    setIsLoading(false);
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="text-center text-2xl font-heading font-bold text-white py-8">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div>
      <Suspense
        fallback={
          <div className="text-center text-2xl font-heading font-bold text-white p-8">
            Yükleniyor...
          </div>
        }
      >
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>

          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/detail/:tweetId">
            <Detail />
          </Route>
          <Route path="/:username">
            <Profile />
          </Route>
        </Switch>
      </Suspense>
      <ToastContainer autoClose={2000} />
    </div>
  );
}

export default App;

import { React, useEffect, useState } from "react";
// import { ProfDashboard } from "./Dashboard";
import { Link, useNavigate } from "react-router-dom";
import { HandleLoginFirebaseProf } from "../../Firebase";
import osloStrip from "../../images/osloStrip.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function notifyLoginProf(msg) {
  toast(msg);
}

export default function LoginProf() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setChecked] = useState(false);
  const navigate = useNavigate();

  const handleProfLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("loggedInAs", "Prof");
    localStorage.removeItem("ComingFromLogoutProf");
    HandleLoginFirebaseProf(navigate, email, password, isChecked);
    setEmail("");
    setPassword("");
  };

  const handleChange = (e) => {
    setChecked(e.target.checked);
  };

  useEffect(() => {
    setEmail(localStorage.getItem("emailProf"));
    setPassword(localStorage.getItem("passwordProf"));
    const val = localStorage.getItem("noBackProf");
    if (val != undefined) {
      componentDidUpdate();
      localStorage.removeItem("noBackProf");
    }
  }, []);

  function componentDidUpdate() {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", function (event) {
      window.history.pushState(null, document.title, window.location.href);
    });
  }

  return (
    <>
      <header
        class="py-6 bg-gray-700 text-white text-center flex justify-around"
        style={{
          height: "12vh",
          backgroundColor: "#FCE2DB",
          alignItems: "center",
        }}
      >
        <h1
          className="text-2xl tracking-wider"
          style={{
            color: "#9656A1",
            fontWeight: "500",
            fontFamily: "Playfair Display",
          }}
        >
          About OSLO
        </h1>
        <h1
          className="text-2xl tracking-wider"
          style={{
            color: "#9656A1",
            fontWeight: "500",
            fontFamily: "Playfair Display",
          }}
        >
          Contact OSLO
        </h1>
        <h1
          className="text-2xl tracking-wider"
          style={{
            color: "#9656A1",
            fontWeight: "500",
            fontFamily: "Playfair Display",
          }}
        >
          Creators
        </h1>
      </header>
      <div
        className="bg-no-repeat bg-cover bg-center relative"
        style={{ backgroundColor: "#C490E4", fontFamily: "Merriweather" }}
      >
        <ToastContainer />
        <div className="absolute bg-gradient-to-b opacity-75 inset-0 z-0"></div>
        <div
          className="sm:flex sm:flex-row mx-0"
          style={{ justifyContent: "space-evenly", height: "88vh" }}
        >
          <div className="flex-col flex self-center p-10 sm:max-w-5xl xl:max-w-2xl  z-10">
            <div className="self-start hidden lg:flex flex-col text-white">
              <img src={osloStrip} className="logo" />
            </div>
          </div>
          <div className="flex justify-center self-center  z-10">
            <div
              className="p-12 bg-white mx-auto rounded-2xl w-100 "
              style={{ width: "400px", backgroundColor: "#F7E8F6" }}
            >
              <div className="mb-4">
                <h3 className="font-semibold text-2xl text-gray-800">
                  Sign In{" "}
                </h3>
                <p className="text-gray-500">Please sign in to your account.</p>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 tracking-wide">
                    Email
                  </label>
                  <input
                    className=" w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                    type="email"
                    name="email"
                    id="emailProf"
                    placeholder="email@snu.edu.in"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                    Password
                  </label>
                  <input
                    className="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                    type="password"
                    name="password"
                    id="passwordProf"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember_me"
                      name="remember_me"
                      type="checkbox"
                      className="h-4 w-4 bg-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                      onChange={handleChange}
                    />
                    <label
                      for="remember_me"
                      className="ml-2 block text-sm text-gray-800"
                    >
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <a
                      href="/ForgotPassword"
                      // className="text-green-400 hover:text-green-500"
                      style={{ color: "#937DC2" }}
                      onClick={localStorage.setItem("FromFP", 1)}
                    >
                      Forgot your password?
                    </a>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center bg-green-400  hover:bg-green-500 text-gray-100 p-3  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
                    onClick={handleProfLogin}
                    style={{ background: "#C490E4", color: "#F7E8F6" }}
                  >
                    Sign in
                  </button>
                </div>
                <div
                  className="text-sm"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <a
                    href="/SigninProf"
                    className="text-green-400 hover:text-green-500"
                    style={{ color: "#937DC2" }}
                  >
                    Register Professor
                  </a>
                </div>
              </div>
              <div className="pt-5 text-center text-gray-400 text-xs">
                <span>© OSLO 2022</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { notifyLoginProf };

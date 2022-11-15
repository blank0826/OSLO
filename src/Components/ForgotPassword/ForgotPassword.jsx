import { React, useEffect, useState } from "react";
// import { ProfDashboard } from "./Dashboard";
import { Link, useNavigate } from "react-router-dom";
import { ForgotPasswordFirebase } from "../../Firebase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleProfLogin = (e) => {
    e.preventDefault();
    ForgotPasswordFirebase(navigate, email);
    setEmail("");
  };

  return (
    <>
      <div
        className="bg-no-repeat bg-cover bg-center relative"
        style={{ background: "#937DC2" }}
      >
        <div className="absolute bg-gradient-to-b opacity-75 inset-0 z-0"></div>
        <div
          className="min-h-screen sm:flex sm:flex-row mx-0"
          style={{ justifyContent: "space-evenly" }}
        >
          <div className="flex-col flex self-center p-10 sm:max-w-5xl xl:max-w-2xl  z-10">
            <div className="self-start hidden lg:flex flex-col text-white">
              <img src="" className="mb-3" />
              <h1 className="mb-3 font-bold text-6xl tracking-wider">OSLO</h1>
              <p className="pr-3 text-4xl">One Stop Learning Opportunity </p>
            </div>
          </div>
          <div className="flex justify-center self-center  z-10">
            <div
              className="p-12 bg-white mx-auto rounded-2xl w-100 "
              style={{ width: "400px" }}
            >
              <div className="mb-4">
                <h3 className="font-semibold text-2xl text-gray-800">
                  Forgot Password{" "}
                </h3>
                <p className="text-gray-500">
                  An email will be sent to reset your password.
                </p>
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
                    id="emailForgot"
                    placeholder="email@gmail.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center bg-green-400  hover:bg-green-500 text-gray-100 p-3  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
                    onClick={handleProfLogin}
                    style={{ background: "#937DC2" }}
                  >
                    Send Email
                  </button>
                </div>
              </div>
              <div className="pt-5 text-center text-gray-400 text-xs">
                <span>Copyright © 2022-2023</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HandleSignupUser } from "../../Firebase";
import osloStrip from "../../images/osloStrip.png";
export default function SigninUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [rollnumber, setRollNumber] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    HandleSignupUser(navigate, email, password, name, rollnumber, repeat, 1);
  };

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
        style={{ background: "#C490E4", fontFamily: "Merriweather" }}
      >
        <div className="absolute bg-gradient-to-b opacity-75 inset-0 z-0"></div>
        <div
          className="sm:flex sm:flex-row mx-0"
          style={{ justifyContent: "space-evenly", height: "88vh" }}
        >
          <div className="flex-col flex self-center p-10 sm:max-w-5xl xl:max-w-2xl  z-10">
            <div className="self-start hidden lg:flex flex-col  text-white">
              <img src={osloStrip} className="logo" />
            </div>
          </div>
          <div className="flex justify-center self-center  z-10">
            <div
              className="p-12 mx-auto rounded-2xl "
              style={{ width: "400px", backgroundColor: "#F7E8F6" }}
            >
              <div className="mb-4">
                <h3 className="font-semibold text-2xl text-gray-800">
                  Register{" "}
                </h3>
                <p className="text-gray-500">Register your account.</p>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  {/* <label className="text-sm font-medium text-gray-700 tracking-wide">
                    Name
                  </label> */}
                  <input
                    className=" w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Name"
                  />
                </div>
                <div className="space-y-2">
                  {/* <label className="text-sm font-medium text-gray-700 tracking-wide">
                    Roll Number
                  </label> */}
                  <input
                    className=" w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                    type="text"
                    id="rollnumber"
                    placeholder="Roll Number"
                    value={rollnumber}
                    onChange={(event) => setRollNumber(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  {/* <label className="text-sm font-medium text-gray-700 tracking-wide">
                    Email
                  </label> */}
                  <input
                    className=" w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  {/* <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                    Password
                  </label> */}
                  <input
                    className="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  {/* <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                    Confirm Password
                  </label> */}
                  <input
                    className="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                    type="password"
                    name="password"
                    id="repeatpassword"
                    placeholder="Confirm Password"
                    value={repeat}
                    onChange={(event) => setRepeat(event.target.value)}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center bg-green-400  hover:bg-green-500 text-gray-100 p-3  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
                    onClick={handleSignup}
                    style={{ background: "#C490E4", color: "#F7E8F6" }}
                  >
                    Register
                  </button>
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

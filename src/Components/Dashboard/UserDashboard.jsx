import { React } from "react";
// import { ProfDashboard } from "./Dashboard";

export default function UserDashboard() {
  return (
    <>
      <div
        className="bg-no-repeat bg-cover bg-center relative"
        style={{
          backgroundColor: "#937DC2",
        }}
      >
        <div className="absolute bg-gradient-to-b opacity-75 inset-0 z-0"></div>
        <div
          className="min-h-screen sm:flex sm:flex-row mx-0"
          style={{ justifyContent: "space-evenly" }}
        >
          <div className="flex-col flex  self-center p-10 sm:max-w-5xl xl:max-w-2xl  z-10">
            <div className="self-start hidden lg:flex flex-col  text-white">
              <img src="" className="mb-3" />
              <h1 className="mb-3 font-bold text-5xl">OSLO</h1>
              <p className="pr-3">USER DASHBOARD</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

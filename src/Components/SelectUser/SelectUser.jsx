import { React } from "react";
// import { ProfDashboard } from "./Dashboard";
import teacher from "../../images/teacher.png";
import student from "../../images/student.png";

export default function SelectUser() {
  return (
    <>
      <div
        className="bg-no-repeat bg-cover bg-center relative"
        style={{ background: "#937DC2" }}
      >
        <div className="absolute bg-gradient-to-b opacity-75 inset-0 z-0"></div>
        <div
          className="min-h-screen sm:flex sm:flex-row mx-0"
          style={{ justifyContent: "center" }}
        >
          <h1
            style={{
              zIndex: "10",
              position: "absolute",
              fontSize: "80px",
              color: "white",
              top: "4rem",
              letterSpacing: "1rem",
            }}
          >
            OSLO
          </h1>
          <a
            class="teacher_card flex justify-center self-center  z-10"
            href="/LoginProf"
          >
            <div style={{ marginRight: "5rem", cursor: "pointer" }}>
              <div class="p-12 bg-white mx-auto rounded-2xl w-100 ">
                <div class="mb-4">
                  <h3 class="font-semibold text-2xl text-gray-800">
                    Are you a professor ?{" "}
                  </h3>
                </div>
                <img
                  src={teacher}
                  className="mx-auto my-auto"
                  style={{ width: "8rem", height: "8rem" }}
                />
              </div>
            </div>
          </a>

          <a
            class="student_card flex justify-center self-center  z-10"
            href="/LoginUser"
          >
            <div style={{ marginLeft: "5rem", cursor: "pointer" }}>
              <div class="p-12 bg-white mx-auto rounded-2xl w-100 ">
                <div class="mb-4">
                  <h3 class="font-semibold text-2xl text-gray-800">
                    Are you a student ?{" "}
                  </h3>
                </div>
                <img
                  src={student}
                  className="mx-auto my-auto"
                  style={{ width: "8rem", height: "8rem" }}
                />
              </div>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}

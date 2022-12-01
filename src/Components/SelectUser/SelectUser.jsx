import { React } from "react";
// import { ProfDashboard } from "./Dashboard";
import teacher from "../../images/teacher.png";
import student from "../../images/student.png";

export default function SelectUser() {
  return (
    <>
      <div
        className="bg-no-repeat bg-cover bg-center relative"
        style={{ background: "#C490E4" }}
      >
        <div className="absolute bg-gradient-to-b opacity-75 inset-0 z-0"></div>
        <div
          className="sm:flex sm:flex-col mx-0"
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <h1
            style={{
              fontSize: "100px",
              color: "#FFDABB",
              fontWeight: "bold",
              top: "4rem",
              // letterSpacing: "1rem",
              fontFamily: "Playfair Display",
            }}
          >
            Welcome to OSLO!
          </h1>
          <h1
            style={{
              fontSize: "80px",
              color: "#DCFFCC",
              fontWeight: "bold",
              top: "4rem",
              fontFamily: "Merriweather",
            }}
          >
            One Stop Learning Opportunity
          </h1>
        </div>
        <div
          className="sm:flex sm:flex-row mx-0"
          style={{
            justifyContent: "center",
            position: "relative",
            height: "50vh",
          }}
        >
          <a
            class="teacher_card flex justify-center self-center  z-10"
            href="/LoginProf"
            style={{ position: "absolute", top: "0px", right: "50%" }}
          >
            <div style={{ marginRight: "5rem", cursor: "pointer" }}>
              <div
                class="p-12 mx-auto rounded-2xl w-100 "
                style={{ backgroundColor: "#F7E8F6" }}
              >
                <div class="mb-4">
                  <h3
                    class="font-semibold text-2xl"
                    style={{ color: "#A374D5", fontStyle: "italic" }}
                  >
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
            style={{ position: "absolute", top: "0px", left: "50%" }}
          >
            <div style={{ marginLeft: "5rem", cursor: "pointer" }}>
              <div
                class="p-12 mx-auto rounded-2xl w-100 "
                style={{ backgroundColor: "#F7E8F6" }}
              >
                <div class="mb-4">
                  <h3
                    class="font-semibold text-2xl"
                    style={{ color: "#A374D5", fontStyle: "italic" }}
                  >
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
          {/* </div> */}
        </div>
        <div class="footer">
          <div class="footer-text">
            <p>© OSLO 2022</p>
          </div>
        </div>
      </div>
    </>
  );
}

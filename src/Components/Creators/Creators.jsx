import { React } from "react";
import osloStrip from "../../images/osloStrip.png";
import CSE_JayatiSharma from "../../images/CSE_JayatiSharma.jpg";
import CSE_AdityaSrivastava from "../../images/CSE_Aditya_Srivastava.jpg";
import CSE_AkanshMittal from "../../images/CSE_AkanshMittal.jpeg";
export default function Creators() {
  return (
    <>
      <div
        className="bg-no-repeat bg-cover bg-center relative"
        style={{ background: "#C490E4", fontFamily: "Merriweather" }}
      >
        <div className="absolute bg-gradient-to-b opacity-75 inset-0 z-0"></div>
        <div
          className="sm:flex sm:flex-row mx-0"
          style={{ marginLeft: "5rem", height: "100vh" }}
        >
          <div className="flex-col flex self-center p-10 z-10">
            <h1
              className="text-2xl tracking-wider"
              style={{
                fontSize: "50px",
                color: "#F7EDDC",
                fontWeight: "bold",
                fontFamily: "Playfair Display",
              }}
            >
              Creators
            </h1>
            <div
              className="self-start hidden lg:flex flex-col text-white"
              style={{
                marginTop: "4%",
                fontSize: "35px",
                padding: "2%",
                color: "purple",
                backgroundColor: "#F5EDDC",
                fontWeight: "bold",
                fontFamily: "Playfair Display",
              }}
            >
              {/* <img src={osloStrip} className="logo" /> */}
              We are a group of three students at Shiv Nadar Institute of
              Eminence, who thought of easing the academic experience for the
              upcoming batches at our institution by conceptualizing OSLO.
            </div>
            <div
              className="self-start hidden lg:flex flex-row text-white"
              style={{
                marginTop: "2%",
                marginLeft: "5%",
                width: "90%",
                fontSize: "35px",
                border: "2px solid #FFDABB",
                fontWeight: "bold",
                fontFamily: "Playfair Display",
                justifyContent: "space-evenly",
              }}
            >
              <div className="flex-row">
                <div>
                  {" "}
                  <img
                    src={CSE_AdityaSrivastava}
                    className="mx-auto my-auto"
                    style={{ height: "10rem", marginTop: "1rem" }}
                  />
                  <h1>Aditya Srivastava</h1>
                </div>
              </div>
              <div className="flex-row">
                <div>
                  {" "}
                  <img
                    src={CSE_JayatiSharma}
                    className="mx-auto my-auto"
                    style={{ height: "10rem", marginTop: "1rem" }}
                  />
                  <h1>Jayati Sharma</h1>
                </div>
              </div>
              <div className="flex-row">
                <div>
                  {" "}
                  <img
                    src={CSE_AkanshMittal}
                    className="mx-auto my-auto"
                    style={{ height: "10rem", marginTop: "1rem" }}
                  />
                  <h1>Akansh Mittal</h1>
                </div>
              </div>
            </div>
          </div>
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

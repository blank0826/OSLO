import { React } from "react";
import osloStrip from "../../images/osloStrip.png";
export default function About() {
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
              About OSLO
            </h1>
            <div
              className="self-start hidden lg:flex flex-col text-white"
              style={{
                marginTop: "3%",
                fontSize: "30px",
                color: "#DCFFCC",
                fontWeight: "bold",
                fontFamily: "Playfair Display",
              }}
            >
              {/* <img src={osloStrip} className="logo" /> */}A borderless
              information exchange ecosystem, empowering each category of
              university members holistically.
            </div>
            <div
              className="self-start hidden lg:flex flex-col text-white"
              style={{
                width: "95%",
                fontSize: "30px",
                marginTop: "2%",
                padding: "1%",
                color: "#9656A1",
                backgroundColor: "#F5EDDC",
                fontWeight: "bold",
                fontFamily: "Playfair Display",
              }}
            >
              {/* <img src={osloStrip} className="logo" /> */}
              It has the following features:
              <ol type="1">
                <li>1. Introductory module</li>
                <li>2. Query Raise</li>
                <li>3. Multi Tag Search</li>
                <li>4. Controlled Visibility</li>
                <li>
                  5. Complements traditional education and not competes with it.
                </li>
              </ol>
            </div>
            <div
              className="self-start hidden lg:flex flex-col text-white"
              style={{
                marginTop: "3%",
                fontSize: "30px",
                color: "#DCFFCC",
                fontWeight: "bold",
                fontFamily: "Playfair Display",
              }}
            >
              {/* <img src={osloStrip} className="logo" /> */}
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

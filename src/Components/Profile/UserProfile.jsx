import { React, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HandleSignupUser, getStudentData } from "../../Firebase";
import logo from "../../images/logo.png";
import CardProfile from "./CardProfile";
import Graph from "../../Graph";
import { ActionCodeURL } from "firebase/auth";

export default function UserProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [rollnumber, setRollNumber] = useState("");
  const [studentData, setStudentData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();
  let chart_data = [];
  useEffect(() => {
    if (studentData.length == 0) {
      console.log(studentData);
      setStudentData(getStudentData());
    } else {
      var arr = Array.from(Array(7).keys()).map((idx) => {
        const d = new Date();
        d.setDate(d.getDate() - d.getDay() + idx);
        return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
      });

      var values = Array.from(Array(7).keys()).map((idx) => {
        const d = new Date();
        d.setDate(d.getDate() - d.getDay() + idx);
        var date =
          d.getDate() + "_" + (d.getMonth() + 1) + "_" + d.getFullYear();

        var act = studentData[0].activity[date];

        if (act != undefined) {
          return act.work;
        } else {
          return 0;
        }
      });

      console.log(values);

      console.log(studentData);

      chart_data = {
        chartData: {
          labels: arr,
          data: values,
        },
      };

      setChartData(chart_data);
    }
  }, [studentData]);

  const convertToDate = (timeStamp) => {
    var time = parseInt(timeStamp);
    console.log(time);
    var d = new Date(time);
    console.log(("" + d.getMinutes()).length);
    return (
      d.getDate() +
      "/" +
      (d.getMonth() + 1) +
      "/" +
      d.getFullYear() +
      " " +
      (("" + d.getHours()).length == 1 ? "0" + d.getHours() : d.getHours()) +
      ":" +
      (("" + d.getMinutes()).length == 1
        ? "0" + d.getMinutes()
        : d.getMinutes()) +
      ":" +
      (("" + d.getSeconds()).length == 1
        ? "0" + d.getSeconds()
        : d.getSeconds())
    );
  };

  return (
    // <>
    //   <section class="text-gray-600 body-font" style={{ width: "100%" }}>
    //     {/* <div class="container px-5 py-24 mx-auto"> */}
    //     <div class="mx-auto flex flex-wrap">
    //       <CardProfile></CardProfile>
    //       {studentData.length != 0 ? (
    //         <div class="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
    //           <h2 class="text-sm title-font text-gray-500 tracking-widest">
    //             {studentData[0].branch}
    //           </h2>
    //           <h1 class="text-gray-900 text-3xl title-font font-medium mb-1">
    //             {studentData[0].name}
    //           </h1>
    //           <div class="flex mb-4"></div>
    //           <div class="flex items-center border-b-2 border-gray-100 mb-5"></div>
    //           <div class="flex">
    //             <span class="title-font font-medium text-2xl text-gray-900 w-25">
    //               Roll Number:
    //             </span>
    //             <span class="title-font font-medium text-2xl text-gray-500">
    //               &nbsp;&nbsp;&nbsp;{studentData[0].roll_number}
    //             </span>
    //           </div>
    //           <div class="flex">
    //             <span class="title-font font-medium text-2xl text-gray-900">
    //               Email:
    //             </span>
    //             <span class="title-font font-medium text-2xl text-gray-500">
    //               &nbsp;&nbsp;&nbsp;{" " + studentData[0].email}
    //             </span>
    //           </div>
    //           <div class="flex">
    //             <span class="title-font font-medium text-2xl text-gray-900">
    //               Enrolled Courses:
    //             </span>
    //             <span class="title-font font-medium text-2xl text-gray-500">
    //               {" " + studentData[0].courses}
    //             </span>
    //           </div>
    //           <div class="flex">
    //             <span class="title-font font-medium text-2xl text-gray-900">
    //               LastLogin:
    //             </span>
    //             <span class="title-font font-medium text-2xl text-gray-500">
    //               {" " + convertToDate(studentData[0].lastLogin)}
    //             </span>
    //           </div>
    //           <div class="flex">
    //             <span class="title-font font-medium text-2xl text-gray-900">
    //               Activity Graph
    //             </span>
    //             {chartData.length == 0 ? (
    //               <div className="xl:w-1/2 md:w-1 p-4"></div>
    //             ) : (
    //               <div className="p-4">
    //                 <Graph
    //                   info={chartData}
    //                   style={{ height: "400px", width: "400px" }}
    //                 />
    //               </div>
    //             )}
    //           </div>
    //         </div>
    //       ) : (
    //         <h1>Fetching</h1>
    //       )}
    //     </div>
    //     {/* </div> */}
    //   </section>
    // </>
    <>
      <section class="text-gray-600 body-font overflow-hidden">
        <div class="container px-5 py-24 mx-auto">
          <div class="lg:w-4/5 mx-auto flex flex-wrap">
            <CardProfile></CardProfile>
            {studentData.length != 0 ? (
              <div class="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                <h2 class="text-sm title-font text-gray-500 tracking-widest">
                  {studentData[0].branch}
                </h2>
                <h1 class="text-gray-900 text-3xl title-font font-medium mb-1">
                  {studentData[0].name}
                </h1>
                <div class="flex mb-4"></div>
                <div class="flex items-center border-b-2 border-gray-100 mb-5"></div>
                <div>
                  <span
                    className="tracking-wider font-bold"
                    style={{
                      color: "black",
                      fontSize: "18px",
                      fontWeight: "700",
                      fontFamily: "Merriweather",
                    }}
                  >
                    Roll Number:
                  </span>
                  <span
                    className="tracking-wider font-bold"
                    style={{
                      color: "black",
                      fontSize: "17px",
                      fontWeight: "700",
                      fontFamily: "Merriweather",
                    }}
                  >
                    &nbsp;&nbsp;&nbsp;{studentData[0].roll_number}
                  </span>
                </div>
                <div>
                  <span
                    className="tracking-wider font-bold"
                    style={{
                      color: "black",
                      fontSize: "18px",
                      fontWeight: "700",
                      fontFamily: "Merriweather",
                    }}
                  >
                    Email:
                  </span>
                  <span
                    className="tracking-wider font-bold"
                    style={{
                      color: "black",
                      fontSize: "17px",
                      fontWeight: "700",
                      fontFamily: "Merriweather",
                    }}
                  >
                    &nbsp;&nbsp;&nbsp;{" " + studentData[0].email}
                  </span>
                </div>
                <div>
                  <span
                    className="tracking-wider font-bold"
                    style={{
                      color: "black",
                      fontSize: "18px",
                      fontWeight: "700",
                      fontFamily: "Merriweather",
                    }}
                  >
                    Enrolled Courses:
                  </span>
                  <span
                    className="tracking-wider font-bold"
                    style={{
                      color: "black",
                      fontSize: "17px",
                      fontWeight: "700",
                      fontFamily: "Merriweather",
                    }}
                  >
                    {" " + studentData[0].courses}
                  </span>
                </div>
                <div>
                  <span
                    className="tracking-wider font-bold"
                    style={{
                      color: "black",
                      fontSize: "18px",
                      fontWeight: "700",
                      fontFamily: "Merriweather",
                    }}
                  >
                    LastLogin:
                  </span>
                  <span
                    className="tracking-wider font-bold"
                    style={{
                      color: "black",
                      fontSize: "17px",
                      fontWeight: "700",
                      fontFamily: "Merriweather",
                    }}
                  >
                    {" " + convertToDate(studentData[0].lastLogin)}
                  </span>
                </div>
                <div>
                  <span
                    className="tracking-wider font-bold"
                    style={{
                      color: "black",
                      fontSize: "18px",
                      fontWeight: "700",
                      fontFamily: "Merriweather",
                    }}
                  >
                    Activity Graph
                  </span>
                  {chartData.length == 0 ? (
                    <div className="xl:w-1/2 md:w-1 p-4"></div>
                  ) : (
                    <div className="p-4">
                      <Graph
                        info={chartData}
                        style={{ height: "400px", width: "400px" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <h1>Fetching</h1>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

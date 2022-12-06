import { React, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HandleSignupUser, getProfData } from "../../Firebase";
import logo from "../../images/logo.png";
import CardProfile from "./CardProfile";
import Graph from "../../Graph";

export default function ProfProfile({ taughtCourses }) {
  const [profData, setProfData] = useState([]);
  const [chartData, setChartData] = useState([]);

  let chart_data = [];
  useEffect(() => {
    if (profData.length == 0) {
      console.log(profData);
      console.log(taughtCourses);
      setProfData(getProfData());
    } else {
      var arr = Array.from(Array(7).keys()).map((idx) => {
        const d = new Date();
        d.setDate(d.getDate() - d.getDay() + idx);
        return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
      });

      console.log(arr);

      var values = Array.from(Array(7).keys()).map((idx) => {
        const d = new Date();
        d.setDate(d.getDate() - d.getDay() + idx);
        var date =
          d.getDate() + "_" + (d.getMonth() + 1) + "_" + d.getFullYear();

        var act = profData[0].activity[date];

        if (act != undefined) {
          return act.work;
        } else {
          return 0;
        }
      });

      console.log(values);

      console.log(taughtCourses);

      chart_data = {
        chartData: {
          labels: arr,
          data: values,
        },
      };

      setChartData(chart_data);
    }
  }, [profData]);

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
    <>
      <section class="text-gray-600 body-font m-auto">
        <div class="container px-5 py-24 mx-auto">
          <div class="flex flex-wrap mx-auto my-auto">
            <div class="lg:w-1/3 md:w-1/2 p-4 w-full">
              <CardProfile></CardProfile>
            </div>
            <div class="lg:w-2/3 md:w-1/2 p-4 w-full">
              {profData.length != 0 ? (
                <>
                  <h2
                    class="text-xl title-font text-gray-500 tracking-widest mb-5"
                    style={{ fontFamily: "Merriweather" }}
                  >
                    {taughtCourses[0].data.dept}
                  </h2>
                  <h1
                    class="text-gray-900 text-4xl title-font font-medium mb-5"
                    style={{ fontFamily: "Merriweather" }}
                  >
                    {profData[0].name}
                  </h1>
                  <div class="flex mb-4">
                    <span
                      class="title-font font-medium text-2xl text-gray-900 w-25"
                      style={{ fontFamily: "Merriweather" }}
                    >
                      Contact Number:
                    </span>
                    <span
                      class="title-font font-medium text-xl text-gray-500"
                      style={{ fontFamily: "Merriweather" }}
                    >
                      &nbsp;&nbsp;&nbsp;{profData[0].contact_number}
                    </span>
                  </div>
                  <div class="flex mb-4">
                    <span
                      class="title-font font-medium text-2xl text-gray-900"
                      style={{ fontFamily: "Merriweather" }}
                    >
                      Email:
                    </span>
                    <span
                      class="title-font font-medium text-xl text-gray-500"
                      style={{ fontFamily: "Merriweather" }}
                    >
                      &nbsp;&nbsp;{" " + profData[0].email}
                    </span>
                  </div>
                  <div class="flex mb-4">
                    <span
                      class="title-font font-medium text-2xl text-gray-900"
                      style={{ fontFamily: "Merriweather" }}
                    >
                      Office:
                    </span>
                    <span
                      class="title-font font-medium text-xl text-gray-500"
                      style={{ fontFamily: "Merriweather" }}
                    >
                      &nbsp;&nbsp;{" " + taughtCourses[0].data.office}
                    </span>
                  </div>
                  <div class="flex mb-4">
                    <span
                      class="title-font font-medium text-2xl text-gray-900"
                      style={{ fontFamily: "Merriweather" }}
                    >
                      Office Timing:
                    </span>
                    <span
                      class="title-font font-medium text-xl text-gray-500"
                      style={{ fontFamily: "Merriweather" }}
                    >
                      &nbsp;&nbsp;{" " + taughtCourses[0].data.officeTiming}
                    </span>
                  </div>
                  <div class="flex mb-4">
                    <span
                      class="title-font font-medium text-2xl text-gray-900"
                      style={{ fontFamily: "Merriweather" }}
                    >
                      Courses Taught:&nbsp;
                    </span>
                    <span
                      class="title-font font-medium text-xl text-gray-500"
                      style={{ fontFamily: "Merriweather" }}
                    >
                      {taughtCourses.map((tCourses, i) => (
                        <span
                          class="title-font font-medium text-xl text-gray-500"
                          style={{ fontFamily: "Merriweather" }}
                        >
                          {tCourses.key}
                          {i == taughtCourses.length - 1 ? "" : ", "}
                        </span>
                      ))}
                    </span>
                  </div>
                  <div class="flex mb-4">
                    <span
                      class="title-font font-medium text-2xl text-gray-900"
                      style={{ fontFamily: "Merriweather" }}
                    >
                      LastLogin:&nbsp;&nbsp;
                    </span>
                    <span
                      class="title-font font-medium text-xl text-gray-500"
                      style={{ fontFamily: "Merriweather" }}
                    >
                      {" " + convertToDate(profData[0].lastLogin)}
                    </span>
                  </div>
                </>
              ) : (
                <h1>Fetching</h1>
              )}
            </div>
            <div class="lg:w-1/1 md:w-1/1 p-4 w-full">
              <div class="mt-4 text-center">
                <h1 class="text-gray-900 title-font text-4xl font-medium">
                  ACTIVITY CHART
                </h1>
              </div>
              {chartData.length == 0 ? (
                <div className="xl:w-1/2 md:w-1 p-4"></div>
              ) : (
                <div className="p-4">
                  <Graph info={chartData} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

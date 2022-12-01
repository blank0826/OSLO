import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from "chart.js";

import { MdAutoGraph } from "react-icons/md";

import React from "react";
import { startAfter } from "firebase/database";

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale);

const buildData = ({ chartData }) => ({
  labels: chartData.labels,
  datasets: [
    {
      label: "",
      borderColor: "#bae755",
      borderDash: [5, 5],
      backgroundColor: "#e755ba",
      pointBackgroundColor: "#55bae7",
      pointBorderColor: "#55bae7",
      pointHoverBackgroundColor: "#55bae7",
      pointHoverBorderColor: "#55bae7",
      data: chartData.data,
      fill: "start",
      tension: 0.4,
    },
  ],
});

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Past 7 Days Activity Graph",
    },
  },
  // scales: {
  //   y: {
  //     title: {
  //       display: true,
  //       text: "Work Done",
  //       font: {
  //         family: "Verdana",
  //       },
  //     },
  //   },
  //   x: {
  //     title: {
  //       display: true,
  //       text: "Date",
  //     },
  //   },
  // },
};

const numberToFix = (number, fix) => (number || 0).toFixed(fix);

const Graph = ({ info }) => {
  console.log(info);
  const data = buildData(info);
  console.log(data);
  let maxval = 0;
  for (var i = 0; i < data["datasets"][0]["data"].length; i++) {
    if (maxval < data["datasets"][0]["data"][i]) {
      maxval = data["datasets"][0]["data"][i];
    }
  }

  let total = 0;
  for (var i = 0; i < data["datasets"][0]["data"].length; i++) {
    total += data["datasets"][0]["data"][i];
  }

  return (
    <>
      <div
        className="rounded shadow-xl overflow-hidden w-full md:flex m-auto"
        style={{ width: "650px", height: "400px" }}
      >
        <div className="flex w-full px-5 pb-4 bg-white-500 text-black items-center">
          <Line type="line" data={data} options={options} />
        </div>
        {/* <div className=" border-gray-200 p-6 rounded-lg">
          <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
            <MdAutoGraph style={{ width: "1.5rem", height: "1.5rem" }} />
          </div>
          <h2 className="text-lg text-gray-900 font-medium title-font mb-2">
            Donation Analysis
          </h2>
          <p className="leading-relaxed text-base">
            Monthly Highest donation: ₹{maxval}{" "}
          </p>
          <p className="leading-relaxed text-base">
            Total yearly donation: ₹{total}{" "}
          </p>
        </div> */}
      </div>
    </>
  );
};

export default Graph;

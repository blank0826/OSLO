import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from "chart.js";

import React from "react";

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
};

const Graph = ({ info }) => {
  console.log(info);
  const data = buildData(info);

  return (
    <>
      <div
        className="rounded shadow-xl overflow-hidden w-full md:flex"
        style={{ width: "450px", height: "300px" }}
      >
        <div className="flex w-full px-5 pb-4 pt-8 bg-white-500 text-black items-center">
          <Line type="line" data={data} options={options} />
        </div>
      </div>
    </>
  );
};

export default Graph;

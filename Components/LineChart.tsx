import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import axios from "axios";
import useSWR from "swr";
import { LineChart } from "../Types/index";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
      text: "Growth",
    },
  },
};

type Props = {
  userId: string;
};

const fetchLineFigures = (url: string) =>
  axios.put(url).then((res) => res.data);

const LineChart = ({ userId }: Props) => {
  const { data: lineFigures } = useSWR<any>(
    [`/api/lineChart/${userId}`],
    fetchLineFigures
  );

  const data = {
    labels: lineFigures?.data.labels,
    datasets: [
      {
        data: lineFigures?.data.data,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return (
    <div className="m-5 p-5 bg-white shadow rounded-lg px-4 py-5">
      <p className="text-center text-xl">Sales Growth</p>
      <Line options={options} data={data} />
    </div>
  );
};

export default LineChart;

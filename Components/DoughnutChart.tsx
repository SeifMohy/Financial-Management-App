import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import useSWR from "swr";
import { DoughnutChart } from "../Types/index";

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  period: string;
  userId: string;
};

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

function createChartData(data: number[], labels: string[]) {
  return {
    labels: labels,
    datasets: [
      {
        label: " ",
        data: data,
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 3,
      },
    ],
  };
}

const fetchChartData = (url: string, period: string) =>
  axios.put(url, period).then((res) => res.data);

const DoughnutChart = ({ period, userId }: Props) => {
  const { data: chartsData } = useSWR<DoughnutChart>(
    [`/api/doughnut/${userId}`, period],
    fetchChartData
  );
  console.log(chartsData);
  return (
    <div className="lg:grid lg:grid-cols-2 gap-5 m-5">
      {chartsData?.data.map((chartData: any) => {
        const data = createChartData(chartData.data, chartData.labels);
        return (
          <div
            className="p-10 bg-white shadow rounded-lg px-4 py-5 my-5"
            key={chartData.title}
          >
            <p className="text-center text-xl">{chartData.title}</p>
            <Doughnut options={options} data={data} />
          </div>
        );
      })}
    </div>
  );
};

export default DoughnutChart;

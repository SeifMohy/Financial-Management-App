import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const chartsData = [
  {
    labels: ["Revenue", "Fees", "Other Revenue"],
    data: [50, 70, 80],
    title: "Revenue Breakdown"
  },
  { labels: ["Costs", "Materials", "Salaries"], data: [50, 70, 80], title: "Cost Breakdown"},
];

function createChartData(data: number[], labels: string[]) {
  return {
    labels: labels,
    datasets: [
      {
        label: "need to dynamically add a title",
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

const DoughnutChart = () => {
  return (
    <div className="lg:grid lg:grid-cols-2 gap-3 m-5">
        {chartsData?.map((chartData: any) => {
          const data = createChartData(chartData.data, chartData.labels);
          return (
            <div>
              <p className="text-center text-xl">{chartData.title}</p>
              <Doughnut data={data} />
            </div>
          );
        })}
    </div>
  );
};

export default DoughnutChart;

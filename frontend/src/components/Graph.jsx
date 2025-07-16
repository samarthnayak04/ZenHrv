import React from "react";
import { Line } from "react-chartjs-2";
import { useLocation } from "react-router-dom";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Graph() {
  const location = useLocation();
  const { rmssdValues, sdnnValues } = location.state;

  const data = {
    labels: rmssdValues.map((_, i) => `Interval ${i + 1}`),
    datasets: [
      {
        label: "RMSSD",
        data: rmssdValues,
        borderColor: "blue",
        fill: false,
      },
      {
        label: "SDNN",
        data: sdnnValues,
        borderColor: "green",
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h2>HRV Session Graph</h2>
      <Line data={data} />
    </div>
  );
}

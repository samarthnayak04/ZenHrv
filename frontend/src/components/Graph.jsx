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

import "./styles/graph.css"; // 👈 Import the separate CSS

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
  const { rmssdValues, sdnnValues, conditions } = location.state;
  // const rmssdValues = [52, 40, 35, 45, 60, 30, 70];
  // const sdnnValues = [40, 38, 36, 39, 42, 35, 43];
  // const conditions = [0, 1, 1, 1, 1, 1, 0]; //

  const stressRMSSD = rmssdValues.map((val, i) =>
    conditions[i] === 1 ? val : null
  );

  const data = {
    labels: rmssdValues.map((_, i) => `Interval ${i + 1}`),
    datasets: [
      {
        label: "RMSSD",
        data: rmssdValues,
        borderColor: "blue",
        backgroundColor: "blue",
        fill: false,
        tension: 0.3,
      },
      {
        label: "SDNN",
        data: sdnnValues,
        borderColor: "green",
        backgroundColor: "green",
        fill: false,
        tension: 0.3,
      },
      {
        label: "Stress Detected",
        data: stressRMSSD,
        pointBackgroundColor: "red", // fill red
        pointBorderColor: "black", // outline black
        backgroundColor: "red",
        pointRadius: 7,
        pointHoverRadius: 9,
        pointStyle: "circle",
        fill: false,
        showLine: false,
      },
    ],
  };

  return (
    <div className="graph-wrapper">
      <div className="graph-card">
        <h2 className="graph-title">🧘 Your HRV Session Results</h2>
        <Line data={data} />
        <div className="graph-status mt-4">
          {conditions.includes(1) ? (
            <p className="stress">
              🔴 Red dots mark moments of stress or multiple thoughts.
            </p>
          ) : (
            <p className="calm">✅ Great job! You stayed calm throughout.</p>
          )}
        </div>
        <hr className="my-4" />
        <p className="graph-quote">
          "Every breath you take is a step toward inner peace."
        </p>
        <p className="graph-thanks">🙏 Thank you for meditating with us!</p>
      </div>
    </div>
  );
}

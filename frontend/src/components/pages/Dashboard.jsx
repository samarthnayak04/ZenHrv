// src/components/Dashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [duration, setDuration] = useState("");

  const navigate = useNavigate();

  const handleStartSession = () => {
    if (!duration) {
      alert("Please enter a duration in minutes.");
      return;
    }

    navigate("/session", { state: { duration } });
  };

  return (
    <div className="wrapper">
      <div className="dashboard-container">
        <h2>Let’s Meditate 🌿</h2>
        <p>Enter your desired meditation duration below</p>
        <input
          type="number"
          placeholder="Duration in minutes"
          className="form-control mb-3 duration-input"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <button
          className="btn btn-success start-btn"
          onClick={handleStartSession}
        >
          Start Meditation
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

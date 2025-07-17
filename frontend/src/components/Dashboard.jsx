// src/components/Dashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/dashboard.css";
// import meditationAudio from "../assets/meditation.mp3";

const Dashboard = () => {
  const [duration, setDuration] = useState("");
  const [audio] = useState(new Audio(meditationAudio));
  const navigate = useNavigate();

  const handleStartSession = () => {
    if (!duration) {
      alert("Please enter a duration in minutes.");
      return;
    }

    audio.loop = true;
    audio.play();

    // Pass duration to session page (via state or global context ideally)
    navigate("/session", { state: { duration } });
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome Back 🌿</h2>
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
  );
};

export default Dashboard;

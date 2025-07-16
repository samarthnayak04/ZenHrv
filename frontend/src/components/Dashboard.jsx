import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const startSession = async () => {
    // Simulate dummy data – later integrate your HRV script here
    const sessionData = {
      duration: 180,
      rmssdValues: [10.2, 12.5, 11.9],
      sdnnValues: [14.7, 13.8, 15.2],
      conditions: ["calm", "stressed", "calm"],
      actualCondition: 0,
    };

    try {
      await axios.post("http://localhost:5000/api/session", sessionData, {
        withCredentials: true,
      });
      navigate("/graph", { state: sessionData }); // send to Graph page
    } catch (err) {
      alert("Failed to start session");
    }
  };

  return (
    <div>
      <h2>Welcome to Meditation Dashboard</h2>
      <button onClick={startSession}>Start Meditation Session</button>
    </div>
  );
}

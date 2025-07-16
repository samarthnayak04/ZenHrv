// src/components/Session.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Session = () => {
  const [duration, setDuration] = useState(1); // default 1 min
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const startSession = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/session/start",
        { duration },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Session started:", res.data);
      setTimeout(() => {
        navigate("/graph");
      }, duration * 60 * 1000); // redirect after session
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5 text-center">
        <h2>Start a Meditation Session</h2>
        <input
          type="number"
          min="1"
          className="form-control w-25 mx-auto my-3"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <button
          className="btn btn-success"
          onClick={startSession}
          disabled={loading}
        >
          {loading ? "Running Session..." : "Start Session"}
        </button>
      </div>
    </>
  );
};

export default Session;

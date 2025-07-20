// src/components/Session.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import meditationAudio from "/hrv audio.mp3";
import axios from "axios";
import "./styles/session.css";

const Session = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const durationMinutes = location.state?.duration || 5;
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [audio] = useState(new Audio(meditationAudio));
  const [isProcessing, setIsProcessing] = useState(false);

  // Store the Python process promise
  const [processPromise, setProcessPromise] = useState(null);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    audio.loop = true;
    audio.play();

    // 🔁 Start the Python backend process once
    const promise = axios.post("/api/session/process", {
      duration: durationMinutes,
      withCredentials: true,
    });
    setProcessPromise(promise);

    // Start meditation countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          audio.pause();
          handleSessionComplete(); // trigger fetch
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const handleSessionComplete = async () => {
    setIsProcessing(true);
    try {
      const { data } = await processPromise;

      if (data && data.rmssdValues) {
        await axios.post("/api/session/save", {
          duration: durationMinutes,
          rmssdValues: data.rmssdValues,
          sdnnValues: data.sdnnValues,
          conditions: data.conditions,
        });

        navigate("/graph", { state: data });
      } else {
        alert("Session complete, but no HRV data received.");
      }
    } catch (err) {
      console.error("Session processing error:", err);
      alert("Something went wrong during processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="session-wrapper">
      <div className="session-box">
        <h2>🧘 Meditation in Progress</h2>
        <p className="timer">{formatTime(timeLeft)}</p>
        <p>Relax and let your mind settle...</p>
        <div className="pulse-animation"></div>

        {isProcessing && (
          <div className="processing-box mt-4">
            <p>Processing your HRV session... ⏳</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Session;

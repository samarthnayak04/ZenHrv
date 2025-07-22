import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import meditationAudio from "/hrv audio.mp3";
import axios from "axios";
import "../styles/session.css";

const computeBufferTime = (baseSeconds) => {
  const extraSeconds = Math.floor(baseSeconds / 30) * 10;
  return baseSeconds + extraSeconds;
};

const Session = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const durationMinutes = location.state?.duration || 5;

  const baseSeconds = durationMinutes * 60;
  const totalSeconds = computeBufferTime(baseSeconds);

  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [audio] = useState(new Audio(meditationAudio));
  const [isProcessing, setIsProcessing] = useState(false);
  const [dataReady, setDataReady] = useState(null);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    audio.loop = true;
    audio.play().catch((err) => {
      console.warn("Autoplay failed:", err);
    });

    // 🔁 Start the Python backend process immediately
    setIsProcessing(true);
    axios
      .post(
        "http://localhost:5000/api/session/process",
        { duration: durationMinutes },
        { withCredentials: true }
      )
      .then((response) => {
        console.log("✅ Received from /process:", response.data);
        setDataReady(response.data);
      })
      .catch((err) => {
        console.error("❌ Error from /process:", err);
        alert("Error running HRV session.");
      });

    // ⏳ Start meditation countdown (with buffer)
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(() => audio.pause(), 500); // slight delay
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      audio.currentTime = 0;
    };
  }, []);

  // ✅ Trigger session complete only when both time and data are ready
  useEffect(() => {
    if (timeLeft === 0 && dataReady) {
      handleSessionComplete();
    }
  }, [timeLeft, dataReady]);

  const handleSessionComplete = async () => {
    try {
      const { rmssdValues, sdnnValues, conditions } = dataReady;

      if (rmssdValues) {
        const saveRes = await axios.post(
          "http://localhost:5000/api/session/save",
          {
            duration: durationMinutes,
            rmssdValues,
            sdnnValues,
            conditions,
          },
          { withCredentials: true }
        );

        console.log("✅ Saved to DB:", saveRes.data);
        navigate("/graph", { state: dataReady });
      } else {
        console.warn("⚠️ No HRV data received");
        alert("Session complete, but no HRV data received.");
      }
    } catch (err) {
      console.error("❌ Error saving session:", err);
      alert("Something went wrong while saving the session.");
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

        {isProcessing && (
          <div className="processing-box mt-4">
            <p>Processing your HRV session... ⏳</p>
          </div>
        )}

        {timeLeft === 0 && !dataReady && (
          <p className="processing-box mt-2">Finalizing your HRV data... 🧠</p>
        )}

        <div className="pulse-animation"></div>
      </div>
    </div>
  );
};

export default Session;

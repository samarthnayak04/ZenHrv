import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import meditationAudio from "/hrv audio.mp3";
import axios from "axios";
import "../styles/session.css";

const Session = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const durationMinutes = location.state?.duration || 1;
  const totalSeconds = durationMinutes * 60;

  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [frameBuffer, setFrameBuffer] = useState([]);
  const [sessionData, setSessionData] = useState({
    rmssdValues: [],
    sdnnValues: [],
    conditions: [],
  });
  const [isProcessing, setIsProcessing] = useState(true);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [audio] = useState(new Audio(meditationAudio));

  // Capture 1 frame
  const captureFrame = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.drawImage(videoRef.current, 150, 100, 340, 300, 0, 0, 340, 300);
    const pixels = ctx.getImageData(0, 0, 340, 300).data;
    const rgbFrame = [];
    for (let i = 0; i < pixels.length; i += 4) {
      rgbFrame.push([pixels[i], pixels[i + 1], pixels[i + 2]]);
    }
    return rgbFrame;
  };

  // Send 30s worth of frames
  const sendBatch = async () => {
    if (frameBuffer.length === 0) return;
    const allFrames = frameBuffer.flat();
    try {
      const res = await axios.post("/api/session/process", allFrames, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const { rmssdValues, sdnnValues, conditions } = res.data;
      setSessionData((prev) => ({
        rmssdValues: [...prev.rmssdValues, ...rmssdValues],
        sdnnValues: [...prev.sdnnValues, ...sdnnValues],
        conditions: [...prev.conditions, ...conditions],
      }));
    } catch (err) {
      console.error("❌ Error sending batch:", err);
    } finally {
      setFrameBuffer([]); // Clear buffer
    }
  };

  // Main session loop
  useEffect(() => {
    audio.loop = true;
    audio.play().catch(() => console.warn("Autoplay blocked"));

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((err) => console.error("Camera access error:", err));

    let secondCounter = 0;

    const frameInterval = setInterval(() => {
      const frame = captureFrame();
      setFrameBuffer((prev) => [...prev, frame]);
    }, 1000 / 25); // ~25 FPS

    const timerInterval = setInterval(() => {
      secondCounter += 1;
      setTimeLeft((prev) => prev - 1);

      if (secondCounter % 30 === 0) {
        sendBatch(); // Send every 30s
      }

      if (secondCounter >= totalSeconds) {
        clearInterval(timerInterval);
        clearInterval(frameInterval);
        sendBatch().then(() => handleSessionComplete());
        audio.pause();
        audio.currentTime = 0;
        if (videoRef.current?.srcObject) {
          videoRef.current.srcObject
            .getTracks()
            .forEach((track) => track.stop());
        }
      }
    }, 1000);

    return () => {
      clearInterval(frameInterval);
      clearInterval(timerInterval);
    };
  }, []);

  const handleSessionComplete = async () => {
    try {
      const res = await axios.post(
        "/api/session/save",
        {
          duration: durationMinutes,
          ...sessionData,
        },
        { withCredentials: true }
      );
      console.log("✅ Session saved:", res.data);
      navigate("/graph", { state: sessionData });
    } catch (err) {
      console.error("❌ Save error:", err);
      alert("Session complete, but save failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="session-wrapper">
      <div className="session-box">
        <h2>🧘 Meditation in Progress</h2>
        <p className="timer">
          {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
          {String(timeLeft % 60).padStart(2, "0")}
        </p>
        <p>Relax and let your mind settle...</p>
        {isProcessing && (
          <div className="processing-box mt-4">Processing your HRV... ⏳</div>
        )}
        <div className="camera-preview">
          <video ref={videoRef} autoPlay muted playsInline />
        </div>
        <canvas
          ref={canvasRef}
          width="340"
          height="300"
          style={{ display: "none" }}
        ></canvas>
        <div className="pulse-animation"></div>
      </div>
    </div>
  );
};

export default Session;

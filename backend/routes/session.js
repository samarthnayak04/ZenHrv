const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const jwt = require("jsonwebtoken");
const path = require("path");
const { spawn } = require("child_process");

require("dotenv").config();

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// POST /api/session → save HRV session
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { duration, rmssdValues, sdnnValues, conditions } = req.body;

    const newSession = new Session({
      userId: req.user.id,
      duration,
      rmssdValues,
      sdnnValues,
      conditions,
    });

    await newSession.save();
    res.status(201).json({ message: "Session saved successfully" });
  } catch (err) {
    console.error("Error saving session:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/process", authenticateToken, async (req, res) => {
  const { duration } = req.body;

  if (!duration) {
    return res.status(400).json({ error: "Duration required" });
  }

  const pythonScriptPath = path.join(__dirname, "../scripts/hrv.py");

  const pythonProcess = spawn("python", [pythonScriptPath, duration]);

  let dataBuffer = "";
  let errorBuffer = "";

  pythonProcess.stdout.on("data", (data) => {
    dataBuffer += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    errorBuffer += data.toString();
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      console.error("Python script error:", errorBuffer);
      return res.status(500).json({ error: "Python script failed" });
    }

    try {
      const parsed = JSON.parse(dataBuffer); // data from Python must be JSON string
      res.json(parsed);
    } catch (err) {
      console.error("Failed to parse Python output:", err);
      res.status(500).json({ error: "Invalid script output" });
    }
  });
});

module.exports = router;

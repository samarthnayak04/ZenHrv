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
// router.post("/test", (req, res) => {
//   console.log(">> Body in /test route:", req.body);
//   res.json({ received: req.body });
// });

router.post("/process", authenticateToken, async (req, res) => {
  const { duration } = req.body;
  console.log("req.body received:", req.body);
  if (!duration) {
    return res.status(400).json({ error: "Duration required" });
  }

  const pythonScriptPath = path.join(__dirname, "../scripts/hrv.py");
  console.log("Running script:", pythonScriptPath, "with duration:", duration);

  const pythonProcess = spawn("python", [
    pythonScriptPath,
    duration.toString(),
  ]);

  let dataBuffer = "";
  let errorBuffer = "";

  pythonProcess.stdout.on("data", (data) => {
    dataBuffer += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error("PYTHON STDERR:", data.toString());
    errorBuffer += data.toString();
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      console.error("Python script error:", errorBuffer);
      return res.status(500).json({ error: "Python script failed" });
    }

    try {
      const parsed = JSON.parse(dataBuffer);
      // console.log("✅ Python output parsed:", parsed);
      res.json(parsed);
    } catch (err) {
      console.error("Failed to parse Python output:", err);
      res.status(500).json({ error: "Invalid script output" });
    }
  });
});

// router.get("/result", authenticateToken, (req, res) => {
//   if (!sessionData) return res.status(202).json({ message: "Processing..." });

//   const result = sessionData;
//   sessionData = null; // reset for next session
//   res.json(result);
// });

// ✅ Save to MongoDB
router.post("/save", authenticateToken, async (req, res) => {
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

module.exports = router;

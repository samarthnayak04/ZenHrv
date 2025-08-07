const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const path = require("path");
const { spawn } = require("child_process");
const Session = require("../models/Session");

function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

router.post("/process", authenticateToken, async (req, res) => {
  const pythonScript = path.join(__dirname, "../scripts/hrv.py");
  const py = spawn("python", [pythonScript]);

  let output = "";
  let errors = "";

  py.stdin.write(JSON.stringify(req.body));
  py.stdin.end();

  py.stdout.on("data", (data) => {
    output += data.toString();
  });

  py.stderr.on("data", (data) => {
    errors += data.toString();
  });

  py.on("close", (code) => {
    if (code !== 0) {
      console.error("❌ Python Error:", errors);
      return res.status(500).json({ error: "Python script failed" });
    }
    try {
      const result = JSON.parse(output);
      res.json(result);
    } catch (err) {
      console.error("❌ JSON Parse Error:", err);
      res.status(500).json({ error: "Invalid output" });
    }
  });
});

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
    res.status(201).json({ message: "Session saved" });
  } catch (err) {
    console.error("❌ DB Error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const jwt = require("jsonwebtoken");
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
    const { duration, rmssdValues, sdnnValues, conditions, actualCondition } =
      req.body;

    const newSession = new Session({
      userId: req.user.id,
      duration,
      rmssdValues,
      sdnnValues,
      conditions,
      actualCondition,
    });

    await newSession.save();
    res.status(201).json({ message: "Session saved successfully" });
  } catch (err) {
    console.error("Error saving session:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

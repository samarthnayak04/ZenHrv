const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET /api/users — list all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting users", error: error.message });
  }
});

module.exports = router;

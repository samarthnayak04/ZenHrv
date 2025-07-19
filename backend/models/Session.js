const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  duration: { type: Number, required: true }, // in seconds
  rmssdValues: [Number],
  sdnnValues: [Number],
  conditions: [Number], // predicted conditions (e.g., ["calm", "stressed"])

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Session", sessionSchema);

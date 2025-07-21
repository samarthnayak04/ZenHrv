const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const sessionRoutes = require("./routes/session");
const userroute = require("./routes/getuser");
const cookieParser = require("cookie-parser");
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send();
});

app.use("/api/auth", authRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api", userroute);
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

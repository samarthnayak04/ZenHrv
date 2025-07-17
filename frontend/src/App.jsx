import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterOptions from "./components/RegisterOptions";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import Graph from "./components/Graph";
import Session from "./components/Session";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<RegisterOptions />} />
        <Route path="/login" element={<Login />} />
        <Route path="/session" element={<Session />} />
        <Route path="/graph" element={<Graph />} />
      </Routes>
    </Router>
  );
}

export default App;

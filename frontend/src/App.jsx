import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Signup from "./components/pages/Signup";
import Login from "./components/pages/Login";
import Home from "./components/pages/Home";
import Graph from "./components/pages/Graph";
import Session from "./components/pages/Session";
import Dashboard from "./components/pages/Dashboard";
import RegisterOptions from "./components/pages/RegisterOptions";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<RegisterOptions />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/session" element={<Session />} />
        <Route path="/graph" element={<Graph />} />
      </Routes>
    </Router>
  );
}

export default App;

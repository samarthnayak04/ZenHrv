import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container text-center mt-5">
      <h1 className="display-4">Welcome to MindTrack</h1>
      <p className="lead">Your personal HRV-based meditation assistant</p>
      <Link to="/signup" className="btn btn-primary m-2">
        Sign Up
      </Link>
      <Link to="/login" className="btn btn-outline-primary m-2">
        Login
      </Link>
    </div>
  );
}

// src/components/RegisterOptions.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/RegisterOptions.css";

function RegisterOptions() {
  const navigate = useNavigate();

  return (
    <div className="reg-container">
      <div className="register-options-container d-flex flex-column justify-content-center align-items-center">
        <h2 className="text-center mb-5">Let's Get Started</h2>
        <button
          className="btn btn-primary btn-lg rounded-pill mb-3 w-75"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="btn btn-outline-primary btn-lg rounded-pill w-75"
          onClick={() => navigate("/signup")}
        >
          Signup
        </button>
      </div>
    </div>
  );
}

export default RegisterOptions;

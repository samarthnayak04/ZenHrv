import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/Home.css";
import Image from "/applogo.avif";

function Home() {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/register");
  };

  return (
    <div className="home-container">
      <div className="home-card shadow-lg rounded-4 text-center">
        <img src={Image} alt="Meditation" className="home-img mb-4" />
        <h2 className="fw-bold">WELCOME</h2>
        <p className="text-muted">
          Meditation is the key to <br /> unlocking the door to peace
        </p>
        <button
          className="btn btn-primary btn-lg mt-4 rounded-pill px-5 next-button"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Home;

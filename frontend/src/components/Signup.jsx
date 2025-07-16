import { useState } from "react";
import axios from "axios";

function Signup() {
  const [user, setUser] = useState({ name: "", email: "", password: "" });

  const handleSignup = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        user,
        {
          withCredentials: true,
        }
      );
      alert("Signed up!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            onChange={handleChange}
          />
        </div>
        <button className="btn btn-primary">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;

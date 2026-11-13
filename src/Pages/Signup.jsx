import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function Signup() {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const name = formData.get("name").trim();
    const email = formData.get("email").trim().toLowerCase();
    const password = formData.get("password");

    const existingUser = JSON.parse(
      localStorage.getItem("registeredUser") || "null"
    );

    if (existingUser && existingUser.email === email) {
      alert("Account already exists! Please Login.");
      navigate("/login");
      return;
    }

    const newUser = { name, email, password };

    localStorage.setItem("registeredUser", JSON.stringify(newUser));
    localStorage.setItem("loggedInUser", email);
    localStorage.setItem("loggedInUserName", name);

    alert("Account created successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <Link to="/" className="auth-logo">
          ✈️ TravelSphereAI
        </Link>

        <div className="auth-icon">🧳</div>

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Start planning your next adventure!
        </p>

        <form className="auth-form" onSubmit={handleSignup}>

          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            required
          />

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            minLength="6"
            required
          />

          <button type="submit">Create Account</button>

        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>

        <Link to="/" className="auth-back">
          ← Back to Home
        </Link>

      </div>
    </div>
  );
}

export default Signup;
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      alert("Please fill in all fields!");
      return;
    }

    const registeredUser = JSON.parse(
      localStorage.getItem("registeredUser") || "null"
    );

    if (!registeredUser) {
      alert("Account not found! Please Sign Up first.");
      return;
    }

    if (email !== registeredUser.email) {
      alert("Account not found! Please Sign Up first.");
      return;
    }

    if (password !== registeredUser.password) {
      alert("Incorrect password! Please try again.");
      return;
    }

    localStorage.setItem("loggedInUser", email);
    localStorage.setItem("loggedInUserName", registeredUser.name);

    alert("Login successful!");
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          ✈️ TravelSphereAI
        </Link>

        <div className="auth-icon">🌍</div>
        <h1>Welcome Back!</h1>
        <p className="auth-subtitle">
          Sign in to continue your travel journey.
        </p>

        <form className="auth-form" onSubmit={handleLogin}>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            required
          />

          <button type="submit">Login</button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>

        <Link to="/" className="auth-back">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Login;
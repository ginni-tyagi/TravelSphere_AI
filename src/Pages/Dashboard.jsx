import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="dash-sidebar">
        <h2>✈️ TravelSphereAI</h2>

        <nav>
          <Link to="/dashboard" className="active">🏠 Dashboard</Link>
          <Link to="/planner">🧭 Plan a Trip</Link>
          <Link to="/my-trips">🧳 My Trips</Link>
          <Link to="/expenses">💰 Expense Tracker</Link>
          <Link to="/saved-places">❤️ Saved Places</Link>
          <Link to="/profile">👤 My Profile</Link>

        </nav>

        <Link to="/" className="dash-logout">
          ↩ Logout
        </Link>
      </aside>

      {/* Main Content */}
      <main className="dash-main">

        <header className="dash-header">
          <div>
            <h1>Welcome, Traveller! 👋</h1>
            <p>Ready for your next adventure?</p>
          </div>
         <Link to="/profile" className="dash-avatar">
  {JSON.parse(localStorage.getItem("userProfile") || "{}").picture ? (
    <img
      src={JSON.parse(localStorage.getItem("userProfile")).picture}
      alt="Profile"
    />
  ) : (
    "👤"
  )}
</Link>
        </header>

        {/* Create Trip */}
        <section className="dash-banner">
          <div>
            <h2>Your next journey starts here!</h2>
            <p>Discover new destinations and plan amazing trips.</p>
            <Link to="/planner" className="dash-create-btn">
              ✨ Create New Trip
            </Link>
          </div>
          <span>🌍</span>
        </section>

        {/* Statistics */}
        <section className="dash-stats">

          <div className="dash-stat-card">
            <span>🧳</span>
            <h3>0</h3>
            <p>Total Trips</p>
          </div>

          <div className="dash-stat-card">
            <span>📍</span>
            <h3>0</h3>
            <p>Places Visited</p>
          </div>

          <div className="dash-stat-card">
            <span>💰</span>
            <h3>₹0</h3>
            <p>Total Expenses</p>
          </div>

        </section>

        {/* Recent Trips */}
        <section className="dash-trips">
          <div className="dash-section-heading">
            <h2>My Recent Trips</h2>
            <Link to="/planner">+ Add Trip</Link>
          </div>

          <div className="dash-empty">
            <span>✈️</span>
            <h3>No trips planned yet!</h3>
            <p>Your travel adventures will appear here.</p>
            <Link to="/planner">Start Planning</Link>
          </div>
        </section>

      </main>
    </div>
  );
}

export default Dashboard;
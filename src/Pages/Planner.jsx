import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Planner.css";

function Planner() {
  const [trip, setTrip] = useState(null);

  const handleGenerateTrip = (e) => {
    e.preventDefault();

    const destination = e.target.destination.value;
    const days = Number(e.target.days.value);
    const budget = Number(e.target.budget.value);
    const travelers = Number(e.target.travelers.value);
    const travelStyle = e.target.travelStyle.value;

    if (days < 1 || budget < 1 || travelers < 1) {
      alert("Please enter valid trip details!");
      return;
    }

    const activities = {
      Adventure: [
        "Explore adventure activities and outdoor sports.",
        "Visit famous attractions and enjoy local adventures.",
        "Discover nature and enjoy an exciting experience."
      ],
      Relaxation: [
        "Enjoy a peaceful morning and explore beautiful places.",
        "Visit relaxing spots and enjoy local food.",
        "Spend time exploring nature and relaxing."
      ],
      Family: [
        "Visit popular family attractions.",
        "Explore local markets and enjoy family activities.",
        "Discover famous places and enjoy local food."
      ],
      Budget: [
        "Explore affordable tourist attractions.",
        "Visit local markets and try budget-friendly food.",
        "Enjoy nearby sightseeing and free activities."
      ],
      default: [
        "Explore popular tourist attractions.",
        "Discover local culture and enjoy local food.",
        "Visit famous places and enjoy sightseeing."
      ]
    };

    const selectedActivities =
      activities[travelStyle] || activities.default;

    const itinerary = Array.from({ length: days }, (_, index) => ({
      day: index + 1,
      activity: selectedActivities[index % selectedActivities.length]
    }));

    const newTrip = {
      id: Date.now(),
      destination,
      days,
      budget,
      travelers,
      travelStyle,
      itinerary
    };

    const savedTrips = JSON.parse(
      localStorage.getItem("myTrips") || "[]"
    );

    savedTrips.push(newTrip);

    localStorage.setItem("myTrips", JSON.stringify(savedTrips));

    setTrip(newTrip);

    alert("Your trip has been generated and saved!");
  };

  return (
    <div className="planner-page">

      <nav className="planner-navbar">
        <Link to="/dashboard" className="planner-logo">
          ✈️ TravelSphereAI
        </Link>

        <Link to="/dashboard" className="back-home">
          ← Dashboard
        </Link>
      </nav>

      <div className="planner-container">

        <div className="planner-heading">
          <span className="planner-icon">🧭</span>
          <h1>Plan Your Dream Trip</h1>
          <p>Enter your preferences and create your next adventure.</p>
        </div>

        <form className="planner-form" onSubmit={handleGenerateTrip}>

          <div className="form-group">
            <label>Destination</label>
            <input
              type="text"
              name="destination"
              placeholder="Enter destination"
              required
            />
          </div>

          <div className="form-group">
            <label>Number of Days</label>
            <input
              type="number"
              name="days"
              min="1"
              max="30"
              placeholder="e.g. 5"
              required
            />
          </div>

          <div className="form-group">
            <label>Total Budget (₹)</label>
            <input
              type="number"
              name="budget"
              min="1"
              placeholder="Enter your budget"
              required
            />
          </div>

          <div className="form-group">
            <label>Number of Travelers</label>
            <input
              type="number"
              name="travelers"
              min="1"
              placeholder="e.g. 2"
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Travel Style</label>
            <select name="travelStyle" required>
              <option value="">Select Travel Style</option>
              <option value="Adventure">Adventure</option>
              <option value="Relaxation">Relaxation</option>
              <option value="Family">Family</option>
              <option value="Budget">Budget</option>
              <option value="General">General</option>
            </select>
          </div>

          <div className="full-width">
            <button type="submit" className="generate-btn">
              ✨ Generate My Trip
            </button>
          </div>

        </form>

        <div className="planner-note">
          💜 Your next adventure is just one click away!
        </div>

        {trip && (
          <div className="trip-results">

            <h2>✨ Your Trip to {trip.destination}</h2>

            <p>📅 Duration: {trip.days} days</p>
            <p>💰 Total Budget: ₹{trip.budget.toLocaleString("en-IN")}</p>
            <p>👥 Travelers: {trip.travelers}</p>
            <p>🎯 Travel Style: {trip.travelStyle}</p>

            <h3>Your Itinerary</h3>

            {trip.itinerary.map((item) => (
              <div className="itinerary-card" key={item.day}>
                <h4>Day {item.day}</h4>
                <p>{item.activity}</p>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default Planner;
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./MyTrips.css";

function MyTrips() {
  const [trips, setTrips] = useState(
    JSON.parse(localStorage.getItem("myTrips") || "[]")
  );

  const deleteTrip = (id) => {
    const updatedTrips = trips.filter((trip) => trip.id !== id);
    setTrips(updatedTrips);
    localStorage.setItem("myTrips", JSON.stringify(updatedTrips));
  };

  return (
    <div className="my-trips">
      <h1>✈️ My Trips</h1>
      <Link to="/dashboard">← Back to Dashboard</Link>

      {trips.length === 0 ? (
        <p>No trips saved yet. Start planning your next adventure!</p>
      ) : (
        trips.map((trip) => (
          <div className="trip-card" key={trip.id}>
            <h2>🌍 {trip.destination}</h2>
            <p>📅 Duration: {trip.days} days</p>
            <p>💰 Budget: ₹{trip.budget.toLocaleString("en-IN")}</p>
            <p>👥 Travelers: {trip.travelers}</p>
            <p>🎯 Style: {trip.travelStyle}</p>

            <div className="trip-actions">
  <Link to={`/trip-details/${trip.id}`}>
    View Details
  </Link>

  <Link to={`/edit-trip/${trip.id}`}>
    Edit Trip
  </Link>

  <button onClick={() => deleteTrip(trip.id)}>
    Delete Trip
  </button>
</div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyTrips;
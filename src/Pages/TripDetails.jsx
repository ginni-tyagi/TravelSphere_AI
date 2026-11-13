import React from "react";
import { Link, useParams } from "react-router-dom";
import "./TripDetails.css";

function TripDetails() {
  const { id } = useParams();

  const trips = JSON.parse(localStorage.getItem("myTrips") || "[]");
  const trip = trips.find((item) => item.id === Number(id));

  if (!trip) {
    return (
      <div className="trip-details">
        <h2>Trip Not Found!</h2>
        <Link to="/my-trips">Back to My Trips</Link>
      </div>
    );
  }

  return (
    <div className="trip-details">
      <Link to="/my-trips">← Back to My Trips</Link>
      
      <Link to="/dashboard" className="back-dashboard">
  ← Back to Dashboard
</Link>

      <h1>🌍 Trip to {trip.destination}</h1>

  <div className="details-card">
  <p>📅 Duration: {trip.days} Days</p>
  <p>💰 Total Budget: ₹{trip.budget.toLocaleString("en-IN")}</p>
  <p>👥 Travelers: {trip.travelers}</p>
  <p>🎯 Travel Style: {trip.travelStyle}</p>
  <p>🗓️ Created: {trip.createdAt}</p>

  <hr />

  <h3>💰 Budget Breakdown</h3>
  <p>Per Person: ₹{(trip.budget / trip.travelers).toFixed(2)}</p>
  <p>Per Day: ₹{(trip.budget / trip.days).toFixed(2)}</p>
  <p>
    Per Person Per Day: ₹
    {(trip.budget / (trip.travelers * trip.days)).toFixed(2)}
  </p>
</div>

      <h2>✨ Your Day-wise Itinerary</h2>

      {trip.itinerary.map((item) => (
        <div className="itinerary-card" key={item.day}>
          <h3>Day {item.day}</h3>
          <p>{item.activity}</p>
        </div>
      ))}
    </div>
  );
}

export default TripDetails;
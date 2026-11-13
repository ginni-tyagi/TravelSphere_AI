import React from "react";
import { Link, useParams } from "react-router-dom";
import "./TripDetails.css";

function TripDetails() {
  const { id } = useParams();

  const trips = JSON.parse(localStorage.getItem("myTrips") || "[]");
  const trip = trips.find((item) => String(item.id) === id);

  if (!trip) {
    return (
      <div className="trip-details">
        <h2>Trip Not Found!</h2>
        <Link to="/my-trips">Back to My Trips</Link>
      </div>
    );
  }

  // Support both old and new itinerary formats
  const itinerary = Array.isArray(trip.itinerary)
    ? trip.itinerary
    : Array.isArray(trip.itinerary?.days)
    ? trip.itinerary.days
    : [];

  return (
    <div className="trip-details">

      <div className="trip-navigation">
        <Link to="/my-trips">← Back to My Trips</Link>
        <Link to="/dashboard">← Back to Dashboard</Link>
      </div>

      <h1>🌍 Trip to {trip.destination}</h1>

      <div className="details-card">
        <h2>📋 Trip Information</h2>

        <p>📅 Duration: {trip.days} Days</p>
        <p>💰 Total Budget: ₹{Number(trip.budget).toLocaleString("en-IN")}</p>
        <p>👥 Travelers: {trip.travelers}</p>
        <p>🎯 Travel Style: {trip.travelStyle}</p>
        <p>🗓️ Created: {trip.createdAt || "Not available"}</p>

        <hr />

        <h3>💰 Budget Breakdown</h3>

        <p>Per Person: ₹{(Number(trip.budget) / Number(trip.travelers)).toFixed(2)}</p>
        <p>Per Day: ₹{(Number(trip.budget) / Number(trip.days)).toFixed(2)}</p>
        <p>
          Per Person Per Day: ₹
          {(Number(trip.budget) / (Number(trip.travelers) * Number(trip.days))).toFixed(2)}
        </p>
      </div>

      <h2 className="itinerary-heading">✨ Your Day-wise Itinerary</h2>

      {itinerary.length === 0 ? (
        <p>No itinerary available.</p>
      ) : (
        itinerary.map((item, index) => (
          <div className="itinerary-card" key={item.day || index}>

            <h3>
              Day {item.day || index + 1}: {item.title || "Your Activities"}
            </h3>

            {item.places && (
              <p>📍 Places: {Array.isArray(item.places) ? item.places.join(", ") : item.places}</p>
            )}

            {item.activities && (
              <p>🎯 Activities: {Array.isArray(item.activities) ? item.activities.join(", ") : item.activities}</p>
            )}

            {item.food && (
              <p>🍽️ Food: {Array.isArray(item.food) ? item.food.join(", ") : item.food}</p>
            )}

            {item.estimatedExpense && (
              <p>💰 Estimated Expense: {item.estimatedExpense}</p>
            )}

            {item.tip && (
              <p>💡 Tip: {item.tip}</p>
            )}

            {item.activity && (
              <p>{item.activity}</p>
            )}

          </div>
        ))
      )}

    </div>
  );
}

export default TripDetails;
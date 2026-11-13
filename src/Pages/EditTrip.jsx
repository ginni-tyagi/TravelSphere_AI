import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();

  const trips = JSON.parse(localStorage.getItem("myTrips") || "[]");
  const trip = trips.find((item) => item.id === Number(id));

  const [destination, setDestination] = useState(trip?.destination || "");
  const [days, setDays] = useState(trip?.days || 1);
  const [budget, setBudget] = useState(trip?.budget || 1);
  const [travelers, setTravelers] = useState(trip?.travelers || 1);
  const [travelStyle, setTravelStyle] = useState(trip?.travelStyle || "");

  if (!trip) {
    return (
      <div>
        <h2>Trip Not Found!</h2>
        <Link to="/my-trips">Back to My Trips</Link>
      </div>
    );
  }

  const handleUpdate = (e) => {
    e.preventDefault();

   const updatedDays = Number(days);

const itinerary = Array.from({ length: updatedDays }, (_, index) => ({
  day: index + 1,
  activity:
    travelStyle === "adventure"
      ? "Explore adventure activities and scenic viewpoints"
      : travelStyle === "relaxation"
      ? "Enjoy peaceful surroundings and relaxing experiences"
      : travelStyle === "culture"
      ? "Explore local culture and famous landmarks"
      : "Discover local food markets and shopping spots",
}));

const updatedTrip = {
  ...trip,
  destination,
  days: updatedDays,
  budget: Number(budget),
  travelers: Number(travelers),
  travelStyle,
  itinerary,
};

    const updatedTrips = trips.map((item) =>
      item.id === Number(id) ? updatedTrip : item
    );

    localStorage.setItem("myTrips", JSON.stringify(updatedTrips));

    alert("Trip updated successfully!");
    navigate("/my-trips");
  };

  return (
    <div className="my-trips">
  <Link to="/dashboard" className="back-dashboard">
    ← Back to Dashboard
  </Link>

  <h1>✏️ Edit Your Trip</h1>

      <form onSubmit={handleUpdate}>
        <p>Destination</p>
        <input value={destination} onChange={(e) => setDestination(e.target.value)} required />

        <p>Number of Days</p>
        <input type="number" min="1" value={days} onChange={(e) => setDays(e.target.value)} required />

        <p>Budget (₹)</p>
        <input type="number" min="1" value={budget} onChange={(e) => setBudget(e.target.value)} required />

        <p>Travelers</p>
        <input type="number" min="1" value={travelers} onChange={(e) => setTravelers(e.target.value)} required />

        <p>Travel Style</p>
        <select value={travelStyle} onChange={(e) => setTravelStyle(e.target.value)} required>
          <option value="adventure">Adventure</option>
          <option value="relaxation">Relaxation</option>
          <option value="culture">Culture & Heritage</option>
          <option value="food">Food & Shopping</option>
        </select>

        <br /><br />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditTrip;
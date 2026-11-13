import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./EditTrip.css";

function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();

  const trips = JSON.parse(localStorage.getItem("myTrips") || "[]");
  const trip = trips.find((item) => String(item.id) === id);

  const [destination, setDestination] = useState(trip?.destination || "");
  const [days, setDays] = useState(trip?.days || 1);
  const [budget, setBudget] = useState(trip?.budget || 1);
  const [travelers, setTravelers] = useState(trip?.travelers || 1);
  const [travelStyle, setTravelStyle] = useState(trip?.travelStyle || "");
  const [loading, setLoading] = useState(false);

  if (!trip) {
    return (
      <div className="edit-trip-page">
        <h2>Trip Not Found!</h2>
        <Link to="/my-trips">Back to My Trips</Link>
      </div>
    );
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "https://travelsphereai-backend.onrender.com/api/generate-trip",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            destination,
            days: Number(days),
            budget: Number(budget),
            travelers: Number(travelers),
            travelStyle,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update trip.");
      }

      const updatedTrip = {
        ...trip,
        destination,
        days: Number(days),
        budget: Number(budget),
        travelers: Number(travelers),
        travelStyle,
        itinerary: data.itinerary,
      };

      const updatedTrips = trips.map((item) =>
        String(item.id) === id ? updatedTrip : item
      );

      localStorage.setItem("myTrips", JSON.stringify(updatedTrips));

      alert("Trip and itinerary updated successfully!");
      navigate("/my-trips");

    } catch (error) {
      alert(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-trip-page">

      <Link to="/dashboard" className="edit-back">
        ← Back to Dashboard
      </Link>

      <div className="edit-trip-card">

        <h1>✏️ Edit Your Trip</h1>
        <p>Update your travel details below.</p>

        <form onSubmit={handleUpdate}>

          <label>Destination</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />

          <label>Number of Days</label>
          <input
            type="number"
            min="1"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            required
          />

          <label>Budget (₹)</label>
          <input
            type="number"
            min="1"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />

          <label>Travelers</label>
          <input
            type="number"
            min="1"
            value={travelers}
            onChange={(e) => setTravelers(e.target.value)}
            required
          />

          <label>Travel Style</label>
          <select
            value={travelStyle}
            onChange={(e) => setTravelStyle(e.target.value)}
            required
          >
            <option value="adventure">Adventure</option>
            <option value="relaxation">Relaxation</option>
            <option value="culture">Culture & Heritage</option>
            <option value="food">Food & Shopping</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Generating Updated Itinerary..." : "Save Changes"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default EditTrip;
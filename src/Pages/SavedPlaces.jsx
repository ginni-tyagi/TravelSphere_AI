import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SavedPlaces.css";

function SavedPlaces() {
  const [places, setPlaces] = useState(
    JSON.parse(localStorage.getItem("savedPlaces") || "[]")
  );

  const [place, setPlace] = useState("");

  const addPlace = (e) => {
    e.preventDefault();

    if (places.includes(place.trim())) {
      alert("Place already saved!");
      return;
    }

    const updated = [...places, place.trim()];
    setPlaces(updated);
    localStorage.setItem("savedPlaces", JSON.stringify(updated));
    setPlace("");
  };

  const removePlace = (name) => {
    const updated = places.filter((item) => item !== name);
    setPlaces(updated);
    localStorage.setItem("savedPlaces", JSON.stringify(updated));
  };

  return (
    <div className="saved-places">

  <Link to="/dashboard" className="back-dashboard">
    ← Back to Dashboard
  </Link>

  <h1>❤️ Favourite Places</h1>
      <form onSubmit={addPlace}>
        <input
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          placeholder="Enter destination"
          required
        />
        <button type="submit">Save Place</button>
      </form>

      {places.length === 0 ? (
        <p>No favourite places saved yet!</p>
      ) : (
        places.map((item) => (
          <div className="place-card" key={item}>
            <h3>📍 {item}</h3>
            <button onClick={() => removePlace(item)}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default SavedPlaces;
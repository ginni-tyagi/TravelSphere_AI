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

    const name = place.trim();

    if (!name) return;

    const alreadySaved = places.some((item) =>
      typeof item === "string"
        ? item.toLowerCase() === name.toLowerCase()
        : item.name?.toLowerCase() === name.toLowerCase()
    );

    if (alreadySaved) {
      alert("Place already saved!");
      return;
    }

    const updated = [...places, name];

    setPlaces(updated);
    localStorage.setItem("savedPlaces", JSON.stringify(updated));
    setPlace("");
  };

  const removePlace = (id) => {
    const updated = places.filter((item, index) => {
      const itemId = typeof item === "string" ? item : item.id;
      return (itemId || index) !== id;
    });

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
        <div className="saved-places-list">

          {places.map((item, index) => {
            const isObject = typeof item === "object";
            const name = isObject ? item.name : item;
            const address = isObject ? item.address : "";
            const mapsUrl = isObject ? item.mapsUrl : "";

            return (
              <div
                className="place-card"
                key={isObject ? item.id || index : item}
              >

                <h3>📍 {name}</h3>

                {address && <p>{address}</p>}

                {mapsUrl && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View on Google Maps ↗
                  </a>
                )}

                <button
                  onClick={() =>
                    removePlace(isObject ? item.id || index : item)
                  }
                >
                  🗑️ Remove
                </button>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default SavedPlaces;

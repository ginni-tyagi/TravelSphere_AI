import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NearbyPlaces.css";

function NearbyPlaces() {
  const [destination, setDestination] = useState("");
  const [category, setCategory] = useState("attractions");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [savedPlaces, setSavedPlaces] = useState(
    JSON.parse(localStorage.getItem("savedPlaces") || "[]")
  );

  useEffect(() => {
    const trips = JSON.parse(localStorage.getItem("myTrips") || "[]");

    if (trips.length > 0) {
      setDestination(trips[trips.length - 1].destination);
    }
  }, []);

  const searchPlaces = async (e) => {
    e.preventDefault();

    if (!destination.trim()) {
      setError("Please enter a destination.");
      return;
    }

    setLoading(true);
    setError("");
    setPlaces([]);

    try {
      const response = await fetch(
        `https://travelsphereai-backend.onrender.com/api/nearby-places?destination=${encodeURIComponent(destination)}&category=${category}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to find places.");
      }

      setPlaces(data.places || []);

      if (!data.places?.length) {
        setError("No places found. Try another destination or category.");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const savePlace = (place) => {
    const alreadySaved = savedPlaces.some((item) =>
      typeof item === "string"
        ? item.toLowerCase() === place.name.toLowerCase()
        : item.id === place.id
    );

    if (alreadySaved) {
      alert("Place already saved!");
      return;
    }

    const newPlace = {
      ...place,
      destination,
      id: place.id || `${place.name}-${destination}`
    };

    const updated = [...savedPlaces, newPlace];

    setSavedPlaces(updated);
    localStorage.setItem("savedPlaces", JSON.stringify(updated));
  };

  const isSaved = (place) => {
    return savedPlaces.some((item) =>
      typeof item === "string"
        ? item.toLowerCase() === place.name.toLowerCase()
        : item.id === place.id ||
          (item.name === place.name && item.destination === destination)
    );
  };

  return (
    <div className="nearby-page">

      <nav className="nearby-navbar">
        <Link to="/dashboard" className="nearby-logo">
          ✈️ TravelSphereAI
        </Link>

        <Link to="/dashboard" className="nearby-back">
          ← Dashboard
        </Link>
      </nav>

      <div className="nearby-container">

        <div className="nearby-heading">
          <span>📍</span>
          <h1>Explore Nearby Places</h1>
          <p>Discover amazing places around your destination.</p>

          <Link to="/saved-places">
            ❤️ View Saved Places
          </Link>
        </div>

        <form className="nearby-search" onSubmit={searchPlaces}>

          <label>Enter Your Destination</label>

          <input
            type="text"
            placeholder="e.g. Manali, Goa, Jaipur"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          <label>Choose Category</label>

          <div className="nearby-categories">

            {[
              ["attractions", "🏔️ Attractions"],
              ["restaurants", "🍽️ Restaurants"],
              ["hotels", "🏨 Hotels"],
              ["shopping", "🛍️ Shopping"]
            ].map(([value, label]) => (
              <button
                type="button"
                key={value}
                className={category === value ? "active-category" : ""}
                onClick={() => setCategory(value)}
              >
                {label}
              </button>
            ))}

          </div>

          <button
            type="submit"
            className="nearby-search-btn"
            disabled={loading}
          >
            {loading ? "Searching..." : "🔍 Find Places"}
          </button>

        </form>

        {error && <p className="nearby-error">{error}</p>}

        {places.length > 0 && (
          <div className="nearby-results">

            <h2>Places in {destination}</h2>

            <div className="nearby-grid">

              {places.map((place, index) => (
                <div className="place-card" key={place.id || index}>

                  {place.image ? (
                    <img src={place.image} alt={place.name} />
                  ) : (
                    <div className="place-image-placeholder">
                      📍
                    </div>
                  )}

                  <div className="place-info">

                    <h3>{place.name}</h3>

                    <p>
                      {place.description || place.address || "Location information unavailable"}
                    </p>

                    {place.rating && (
                      <p>⭐ {place.rating}</p>
                    )}

                    {place.mapsUrl && (
                      <a
                        href={place.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View on Google Maps ↗
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => savePlace(place)}
                      disabled={isSaved(place)}
                      className="save-place-btn"
                    >
                      {isSaved(place) ? "✓ Saved" : "❤️ Save Place"}
                    </button>

                  </div>

                </div>
              ))}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default NearbyPlaces;
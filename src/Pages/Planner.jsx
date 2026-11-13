import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Planner.css";

function getWeatherDescription(code) {
  if (code === 0) return "Clear Sky ☀️";
  if ([1, 2, 3].includes(code)) return "Partly Cloudy 🌤️";
  if ([45, 48].includes(code)) return "Foggy 🌫️";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle 🌦️";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code))
    return "Rainy 🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(code))
    return "Snowy ❄️";
  if ([95, 96, 99].includes(code)) return "Thunderstorm ⛈️";
  return "Weather Information";
}

function Planner() {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const handleGenerateTrip = async (e) => {
    e.preventDefault();

    const destination = e.target.destination.value.trim();
    const days = Number(e.target.days.value);
    const budget = Number(e.target.budget.value);
    const travelers = Number(e.target.travelers.value);
    const travelStyle = e.target.travelStyle.value;

    if (!destination || days < 1 || budget < 1 || travelers < 1) {
      alert("Please enter valid trip details!");
      return;
    }

    setLoading(true);
    setWeatherLoading(false);
    setTrip(null);
    setWeather(null);

    try {
      const response = await fetch(
        "https://travelsphereai-backend.onrender.com/api/generate-trip",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            destination,
            days,
            budget,
            travelers,
            travelStyle
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate trip");
      }

      const itinerary =
        typeof data.itinerary === "string"
          ? JSON.parse(data.itinerary)
          : data.itinerary;

      if (!itinerary || !Array.isArray(itinerary.days)) {
        throw new Error("Invalid itinerary received. Please try again.");
      }

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

      // Fetch destination weather
      setWeatherLoading(true);

      try {
        const weatherResponse = await fetch(
          `https://travelsphereai-backend.onrender.com/api/weather?destination=${encodeURIComponent(destination)}`
        );

        const weatherData = await weatherResponse.json();

        if (!weatherResponse.ok) {
          throw new Error(weatherData.error || "Weather unavailable");
        }

        setWeather(weatherData);

      } catch (error) {
        console.error("Weather Error:", error);
      } finally {
        setWeatherLoading(false);
      }

    } catch (error) {
      console.error("Trip Generation Error:", error);
      alert(error.message || "Unable to generate trip. Please try again.");
    } finally {
      setLoading(false);
    }
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
            <button
              type="submit"
              className="generate-btn"
              disabled={loading}
            >
              {loading
                ? "✨ Generating Your Trip..."
                : "✨ Generate My Trip"}
            </button>
          </div>

        </form>

        <div className="planner-note">
          💜 Your next adventure is just one click away!
        </div>

        {trip && (
          <div className="trip-results">

            <h2>✨ Your AI Trip to {trip.destination}</h2>

            <p>📅 Duration: {trip.days} days</p>
            <p>💰 Total Budget: ₹{trip.budget.toLocaleString("en-IN")}</p>
            <p>👥 Travelers: {trip.travelers}</p>
            <p>🎯 Travel Style: {trip.travelStyle}</p>

            {/* Itinerary Overview */}
            <h3>✨ Your AI Generated Itinerary</h3>

            <div className="itinerary-overview">
              <h2>{trip.itinerary.title}</h2>
              <p>{trip.itinerary.summary}</p>
            </div>

            {/* Day-wise Itinerary Cards */}
            <div className="day-cards">

              {trip.itinerary.days.map((day, index) => (
                <div className="day-card" key={day.day || index}>

                  <div className="day-card-header">
                    <span>DAY {day.day || index + 1}</span>
                    <h3>{day.title}</h3>
                  </div>

                  <div className="day-detail">
                    <h4>📍 Places to Visit</h4>
                    {(day.places || []).map((place, i) => (
                      <p key={i}>• {place}</p>
                    ))}
                  </div>

                  <div className="day-detail">
                    <h4>🎯 Activities</h4>
                    {(day.activities || []).map((activity, i) => (
                      <p key={i}>• {activity}</p>
                    ))}
                  </div>

                  <div className="day-detail">
                    <h4>🍽️ Food Recommendations</h4>
                    {(day.food || []).map((food, i) => (
                      <p key={i}>• {food}</p>
                    ))}
                  </div>

                  <div className="day-bottom">
                    <p>
                      💰 Estimated Expense: {day.estimatedExpense || "Not available"}
                    </p>

                    <p>
                      💡 {day.tip || "Enjoy your journey!"}
                    </p>
                  </div>

                </div>
              ))}

            </div>

            {/* Total Estimated Expense */}
            <div className="total-expense">
              💵 Total Estimated Expense:{" "}
              {trip.itinerary.totalEstimatedExpense || "Not available"}
            </div>

            {/* Weather Section */}
            <div className="weather-section">

              <h2>
                🌤️ Weather in {weather?.destination || trip.destination}
              </h2>

              {weatherLoading && (
                <p>Loading weather information...</p>
              )}

              {!weatherLoading && weather && (
                <>
                  <p>{weather.country}</p>

                  <div className="weather-current">

                    <h1>
                      {Math.round(weather.current.temperature_2m)}°C
                    </h1>

                    <h3>
                      {getWeatherDescription(weather.current.weather_code)}
                    </h3>

                    <p>
                      Feels Like: {weather.current.apparent_temperature}°C
                    </p>

                    <p>
                      💧 Humidity: {weather.current.relative_humidity_2m}%
                    </p>

                    <p>
                      💨 Wind: {weather.current.wind_speed_10m} km/h
                    </p>

                  </div>

                  <h3>7-Day Forecast</h3>

                  <div className="weather-forecast">

                    {weather.daily.time.map((date, index) => (
                      <div className="forecast-card" key={date}>

                        <h4>
                          {new Date(date + "T12:00:00").toLocaleDateString(
                            "en-IN",
                            {
                              weekday: "short",
                              day: "numeric"
                            }
                          )}
                        </h4>

                        <p>
                          {getWeatherDescription(
                            weather.daily.weather_code[index]
                          )}
                        </p>

                        <strong>
                          {Math.round(weather.daily.temperature_2m_max[index])}°
                          / {Math.round(weather.daily.temperature_2m_min[index])}°C
                        </strong>

                        <p>
                          🌧️ Rain:{" "}
                          {weather.daily.precipitation_probability_max[index]}%
                        </p>

                      </div>
                    ))}

                  </div>
                </>
              )}

              {!weatherLoading && !weather && (
                <p>Weather information is currently unavailable.</p>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default Planner;

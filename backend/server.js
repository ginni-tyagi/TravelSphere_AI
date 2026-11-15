const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


// ===============================
// HOME ROUTE
// ===============================

app.get("/", (req, res) => {
  res.send("TravelSphereAI Backend is Running!");
});


// ===============================
// AI TRIP GENERATOR
// ===============================

app.post("/api/generate-trip", async (req, res) => {
  try {
    const {
      destination,
      days,
      budget,
      travelers,
      travelStyle
    } = req.body;

    if (!destination || !days || !budget || !travelers || !travelStyle) {
      return res.status(400).json({
        error: "Please provide all trip details."
      });
    }

    const { GoogleGenAI } = await import("@google/genai");

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const prompt = `
      Create a detailed ${days}-day travel itinerary for ${destination}.

      Budget: ₹${budget}
      Travelers: ${travelers}
      Travel Style: ${travelStyle}

      Return ONLY valid JSON in this exact structure:

      {
        "title": "Trip title",
        "summary": "Short trip description",
        "days": [
          {
            "day": 1,
            "title": "Day title",
            "places": ["Place 1", "Place 2"],
            "activities": ["Activity 1", "Activity 2"],
            "food": ["Food suggestion 1", "Food suggestion 2"],
            "estimatedExpense": "₹ amount",
            "tip": "Useful travel tip"
          }
        ],
        "totalEstimatedExpense": "₹ amount"
      }

      Instructions:
      - Generate exactly ${days} day-wise plans.
      - Include practical places and activities.
      - Suggest local food.
      - Keep expenses within the given budget.
      - Make the itinerary realistic and useful.
      - All expenses must be estimates.
      - Do not include Markdown or code fences.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt
    });

    let responseText = response.text;

    responseText = responseText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const itinerary = JSON.parse(responseText);

    if (!itinerary || !Array.isArray(itinerary.days)) {
      throw new Error("Invalid itinerary received from AI.");
    }

    res.json({ itinerary });

  } catch (error) {
    console.error("AI Error:", error);

    res.status(500).json({
      error: "Unable to generate trip. Please try again."
    });
  }
});


// ===============================
// WEATHER API - OPEN METEO
// ===============================

app.get("/api/weather", async (req, res) => {
  try {
    const { destination } = req.query;

    if (!destination) {
      return res.status(400).json({
        error: "Please provide a destination."
      });
    }

    console.log("Weather requested for:", destination);

    // STEP 1: GET DESTINATION COORDINATES

    const geoURL =
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=1&language=en&format=json`;

    const geoResponse = await fetch(geoURL);

    if (!geoResponse.ok) {
      throw new Error(
        `Geocoding API error: ${geoResponse.status}`
      );
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      return res.status(404).json({
        error: "Destination not found."
      });
    }

    const place = geoData.results[0];

    console.log("Destination found:", place.name);

    // STEP 2: GET WEATHER FORECAST

    const weatherURL =
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=7&timezone=auto`;

    const weatherResponse = await fetch(weatherURL);

    if (!weatherResponse.ok) {
      throw new Error(
        `Weather API error: ${weatherResponse.status}`
      );
    }

    const weatherData = await weatherResponse.json();

    if (!weatherData.current || !weatherData.daily) {
      throw new Error("Weather data is incomplete.");
    }

    console.log("Weather fetched successfully!");

    res.json({
      destination: place.name,
      country: place.country,
      current: weatherData.current,
      daily: weatherData.daily
    });

  } catch (error) {
    console.error("Weather Error Details:", error);

    res.status(500).json({
      error: error.message || "Unable to fetch weather information."
    });
  }
});


// ===============================
// REAL PLACE IMAGES - WIKIMEDIA
// ===============================

const imageCache = new Map();

async function getPlaceImage(placeName, destination) {
  try {
    const cacheKey =
      `${placeName}-${destination}`.toLowerCase();

    if (imageCache.has(cacheKey)) {
      return imageCache.get(cacheKey);
    }

    const params = new URLSearchParams({
      action: "query",
      generator: "search",
      gsrsearch: `intitle:"${placeName}"`,
      gsrnamespace: "6",
      gsrlimit: "10",
      prop: "imageinfo",
      iiprop: "url",
      iiurlwidth: "600",
      format: "json"
    });

    const response = await fetch(
      `https://commons.wikimedia.org/w/api.php?${params}`,
      {
        headers: {
          "User-Agent": "TravelSphereAI/1.0"
        }
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    const images = Object.values(
      data.query?.pages || {}
    );

    const normalize = (value) =>
      value
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\.[a-z0-9]+$/i, "")
        .replace(/[^a-z0-9 ]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const requiredWords = normalize(placeName)
      .split(" ")
      .filter(word => word.length > 2);

    const matchedImage = images.find(item => {
      const title = normalize(item.title || "");

      const hasMatchingName = requiredWords.every(word =>
        title.includes(word)
      );

      return (
        hasMatchingName &&
        item.imageinfo?.[0]?.thumburl
      );
    });

    const image =
      matchedImage?.imageinfo?.[0]?.thumburl || null;

    imageCache.set(cacheKey, image);

    return image;

  } catch (error) {
    console.log("Image Error:", error.message);
    return null;
  }
}


// ===============================
// NEARBY PLACES API - GEOAPIFY
// ===============================

app.get("/api/nearby-places", async (req, res) => {
  try {
    const { destination, category } = req.query;

    const apiKey = process.env.GEOAPIFY_API_KEY;

    if (!destination) {
      return res.status(400).json({
        error: "Please provide a destination."
      });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: "Geoapify API key is missing."
      });
    }

    const categories = {
      attractions:
        "tourism.attraction,entertainment.culture,leisure.park",

      restaurants:
        "catering.restaurant,catering.cafe",

      hotels:
        "accommodation",

      shopping:
        "commercial.shopping_mall,commercial.marketplace,commercial.clothing"
    };

    if (!categories[category]) {
      return res.status(400).json({
        error: "Invalid category."
      });
    }

    // STEP 1: FIND DESTINATION

    const geoURL =
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=10&language=en&format=json`;

    const geoResponse = await fetch(geoURL);

    if (!geoResponse.ok) {
      throw new Error("Unable to find destination.");
    }

    const geoData = await geoResponse.json();

    if (!geoData.results?.length) {
      return res.status(404).json({
        error: "Destination not found."
      });
    }

    // STEP 2: SELECT LOCATION

    let location;

    if (destination.toLowerCase() === "manali") {
      location = geoData.results.find(
        place =>
          place.name.toLowerCase() === "manali" &&
          place.admin1?.toLowerCase().includes("himachal")
      );
    }

    if (!location) {
      location = geoData.results.find(
        place =>
          place.name.toLowerCase() === destination.toLowerCase()
      );
    }

    if (!location) {
      location = geoData.results[0];
    }

    const lat = location.latitude;
    const lon = location.longitude;

    // STEP 3: SEARCH NEARBY PLACES

    const params = new URLSearchParams({
      categories: categories[category],
      filter: `circle:${lon},${lat},15000`,
      bias: `proximity:${lon},${lat}`,
      limit: "30",
      lang: "en",
      apiKey
    });

    const placesURL =
      `https://api.geoapify.com/v2/places?${params.toString()}`;

    const placesResponse = await fetch(placesURL);

    if (!placesResponse.ok) {
      const errorText = await placesResponse.text();

      console.error(
        "Geoapify Error:",
        placesResponse.status,
        errorText
      );

      throw new Error(
        placesResponse.status === 401 ||
        placesResponse.status === 403
          ? "Invalid Geoapify API key or API access denied."
          : "Unable to fetch places. Please try again."
      );
    }

    const placesData = await placesResponse.json();

    // STEP 4: GET PLACE IMAGES

    const places = await Promise.all(
      (placesData.features || [])
        .filter(feature => feature.properties?.name)
        .map(async feature => {

          const place = feature.properties;

          const image = await getPlaceImage(
            place.name,
            destination
          );

          return {
            id: place.place_id,
            name: place.name,

            description:
              place.address_line2 ||
              place.categories?.join(", ") ||
              "Explore this place.",

            address: place.formatted || "",

            image,

            rating: null,

            distance: place.distance
              ? `${(place.distance / 1000).toFixed(1)} km`
              : null,

            mapsUrl:
              `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`
          };
        })
    );

    res.json({
      destination: location.name,
      country: location.country,
      category,
      places
    });

  } catch (error) {
    console.error("Nearby Places Error:", error);

    res.status(500).json({
      error: error.message || "Unable to find nearby places."
    });
  }
});


// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
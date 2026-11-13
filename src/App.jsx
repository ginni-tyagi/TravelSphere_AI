import { Routes, Route } from "react-router-dom";

import Home from "./Pages/Home.jsx";
import Login from "./Pages/Login.jsx";
import Signup from "./Pages/Signup.jsx";
import Planner from "./Pages/Planner.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import MyTrips from "./Pages/MyTrips";
import TripDetails from "./Pages/TripDetails";
import EditTrip from "./Pages/EditTrip";
import ExpenseTracker from "./Pages/ExpenseTracker";
import SavedPlaces from "./Pages/SavedPlaces";
import Profile from "./Pages/Profile";
import NearbyPlaces from "./Pages/NearbyPlaces";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/planner" element={<Planner />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/my-trips" element={<MyTrips />} />
      <Route path="/trip-details/:id" element={<TripDetails />} />
      <Route path="/edit-trip/:id" element={<EditTrip />} />
      <Route path="/expenses" element={<ExpenseTracker />} />
      <Route path="/saved-places" element={<SavedPlaces />} />
      <Route path="/profile" element={<Profile />} />

      {/* Nearby Places */}
      <Route path="/nearby-places" element={<NearbyPlaces />} />

    </Routes>
  );
}

export default App;
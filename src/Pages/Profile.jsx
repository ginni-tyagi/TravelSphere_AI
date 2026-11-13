import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const registeredUser = JSON.parse(
    localStorage.getItem("registeredUser") || "{}"
  );

  const [profile, setProfile] = useState(
    JSON.parse(localStorage.getItem("userProfile")) || {
      name: registeredUser.name || "",
      email: registeredUser.email || "",
      phone: "",
      location: "",
      picture: ""
    }
  );

  const [editing, setEditing] = useState(
    !localStorage.getItem("userProfile")
  );

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image!");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB!");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfile((prev) => ({
        ...prev,
        picture: reader.result
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();

    try {
      localStorage.setItem("userProfile", JSON.stringify(profile));
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Image is too large to save. Please choose a smaller image.");
    }
  };

  return (
    <div className="profile-page">

      <Link to="/dashboard" className="back-dashboard">
        ← Back to Dashboard
      </Link>

      <h1>👤 My Profile</h1>

      {editing ? (

        <form onSubmit={handleSave}>

          <div className="profile-upload">
            {profile.picture ? (
              <img
                src={profile.picture}
                alt="Profile Preview"
                className="profile-preview"
              />
            ) : (
              <div className="profile-avatar">👤</div>
            )}

            <label htmlFor="profile-picture">
              Upload Profile Picture
            </label>

            <input
              id="profile-picture"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <label>Full Name</label>
          <input
            name="name"
            value={profile.name}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            name="email"
            type="email"
            value={profile.email}
            onChange={handleChange}
            required
          />

          <label>Phone Number</label>
          <input
            name="phone"
            value={profile.phone}
            onChange={handleChange}
          />

          <label>Location</label>
          <input
            name="location"
            value={profile.location}
            onChange={handleChange}
          />

          <button type="submit">Save Profile</button>

        </form>

      ) : (

        <div className="profile-card">

          <div className="profile-avatar">
            {profile.picture ? (
              <img src={profile.picture} alt="Profile" />
            ) : (
              "👤"
            )}
          </div>

          <h2>{profile.name}</h2>

          <p className="profile-subtitle">
            My Travel Profile
          </p>

          <div className="profile-info">
            <p>📧 <strong>Email:</strong> {profile.email}</p>
            <p>📱 <strong>Phone:</strong> {profile.phone || "Not added"}</p>
            <p>📍 <strong>Location:</strong> {profile.location || "Not added"}</p>
          </div>

          <button onClick={() => setEditing(true)}>
            ✏️ Edit Profile
          </button>

        </div>

      )}

    </div>
  );
}

export default Profile;

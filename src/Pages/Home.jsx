import "../App.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="app">

      {/* Navigation */}
      <nav className="navbar">
        <Link to="/" className="logo">
          🌍 TravelSphere AI
        </Link>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>

        <Link to="/login" className="login-btn">
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">

        <div className="hero-content">
          <p className="tagline">
            ✈️ YOUR INTELLIGENT TRAVEL COMPANION
          </p>

          <h1>
            Travel Smarter.
            <br />
            Explore More.
          </h1>

          <p className="description">
            Plan personalized trips, manage your budget,
            discover amazing places, and make your journey
            easier with TravelSphere AI.
          </p>

          <Link to="/planner" className="primary-btn">
            ✨ Plan My Trip
          </Link>
        </div>

        <div className="hero-decoration">
          ✈️
          <span>🌍</span>
        </div>

      </section>

      {/* Features Section */}
      <section className="features" id="features">

        <div className="section-heading">
          <p>WHY TRAVELSPHERE AI?</p>
          <h2>Everything You Need for a Better Journey</h2>
        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Trip Planner</h3>
            <p>
              Get a personalized travel itinerary based on
              your destination, budget and interests.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Smart Budget</h3>
            <p>
              Plan your travel expenses and keep track
              of your spending.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <h3>Explore Places</h3>
            <p>
              Discover attractions, restaurants, cafés
              and hidden gems.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🌤️</div>
            <h3>Weather Updates</h3>
            <p>
              Stay updated with weather information
              before planning your journey.
            </p>
          </div>

        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="about">

        <div className="section-heading">
          <p>HOW IT WORKS</p>
          <h2>Plan Your Perfect Journey in 3 Simple Steps</h2>
        </div>

        <div className="steps-container">

          <div className="step">
            <div className="step-number">01</div>
            <div className="step-icon">📍</div>
            <h3>Tell Us Your Trip</h3>
            <p>
              Enter your destination, travel dates,
              budget and interests.
            </p>
          </div>

          <div className="step">
            <div className="step-number">02</div>
            <div className="step-icon">🤖</div>
            <h3>AI Plans for You</h3>
            <p>
              TravelSphere AI creates a personalized
              itinerary for your journey.
            </p>
          </div>

          <div className="step">
            <div className="step-number">03</div>
            <div className="step-icon">✈️</div>
            <h3>Explore & Enjoy</h3>
            <p>
              Discover places, manage your budget
              and enjoy a smarter journey.
            </p>
          </div>

        </div>
      </section>

      {/* Popular Destinations */}
      <section className="destinations">

        <div className="section-heading">
          <p>EXPLORE INDIA</p>
          <h2>Popular Destinations</h2>
        </div>

        <div className="destination-grid">

          <div className="destination-card">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
              alt="Manali"
            />
            <div className="destination-info">
              <h3>Manali</h3>
              <p>🏔️ Mountains • Adventure • Nature</p>
            </div>
          </div>

          <div className="destination-card">
            <img
              src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2"
              alt="Goa"
            />
            <div className="destination-info">
              <h3>Goa</h3>
              <p>🌊 Beaches • Nightlife • Relaxation</p>
            </div>
          </div>

          <div className="destination-card">
            <img
              src="https://images.unsplash.com/photo-1595815771614-ade9d652a65d"
              alt="Rishikesh"
            />
            <div className="destination-info">
              <h3>Rishikesh</h3>
              <p>🛕 Adventure • Spirituality • Nature</p>
            </div>
          </div>

          <div className="destination-card">
            <img
              src="https://images.unsplash.com/photo-1477587458883-47145ed94245"
              alt="Jaipur"
            />
            <div className="destination-info">
              <h3>Jaipur</h3>
              <p>🏰 Heritage • Culture • History</p>
            </div>
          </div>

        </div>
      </section>

      {/* Call To Action */}
      <section className="cta">

        <div className="cta-content">
          <p>YOUR NEXT ADVENTURE STARTS HERE</p>

          <h2>
            Ready to Plan Your
            <br />
            Perfect Journey?
          </h2>

          <p className="cta-description">
            Let TravelSphere AI help you create smarter,
            personalized and unforgettable travel experiences.
          </p>

          <Link to="/planner" className="cta-btn">
            ✨ Start Planning
          </Link>
        </div>

      </section>

      {/* Footer */}
      <footer className="footer">

        <div className="footer-logo">
          🌍 TravelSphere AI
        </div>

        <p>
          Your intelligent companion for smarter journeys.
        </p>

        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>

        <div className="copyright">
          © 2026 TravelSphere AI. All rights reserved.
        </div>

      </footer>

    </div>
  );
}

export default Home;
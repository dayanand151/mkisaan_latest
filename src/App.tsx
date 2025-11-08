import React from "react";
import mkisaan from "./assets/mkisaan.jpg";
import logo from "./assets/mkisaan_logo.jpg";
import "./App.css";

function App() {
  return (
    <div
      className="app-background"
      style={{ backgroundImage: `url(${mkisaan})` }}
    >
      {/* Empty for now — add buttons and logo later */}
      <header className="app-header">
        <div className="logo-section">
          <img src={logo} alt="mkisaan logo" className="logo-img" />
          <span className="logo-text">mkisaan</span>
        </div>
      </header>

      {/* Hero Text Section */}
      <section className="hero-text">
        <h1>
          Empowering farmers. <br /> Connecting India’s markets.
        </h1>

        <div className="hero-buttons" role="group" aria-label="Primary actions">
          <button className="btn btn-ghost" type="button">
            Log in
          </button>

          <button className="btn btn-ghost" type="button">
            Sign up
          </button>
        </div>
        
      </section>

    </div>
  );
}

export default App;


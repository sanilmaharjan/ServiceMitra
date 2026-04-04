import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/SP.css";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { text: "Good Morning", emoji: "☀️" };
  if (hour >= 12 && hour < 17) return { text: "Good Afternoon", emoji: "🌤️" };
  return { text: "Good Evening", emoji: "🌙" };
}

/**
 * Props:
 *  - providerName {string}  full name of the provider (e.g. "Ramesh Sharma")
 *  - backTo       {string}  route to navigate back to (optional, shows ← Back button)
 */
export default function SPNavbar({ providerName = "Provider", backTo = "" }) {
  const navigate = useNavigate();
  const greeting = getGreeting();
  const firstName = providerName.split(" ")[0];

  return (
    <nav className="sp-navbar">
      <div className="sp-navbar-brand">
        {backTo && (
          <button className="sp-back-btn" onClick={() => navigate(backTo)}>
            ← Back
          </button>
        )}
        <span className="sp-brand-icon">🔧</span>
        <span className="sp-brand-text">
          Service<span>Mitra</span>
        </span>
        <span className="sp-brand-divider" />
        <span className="sp-brand-role">Provider Portal</span>
      </div>

      <div className="sp-navbar-right">
        <div className="sp-greeting">
          <span className="sp-greeting-emoji">{greeting.emoji}</span>
          <span className="sp-greeting-text">
            {greeting.text}, {firstName}!
          </span>
        </div>
        <div className="sp-nav-actions" style={{display: 'flex', gap: '0.75rem'}}>
          <button className="sm-nav-profile" onClick={() => navigate("/provider/profile")}>
            <span>👤</span> Profile
          </button>
          <button className="sp-logout-btn" onClick={() => navigate("/login")}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

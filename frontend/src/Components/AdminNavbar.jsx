import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Admin.css";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { text: "Good Morning", emoji: "☀️" };
  if (hour >= 12 && hour < 17) return { text: "Good Afternoon", emoji: "🌤️" };
  return { text: "Good Evening", emoji: "🌙" };
}

/**
 * Props:
 *  - backTo       {string}   route to go back to (optional)
 *  - backLabel    {string}   label for back button (default "← Back")
 *  - pageIcon     {string}   emoji icon shown next to title (optional)
 *  - pageTitle    {string}   title shown in brand area when backTo is set
 *  - rightSlot    {node}     custom content for the right side (optional)
 *  - showLogout   {boolean}  show logout button (default false)
 */
export default function AdminNavbar({
  backTo,
  backLabel = "← Back",
  pageIcon,
  pageTitle,
  rightSlot,
  showLogout = false,
}) {
  const navigate = useNavigate();
  const greeting = getGreeting();

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-brand">
        {backTo ? (
          <>
            <button className="admin-back-btn" onClick={() => navigate(backTo)}>
              {backLabel}
            </button>
            {pageIcon && <span className="admin-logo-icon">{pageIcon}</span>}
            {pageTitle && (
              <span className="admin-brand-text">{pageTitle}</span>
            )}
          </>
        ) : (
          <span className="admin-brand-text">
            Service<span>Mitra</span> Admin
          </span>
        )}
      </div>

      <div className="admin-navbar-right">
        {rightSlot}
        {!backTo && (
          <div className="admin-greeting">
            <span className="greeting-emoji">{greeting.emoji}</span>
            <span className="greeting-text">{greeting.text}, Admin!</span>
          </div>
        )}
        {(showLogout || !backTo) && (
          <button
            className="admin-logout-btn"
            onClick={() => navigate("/login")}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

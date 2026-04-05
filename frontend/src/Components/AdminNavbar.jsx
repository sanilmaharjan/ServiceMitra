import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Admin.css";
import { AuthContext } from "../context/authContext";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { text: "Good Morning",  };
  if (hour >= 12 && hour < 17) return { text: "Good Afternoon",};
  return { text: "Good Evening"};
}

export default function AdminNavbar({
  backTo,
  onBack,
  backLabel = "Back",
  pageTitle,
  rightSlot,
  showLogout = false,
}) {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const greeting = getGreeting();

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-brand">
        {(backTo || onBack) ? (
          <>
            <button className="admin-back-btn" onClick={() => onBack ? onBack() : navigate(backTo)}>
              {backLabel}
            </button>
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
        {(!backTo && !onBack) && (
          <div className="admin-greeting">
            {/* <span className="greeting-emoji">{greeting.emoji}</span> */}
            <span className="greeting-text">{greeting.text}, Admin!</span>
          </div>
        )}
        {(showLogout || (!backTo && !onBack)) && (
          <button
            className="admin-logout-btn"
            onClick={() => { logout(); navigate("/auth"); }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

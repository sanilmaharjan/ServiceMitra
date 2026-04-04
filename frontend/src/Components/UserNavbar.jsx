import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/User.css";
import { AuthContext } from "../context/authContext";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { text: "Good Morning",  };
  if (hour >= 12 && hour < 17) return { text: "Good Afternoon", };
  return { text: "Good Evening", };
}

export default function UserNavbar({ userName = "User", backTo = "" }) {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const greeting = getGreeting();
  const firstName = userName.split(" ")[0];

  return (
    <nav className="u-navbar">
      <div className="u-navbar-brand">
        {backTo && (
          <button className="u-back-btn" onClick={() => navigate(backTo)}>
            ← Back
          </button>
        )}
        <span className="u-brand-icon"></span>
        <span className="u-brand-text">
          Service<span>Mitra</span>
        </span>
        <span className="u-brand-divider" />
        <span className="u-brand-role">User Portal</span>
      </div>

      <div className="u-navbar-right">
        <div className="u-greeting">
          <span className="u-greeting-emoji">{greeting.emoji}</span>
          <span className="u-greeting-text">{greeting.text}, {firstName}!</span>
        </div>
        <div className="u-nav-actions" style={{display: 'flex', gap: '0.75rem'}}>
          <button className="sm-nav-profile" onClick={() => navigate("/user/history")}>
            <span></span> History
          </button>
          <button className="sm-nav-profile" onClick={() => navigate("/user/profile")}>
            <span></span> Profile
          </button>
          <button className="u-logout-btn" onClick={() => { logout(); navigate("/auth"); }}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

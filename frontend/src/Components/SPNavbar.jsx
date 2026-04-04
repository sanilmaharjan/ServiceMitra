import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/SP.css";
import { AuthContext } from "../context/authContext";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { text: "Good Morning", };
  if (hour >= 12 && hour < 17) return { text: "Good Afternoon",  };
  return { text: "Good Evening",  };
}

export default function SPNavbar({ providerName = "Provider", backTo = "", isVerified = false }) {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
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
        <span className="sp-brand-icon" onClick={() => navigate("/provider")} style={{cursor: 'pointer'}}>🔧</span>
        <span className="sp-brand-text" onClick={() => navigate("/provider")} style={{cursor: 'pointer'}}>
          Service<span>Mitra</span>
        </span>
        <span className="sp-brand-divider" />
        <span className="sp-brand-role">Provider Portal</span>
      </div>

      <div className="sp-navbar-right">
        {!isVerified && (
          <button
            className="sm-btn sm-btn-primary" 
            style={{padding: '0.5rem 1rem', fontSize: '0.75rem', marginRight: '1rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'}}
            onClick={() => navigate("/provider/kyc")}
          >
            Verify KYC
          </button>
        )}
        <div className="sp-greeting">
          {/* <span className="sp-greeting-emoji">{greeting.emoji}</span> */}
          <span className="sp-greeting-text">
            {greeting.text}, {firstName}!
          </span>
        </div>
        <div className="sp-nav-actions" style={{display: 'flex', gap: '0.75rem'}}>
          <button className="sm-nav-profile" onClick={() => navigate("/provider/profile")}>
            <span></span> Profile
          </button>
          <button className="sp-logout-btn" onClick={() => { logout(); navigate("/auth"); }}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

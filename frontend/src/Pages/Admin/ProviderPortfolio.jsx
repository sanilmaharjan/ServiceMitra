import React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import AdminNavbar from "../../Components/AdminNavbar";
import "../../Styles/Admin.css";

const skillColors = ["#667eea", "#f093fb", "#4facfe", "#43e97b", "#f5af19", "#fa709a"];

export default function ProviderPortfolio() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const provider = location.state?.provider;

  if (!provider) {
    return (
      <div className="admin-layout">
        <AdminNavbar backTo="/admin/service-providers" />
        <main className="admin-main">
          <p style={{ color: "#888", textAlign: "center", marginTop: "4rem" }}>Provider not found.</p>
        </main>
      </div>
    );
  }

  const statItems = [
    { label: "Total Jobs", value: provider.jobs, icon: "✅" },
    { label: "Rating", value: provider.rating + " ★", icon: "⭐" },
    { label: "Location", value: provider.location, icon: "📍" },
    { label: "Joined", value: provider.joined, icon: "📅" },
  ];

  return (
    <div className="admin-layout">
      <AdminNavbar
        backTo="/admin/service-providers"
        pageIcon="📁"
        pageTitle="Provider Portfolio"
        rightSlot={
          <button
            className="provider-btn-pay"
            style={{ marginRight: 0 }}
            onClick={() => navigate(`/admin/payments/${provider.id}`, { state: { provider } })}
          >
            💳 Pay Provider
          </button>
        }
      />

      <main className="admin-main">
        <div className="portfolio-hero">
          <div className="portfolio-hero-bg" />
          <div className="portfolio-hero-content">
            <div className="portfolio-avatar">
              <span>{provider.avatar}</span>
            </div>
            <div className="portfolio-hero-info">
              <h1 className="portfolio-name">{provider.name}</h1>
              <span className="portfolio-category">{provider.category}</span>
              <p className="portfolio-bio">{provider.bio}</p>
              <span className={`admin-status-badge ${provider.status} portfolio-status`}>{provider.status}</span>
            </div>
          </div>
        </div>

        <div className="portfolio-stats-row">
          {statItems.map((s) => (
            <div key={s.label} className="portfolio-stat-card">
              <div className="portfolio-stat-icon">{s.icon}</div>
              <div className="portfolio-stat-value">{s.value}</div>
              <div className="portfolio-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="portfolio-grid">
          <div className="portfolio-section">
            <h2 className="portfolio-section-title">🎯 Skills & Expertise</h2>
            <div className="portfolio-skills">
              {provider.skills.map((skill, i) => (
                <span
                  key={skill}
                  className="portfolio-skill-tag"
                  style={{
                    background: `${skillColors[i % skillColors.length]}22`,
                    color: skillColors[i % skillColors.length],
                    borderColor: `${skillColors[i % skillColors.length]}44`,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="portfolio-section">
            <h2 className="portfolio-section-title">💰 Total Earnings</h2>
            <div className="portfolio-earnings-card">
              <div className="portfolio-earnings-value">
                NRS {provider.earnings.toLocaleString()}
              </div>
              <div className="portfolio-earnings-label">Lifetime earnings on platform</div>
              <button
                className="provider-btn-pay"
                style={{ marginTop: "1rem", width: "100%" }}
                onClick={() => navigate(`/admin/payments/${provider.id}`, { state: { provider } })}
              >
                Process Payment →
              </button>
            </div>
          </div>
        </div>

        <div className="portfolio-section" style={{ marginTop: "1.5rem" }}>
          <h2 className="portfolio-section-title">🏆 Past Work</h2>
          {provider.portfolio.length === 0 ? (
            <div className="portfolio-empty">No portfolio projects added yet.</div>
          ) : (
            <div className="portfolio-projects-grid">
              {provider.portfolio.map((project, i) => (
                <div key={i} className="portfolio-project-card">
                  <div className="portfolio-project-year">{project.year}</div>
                  <h3 className="portfolio-project-title">{project.title}</h3>
                  <p className="portfolio-project-desc">{project.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="portfolio-section" style={{ marginTop: "1.5rem" }}>
          <h2 className="portfolio-section-title">📞 Contact Information</h2>
          <div className="portfolio-contact-grid">
            <div className="portfolio-contact-item">
              <span className="portfolio-contact-icon">📧</span>
              <div>
                <div className="portfolio-contact-label">Email</div>
                <div className="portfolio-contact-value">{provider.email}</div>
              </div>
            </div>
            <div className="portfolio-contact-item">
              <span className="portfolio-contact-icon">📱</span>
              <div>
                <div className="portfolio-contact-label">Phone</div>
                <div className="portfolio-contact-value">{provider.phone}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

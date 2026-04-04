import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../Components/AdminNavbar";
import "../../Styles/Admin.css";

const initialProviders = [
  {
    id: 1, name: "Ramesh Electricals", email: "ramesh@email.com", phone: "+977-9801111111",
    category: "Electrician", rating: 4.8, jobs: 132, joined: "Dec 5, 2024",
    status: "verified", avatar: "RE", location: "Kathmandu", kyc: "approved",
    bio: "Professional electrician with 10+ years experience in residential and commercial wiring.",
    skills: ["Wiring", "Panel Upgrade", "LED Installation", "Solar Setup"],
    portfolio: [
      { title: "Hotel Rewiring", desc: "Complete rewiring of a 5-star hotel in Thamel.", year: "2024" },
      { title: "Solar Panel Setup", desc: "Installed 10kW solar system for a factory.", year: "2023" },
    ],
    earnings: 85000,
  },
  {
    id: 2, name: "Sunita Plumbing Works", email: "sunita@email.com", phone: "+977-9812222222",
    category: "Plumber", rating: 4.6, jobs: 89, joined: "Jan 10, 2025",
    status: "verified", avatar: "SP", location: "Lalitpur", kyc: "approved",
    bio: "Expert plumber specializing in pipe fitting and bathroom renovation.",
    skills: ["Pipe Fitting", "Leak Repair", "Bathroom Renovation", "Water Tank"],
    portfolio: [
      { title: "Apartment Complex Plumbing", desc: "Plumbing for a 30-unit apartment.", year: "2024" },
    ],
    earnings: 62000,
  },
  {
    id: 3, name: "Bijay Painting Co.", email: "bijay@email.com", phone: "+977-9823333333",
    category: "Painter", rating: 4.9, jobs: 210, joined: "Nov 20, 2024",
    status: "verified", avatar: "BP", location: "Bhaktapur", kyc: "approved",
    bio: "Award-winning painter with specialty in texture and interior design.",
    skills: ["Interior Painting", "Texture Coat", "Waterproofing", "Exterior Painting"],
    portfolio: [
      { title: "Villa Interior", desc: "Complete interior painting for luxury villa.", year: "2024" },
      { title: "School Renovation", desc: "Painted entire public school building.", year: "2023" },
    ],
    earnings: 120000,
  },
  {
    id: 4, name: "Tech Appliance Fix", email: "techfix@email.com", phone: "+977-9834444444",
    category: "Appliance Repair", rating: 4.5, jobs: 67, joined: "Feb 5, 2025",
    status: "pending", avatar: "TF", location: "Kathmandu", kyc: "pending",
    bio: "Certified appliance technician for all major brands.",
    skills: ["AC Repair", "Washing Machine", "Refrigerator", "Microwave"],
    portfolio: [],
    earnings: 34000,
  },
  {
    id: 5, name: "Green Garden Services", email: "garden@email.com", phone: "+977-9845555555",
    category: "Gardening", rating: 4.3, jobs: 45, joined: "Mar 1, 2025",
    status: "verified", avatar: "GG", location: "Pokhara", kyc: "approved",
    bio: "Landscaping and garden maintenance experts.",
    skills: ["Lawn Care", "Landscaping", "Tree Trimming", "Plant Design"],
    portfolio: [
      { title: "Resort Garden", desc: "Designed and maintained resort garden.", year: "2024" },
    ],
    earnings: 28000,
  },
];

const categoryColors = {
  Electrician: "#667eea",
  Plumber: "#4facfe",
  Painter: "#f093fb",
  "Appliance Repair": "#f5af19",
  Gardening: "#43e97b",
};

export default function AdminServiceProviders() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState(initialProviders);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [removeConfirm, setRemoveConfirm] = useState(null);

  const filtered = providers.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const handleRemove = (id) => {
    setProviders((prev) => prev.filter((p) => p.id !== id));
    setRemoveConfirm(null);
  };

  return (
    <div className="admin-layout">
      <AdminNavbar
        backTo="/admin"
        pageIcon="🛠️"
        pageTitle="Service Providers"
        rightSlot={
          <span className="admin-count-chip">{providers.length} Providers</span>
        }
      />

      <main className="admin-main">
        <div className="admin-page-header">
          <h1 className="admin-page-title">All Service Providers</h1>
          <p className="admin-page-subtitle">Manage providers, view portfolios, and handle verifications.</p>
        </div>

        <div className="admin-controls">
          <div className="admin-search-wrap">
            <span className="admin-search-icon">🔍</span>
            <input
              className="admin-search"
              placeholder="Search by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="admin-filter-group">
            {["all", "verified", "pending"].map((f) => (
              <button key={f} className={`admin-filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="provider-cards-grid">
          {filtered.length === 0 ? (
            <p className="admin-empty-msg">No service providers found.</p>
          ) : (
            filtered.map((p) => (
              <div key={p.id} className="provider-card">
                <div className="provider-card-top" style={{ background: `linear-gradient(135deg,${categoryColors[p.category] || "#667eea"}33,#1e1e3f)` }}>
                  <div className="provider-avatar-lg" style={{ background: `linear-gradient(135deg,${categoryColors[p.category] || "#667eea"},#764ba2)` }}>
                    {p.avatar}
                  </div>
                  <span className={`admin-status-badge ${p.status}`}>{p.status}</span>
                </div>
                <div className="provider-card-body">
                  <h3 className="provider-name">{p.name}</h3>
                  <span className="provider-category-tag" style={{ background: `${categoryColors[p.category] || "#667eea"}22`, color: categoryColors[p.category] || "#667eea" }}>
                    {p.category}
                  </span>
                  <div className="provider-meta">
                    <span>⭐ {p.rating}</span>
                    <span>📍 {p.location}</span>
                    <span>✅ {p.jobs} jobs</span>
                  </div>
                  <div className="provider-actions">
                    <button className="provider-btn-portfolio" onClick={() => navigate(`/admin/service-providers/${p.id}/portfolio`, { state: { provider: p } })}>
                      View Portfolio
                    </button>
                    <button className="provider-btn-pay" onClick={() => navigate(`/admin/payments/${p.id}`, { state: { provider: p } })}>
                      Pay
                    </button>
                    <button className="admin-remove-btn" onClick={() => setRemoveConfirm(p.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {removeConfirm && (
        <div className="admin-modal-overlay" onClick={() => setRemoveConfirm(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-icon">⚠️</div>
            <h3>Remove Provider?</h3>
            <p>This will permanently remove the provider from the platform.</p>
            <div className="admin-modal-actions">
              <button className="admin-modal-cancel" onClick={() => setRemoveConfirm(null)}>Cancel</button>
              <button className="admin-modal-confirm" onClick={() => handleRemove(removeConfirm)}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

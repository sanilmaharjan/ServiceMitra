import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SPNavbar from "../../Components/SPNavbar";
import "../../Styles/SP.css";

const PROVIDER_NAME = "Ramesh Sharma";

const mockBids = [
  {
    id: 1,
    postTitle: "Need AC Repair at Home",
    client: "Sunita Rai",
    category: "Electrical",
    myBid: "NRS 2,000",
    budget: "NRS 1,500 – 3,000",
    placedAt: "2 hours ago",
    status: "pending",
    location: "Kathmandu, Baneshwor",
    note: "I have 5 years of experience in AC repair. Can fix within 2 hours.",
  },
  {
    id: 2,
    postTitle: "Plumbing – Pipe Leakage Fix",
    client: "Anita Shrestha",
    category: "Plumbing",
    myBid: "NRS 800",
    budget: "NRS 500 – 1,200",
    placedAt: "1 day ago",
    status: "accepted",
    location: "Bhaktapur",
    note: "Experienced plumber available immediately.",
  },
  {
    id: 3,
    postTitle: "House Painting – 3BHK",
    client: "Bikram Thapa",
    category: "Painting",
    myBid: "NRS 18,000",
    budget: "NRS 15,000 – 25,000",
    placedAt: "5 hours ago",
    status: "pending",
    location: "Lalitpur, Patan",
    note: "Professional painter with 8 years of experience. Premium quality guaranteed.",
  },
  {
    id: 4,
    postTitle: "Carpentry – Custom Wardrobe",
    client: "Meera Gurung",
    category: "Carpentry",
    myBid: "NRS 14,500",
    budget: "NRS 12,000 – 20,000",
    placedAt: "2 days ago",
    status: "rejected",
    location: "Lalitpur, Jawalakhel",
    note: "Custom furniture specialist with portfolio of 50+ wardrobes.",
  },
  {
    id: 5,
    postTitle: "Laptop Repair – Screen Replacement",
    client: "Rajan Pandey",
    category: "Electronics",
    myBid: "NRS 4,200",
    budget: "NRS 3,000 – 6,000",
    placedAt: "1 day ago",
    status: "accepted",
    location: "Kathmandu, New Road",
    note: "Certified laptop technician. Dell authorized service partner.",
  },
  {
    id: 6,
    postTitle: "Garden Landscaping",
    client: "Suresh Adhikari",
    category: "Gardening",
    myBid: "NRS 7,500",
    budget: "NRS 5,000 – 10,000",
    placedAt: "3 days ago",
    status: "completed",
    location: "Kathmandu, Budhanilkantha",
    note: "Professional landscaper with 6 years of experience.",
  },
];

const statusConfig = {
  pending:   { label: "Pending",   color: "#b45309", bg: "#fffbeb", border: "#fcd34d", icon: "⏳" },
  accepted:  { label: "Accepted",  color: "#15803d", bg: "#f0fdf4", border: "#86efac", icon: "✅" },
  rejected:  { label: "Rejected",  color: "#b91c1c", bg: "#fee2e2", border: "#fca5a5", icon: "❌" },
  completed: { label: "Completed", color: "#1d4ed8", bg: "#eff6ff", border: "#93c5fd", icon: "🎉" },
};

export default function SPBids() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const stats = {
    total:     mockBids.length,
    pending:   mockBids.filter((b) => b.status === "pending").length,
    accepted:  mockBids.filter((b) => b.status === "accepted").length,
    completed: mockBids.filter((b) => b.status === "completed").length,
  };

  const filtered = filter === "all" ? mockBids : mockBids.filter((b) => b.status === filter);

  return (
    <div className="sp-layout">
      <SPNavbar providerName={PROVIDER_NAME} backTo="/provider" />

      <main className="sp-main">
        <div className="sp-page-header">
          <div>
            <h1 className="sp-page-title">My Bids</h1>
            <p className="sp-page-subtitle">Track all your submitted bids and their current status</p>
          </div>
          <button className="sp-btn-primary" onClick={() => navigate("/provider/posts")}>
            + Place New Bid
          </button>
        </div>

        <div className="sp-bids-summary">
          <div className="sp-bid-stat-card">
            <span className="sp-bid-stat-icon">📊</span>
            <span className="sp-bid-stat-value">{stats.total}</span>
            <span className="sp-bid-stat-label">Total Bids</span>
          </div>
          <div className="sp-bid-stat-card">
            <span className="sp-bid-stat-icon">⏳</span>
            <span className="sp-bid-stat-value pending-val">{stats.pending}</span>
            <span className="sp-bid-stat-label">Pending</span>
          </div>
          <div className="sp-bid-stat-card">
            <span className="sp-bid-stat-icon">✅</span>
            <span className="sp-bid-stat-value accepted-val">{stats.accepted}</span>
            <span className="sp-bid-stat-label">Accepted</span>
          </div>
          <div className="sp-bid-stat-card">
            <span className="sp-bid-stat-icon">🎉</span>
            <span className="sp-bid-stat-value completed-val">{stats.completed}</span>
            <span className="sp-bid-stat-label">Completed</span>
          </div>
        </div>

        <div className="sp-filter-group sp-bids-filter">
          {["all", "pending", "accepted", "rejected", "completed"].map((f) => (
            <button
              key={f}
              className={`sp-filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {statusConfig[f]?.icon || "📋"}{" "}
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="sp-bids-list">
          {filtered.length === 0 && (
            <div className="sp-empty-msg">
              <span>😕</span>
              <p>No bids found for this status.</p>
            </div>
          )}
          {filtered.map((bid, idx) => {
            const s = statusConfig[bid.status];
            return (
              <div
                key={bid.id}
                className="sp-bid-card"
                style={{ animationDelay: `${idx * 0.07}s` }}
              >
                <div className="sp-bid-card-left">
                  <div className="sp-bid-icon-wrap">{s.icon}</div>
                  <div className="sp-bid-info">
                    <h3 className="sp-bid-title">{bid.postTitle}</h3>
                    <div className="sp-bid-meta">
                      <span>👤 {bid.client}</span>
                      <span>📍 {bid.location}</span>
                      <span>🏷️ {bid.category}</span>
                      <span>🕐 {bid.placedAt}</span>
                    </div>
                    <p className="sp-bid-note">"{bid.note}"</p>
                  </div>
                </div>
                <div className="sp-bid-card-right">
                  <div className="sp-bid-amount">
                    <span className="sp-bid-amount-label">My Bid</span>
                    <span className="sp-bid-amount-value">{bid.myBid}</span>
                    <span className="sp-bid-range">Budget: {bid.budget}</span>
                  </div>
                  <span
                    className="sp-bid-status-badge"
                    style={{ background: s.bg, color: s.color, borderColor: s.border }}
                  >
                    {s.icon} {s.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

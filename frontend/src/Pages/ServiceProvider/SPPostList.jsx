import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SPNavbar from "../../Components/SPNavbar";
import "../../Styles/SP.css";

const PROVIDER_NAME = "Ramesh Sharma";

const mockPosts = [
  {
    id: 1,
    title: "Need AC Repair at Home",
    category: "Electrical",
    location: "Kathmandu, Baneshwor",
    budget: "NRS 1,500 – 3,000",
    postedBy: "Sunita Rai",
    postedAt: "2 hours ago",
    status: "open",
    description: "My AC unit is making a strange noise and not cooling properly. Need an experienced technician.",
    urgency: "urgent",
  },
  {
    id: 2,
    title: "House Painting – 3BHK",
    category: "Painting",
    location: "Lalitpur, Patan",
    budget: "NRS 15,000 – 25,000",
    postedBy: "Bikram Thapa",
    postedAt: "5 hours ago",
    status: "open",
    description: "Complete interior and exterior painting required for 3BHK. Looking for experienced painters.",
    urgency: "normal",
  },
  {
    id: 3,
    title: "Plumbing – Pipe Leakage Fix",
    category: "Plumbing",
    location: "Bhaktapur",
    budget: "NRS 500 – 1,200",
    postedBy: "Anita Shrestha",
    postedAt: "1 day ago",
    status: "open",
    description: "Kitchen pipe is leaking. Need an urgent fix. The pipe under the sink is dripping.",
    urgency: "urgent",
  },
  {
    id: 4,
    title: "Laptop Repair – Screen Replacement",
    category: "Electronics",
    location: "Kathmandu, New Road",
    budget: "NRS 3,000 – 6,000",
    postedBy: "Rajan Pandey",
    postedAt: "1 day ago",
    status: "bidding",
    description: "Dell laptop screen is cracked. Need screen replacement. Model: Dell Inspiron 15.",
    urgency: "normal",
  },
  {
    id: 5,
    title: "Carpentry – Custom Wardrobe",
    category: "Carpentry",
    location: "Lalitpur, Jawalakhel",
    budget: "NRS 12,000 – 20,000",
    postedBy: "Meera Gurung",
    postedAt: "2 days ago",
    status: "open",
    description: "Custom wooden wardrobe needed for master bedroom. Size approx 6x8 feet with sliding doors.",
    urgency: "normal",
  },
  {
    id: 6,
    title: "Garden Landscaping",
    category: "Gardening",
    location: "Kathmandu, Budhanilkantha",
    budget: "NRS 5,000 – 10,000",
    postedBy: "Suresh Adhikari",
    postedAt: "3 days ago",
    status: "open",
    description: "Need a professional landscaper to design and maintain a small garden. Area ~200 sqft.",
    urgency: "normal",
  },
];

const categoryColors = {
  Electrical: { bg: "#fffbeb", color: "#b45309", border: "#fcd34d" },
  Painting:   { bg: "#f0fdf4", color: "#15803d", border: "#86efac" },
  Plumbing:   { bg: "#eff6ff", color: "#1d4ed8", border: "#93c5fd" },
  Electronics:{ bg: "#faf5ff", color: "#7c3aed", border: "#c4b5fd" },
  Carpentry:  { bg: "#fff7ed", color: "#c2410c", border: "#fdba74" },
  Gardening:  { bg: "#f0fdf4", color: "#166534", border: "#6ee7b7" },
};

export default function SPPostList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);

  const filtered = mockPosts.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "urgent" && p.urgency === "urgent") ||
      p.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="sp-layout">
      <SPNavbar providerName={PROVIDER_NAME} backTo="/provider" />

      <main className="sp-main">
        <div className="sp-page-header">
          <div>
            <h1 className="sp-page-title">Service Post List</h1>
            <p className="sp-page-subtitle">Browse and bid on available service requests</p>
          </div>
          <div className="sp-header-badge">
            <span className="sp-status-dot" />
            {filtered.length} posts available
          </div>
        </div>

        <div className="sp-controls">
          <div className="sp-search-wrap">
            <span className="sp-search-icon">🔍</span>
            <input
              className="sp-search"
              placeholder="Search by title, category, or location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="sp-filter-group">
            {["all", "open", "bidding", "urgent"].map((f) => (
              <button
                key={f}
                className={`sp-filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="sp-posts-grid">
          {filtered.length === 0 && (
            <div className="sp-empty-msg">
              <span>😕</span>
              <p>No posts found matching your criteria.</p>
            </div>
          )}
          {filtered.map((post, idx) => {
            const catStyle = categoryColors[post.category] || {};
            return (
              <div
                key={post.id}
                className="sp-post-card"
                style={{ animationDelay: `${idx * 0.07}s` }}
              >
                <div className="sp-post-card-top">
                  <div className="sp-post-meta-row">
                    <span
                      className="sp-post-category"
                      style={{
                        background: catStyle.bg,
                        color: catStyle.color,
                        borderColor: catStyle.border,
                      }}
                    >
                      {post.category}
                    </span>
                    {post.urgency === "urgent" && (
                      <span className="sp-post-urgent">🔴 Urgent</span>
                    )}
                  </div>
                  <h3 className="sp-post-title">{post.title}</h3>
                  <p className="sp-post-desc">{post.description}</p>
                </div>
                <div className="sp-post-card-body">
                  <div className="sp-post-info-row">
                    <span>📍 {post.location}</span>
                    <span>💰 {post.budget}</span>
                  </div>
                  <div className="sp-post-info-row">
                    <span>👤 {post.postedBy}</span>
                    <span>🕐 {post.postedAt}</span>
                  </div>
                </div>
                <div className="sp-post-card-footer">
                  <span className={`sp-post-status ${post.status}`}>
                    {post.status === "open" ? "Open" : "Bidding Active"}
                  </span>
                  <button className="sp-bid-btn" onClick={() => setSelectedPost(post)}>
                    Place Bid →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {selectedPost && (
        <div className="sp-modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="sp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sp-modal-icon">🏷️</div>
            <h3>Place a Bid</h3>
            <p className="sp-modal-post-title">{selectedPost.title}</p>
            <p>Budget Range: <strong>{selectedPost.budget}</strong></p>
            <div className="sp-modal-form">
              <label>Your Bid Amount (NRS)</label>
              <input type="number" className="sp-modal-input" placeholder="Enter amount in NRS" />
              <label>Message to Client</label>
              <textarea className="sp-modal-textarea" placeholder="Describe your experience and approach…" rows={3} />
            </div>
            <div className="sp-modal-actions">
              <button className="sp-modal-cancel" onClick={() => setSelectedPost(null)}>Cancel</button>
              <button className="sp-modal-confirm" onClick={() => setSelectedPost(null)}>Submit Bid</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

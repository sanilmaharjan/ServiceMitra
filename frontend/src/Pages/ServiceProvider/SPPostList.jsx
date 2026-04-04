import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SPNavbar from "../../Components/SPNavbar";
import "../../Styles/SP.css";
import { AuthContext } from "../../context/authContext";
import bidsApi from "../../utils/bidsApi";
import jobsApi from "../../utils/jobsApi";

const categoryColors = {
  Electrical: { bg: "#fffbeb", color: "#b45309", border: "#fcd34d" },
  Painting: { bg: "#f0fdf4", color: "#15803d", border: "#86efac" },
  Plumbing: { bg: "#eff6ff", color: "#1d4ed8", border: "#93c5fd" },
  Electronics: { bg: "#faf5ff", color: "#7c3aed", border: "#c4b5fd" },
  Carpentry: { bg: "#fff7ed", color: "#c2410c", border: "#fdba74" },
  Gardening: { bg: "#f0fdf4", color: "#166534", border: "#6ee7b7" },
};

export default function SPPostList() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);

  const [bidAmount, setBidAmount] = useState("");
  const [bidMessage, setBidMessage] = useState("");
  const [submittingBid, setSubmittingBid] = useState(false);

  useEffect(() => {
    fetchAvailableJobs();
  }, []);

  const fetchAvailableJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsApi.getAvailableJobs();
      setPosts(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBidSubmit = async () => {
    if (!bidAmount) {
      alert("Please enter a bid amount.");
      return;
    }
    try {
      setSubmittingBid(true);
      await bidsApi.createBid(selectedPost.id, {
        amount: parseFloat(bidAmount),
        message: bidMessage,
        estimated_days: 1,
      });
      alert("Bid placed successfully!");
      setSelectedPost(null);
      setBidAmount("");
      setBidMessage("");
      fetchAvailableJobs();
    } catch (err) {
      console.error(err);
      alert("Failed to place bid.");
    } finally {
      setSubmittingBid(false);
    }
  };

  const filtered = posts.filter((p) => {
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

  const PROVIDER_NAME = user?.name || "Provider";

  return (
    <div className="sp-layout">
      <SPNavbar providerName={PROVIDER_NAME} backTo="/provider" />

      <main className="sp-main">
        <div className="sp-page-header">
          <div>
            <h1 className="sp-page-title">Service Post List</h1>
            <p className="sp-page-subtitle">
              Browse and bid on available service requests
            </p>
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
              <span></span>
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
                      <span className="sp-post-urgent"> Urgent</span>
                    )}
                  </div>
                  <h3 className="sp-post-title">{post.title}</h3>
                  <p className="sp-post-desc">{post.description}</p>
                </div>
                <div className="sp-post-card-body">
                  <div className="sp-post-info-row">
                    <span> {post.location}</span>
                    <span> {post.budget}</span>
                  </div>
                  <div className="sp-post-info-row">
                    <span> {post.postedBy}</span>
                    <span> {post.postedAt}</span>
                  </div>
                </div>
                <div className="sp-post-card-footer">
                  <span className={`sp-post-status ${post.status}`}>
                    {post.status === "open" ? "Open" : "Bidding Active"}
                  </span>
                  <button
                    className="sp-bid-btn"
                    onClick={() => setSelectedPost(post)}
                  >
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
            <div className="sp-modal-icon"></div>
            <h3>Place a Bid</h3>
            <p className="sp-modal-post-title">{selectedPost.title}</p>
            <p>
              Budget Range: <strong>{selectedPost.budget}</strong>
            </p>
            <div className="sp-modal-form">
              <label>Your Bid Amount (NRS)</label>
              <input
                type="number"
                className="sp-modal-input"
                placeholder="Enter amount in NRS"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
              />
              <label>Message to Client</label>
              <textarea
                className="sp-modal-textarea"
                placeholder="Describe your experience and approach…"
                rows={3}
                value={bidMessage}
                onChange={(e) => setBidMessage(e.target.value)}
              />
            </div>
            <div className="sp-modal-actions">
              <button
                className="sp-modal-cancel"
                onClick={() => {
                  setSelectedPost(null);
                  setBidAmount("");
                  setBidMessage("");
                }}
              >
                Cancel
              </button>
              <button
                className="sp-modal-confirm"
                onClick={handleBidSubmit}
                disabled={submittingBid}
              >
                {submittingBid ? "Submitting..." : "Submit Bid"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

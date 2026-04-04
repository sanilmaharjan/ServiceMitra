import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/Admin.css";

const initialUsers = [
  { id: 1, name: "Aarav Sharma", email: "aarav@email.com", phone: "+977-9801234567", joined: "Jan 12, 2025", status: "active", avatar: "AS", services: 4 },
  { id: 2, name: "Priya Thapa", email: "priya@email.com", phone: "+977-9812345678", joined: "Feb 3, 2025", status: "active", avatar: "PT", services: 2 },
  { id: 3, name: "Bikas Rai", email: "bikas@email.com", phone: "+977-9823456789", joined: "Mar 15, 2025", status: "inactive", avatar: "BR", services: 7 },
  { id: 4, name: "Sita Gurung", email: "sita@email.com", phone: "+977-9834567890", joined: "Mar 20, 2025", status: "active", avatar: "SG", services: 1 },
  { id: 5, name: "Rajan Maharjan", email: "rajan@email.com", phone: "+977-9845678901", joined: "Apr 1, 2025", status: "active", avatar: "RM", services: 3 },
  { id: 6, name: "Anita Poudel", email: "anita@email.com", phone: "+977-9856789012", joined: "Apr 2, 2025", status: "inactive", avatar: "AP", services: 0 },
  { id: 7, name: "Dipesh KC", email: "dipesh@email.com", phone: "+977-9867890123", joined: "Apr 3, 2025", status: "active", avatar: "DK", services: 5 },
  { id: 8, name: "Rekha Shrestha", email: "rekha@email.com", phone: "+977-9878901234", joined: "Apr 4, 2025", status: "active", avatar: "RS", services: 2 },
];

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [removeConfirm, setRemoveConfirm] = useState(null);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || u.status === filter;
    return matchSearch && matchFilter;
  });

  const handleRemove = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setRemoveConfirm(null);
  };

  return (
    <div className="admin-layout">
      <nav className="admin-navbar">
        <div className="admin-navbar-brand">
          <button className="admin-back-btn" onClick={() => navigate("/admin")}>
            ← Back
          </button>
          <span className="admin-logo-icon">📍</span>
          <span className="admin-brand-text">Manage Users</span>
        </div>
        <div className="admin-navbar-right">
          <span className="admin-count-chip">{users.length} Users</span>
        </div>
      </nav>

      <main className="admin-main">
        <div className="admin-page-header">
          <h1 className="admin-page-title">All Users</h1>
          <p className="admin-page-subtitle">View and manage all registered users on the platform.</p>
        </div>

        {/* Controls */}
        <div className="admin-controls">
          <div className="admin-search-wrap">
            <span className="admin-search-icon">🔍</span>
            <input
              className="admin-search"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="admin-filter-group">
            {["all", "active", "inactive"].map((f) => (
              <button
                key={f}
                className={`admin-filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Joined</th>
                <th>Services Booked</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="admin-empty">No users found.</td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id} className="admin-table-row">
                    <td>
                      <div className="admin-user-cell">
                        <div className="admin-avatar-sm" style={{ background: "linear-gradient(135deg,#667eea,#764ba2)" }}>
                          {user.avatar}
                        </div>
                        <div>
                          <div className="admin-user-name">{user.name}</div>
                          <div className="admin-user-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="admin-td-muted">{user.phone}</td>
                    <td className="admin-td-muted">{user.joined}</td>
                    <td>
                      <span className="admin-services-badge">{user.services}</span>
                    </td>
                    <td>
                      <span className={`admin-status-badge ${user.status}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="admin-remove-btn"
                        onClick={() => setRemoveConfirm(user.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Confirm Modal */}
      {removeConfirm && (
        <div className="admin-modal-overlay" onClick={() => setRemoveConfirm(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-icon">⚠️</div>
            <h3>Remove User?</h3>
            <p>This action cannot be undone. The user will lose access to the platform.</p>
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

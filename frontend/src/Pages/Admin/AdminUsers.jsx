import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../Components/AdminNavbar";
import "../../Styles/Admin.css";
import adminApi from "../../utils/adminApi";

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getUsers();
      // Format the users data
      const formattedUsers = (response.data || []).map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email || "No email",
        phone: user.phone,
        role: user.role,
        created_at: user.created_at,
        is_verified: user.is_verified || false,
        avatar: user.name?.charAt(0).toUpperCase() || "U",
        status: user.role === "admin" ? "active" : "active",
        joined: new Date(user.created_at).toLocaleDateString(),
        jobs: 0, // You can add jobs count later
      }));
      setUsers(formattedUsers);
    } catch (err) {
      console.error(err);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminApi.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setShowDeleteModal(null);
      alert("User deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.phone.includes(search),
  );

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <span
            className="sm-badge"
            style={{ background: "#fef3c7", color: "#92400e" }}
          >
            Admin
          </span>
        );
      case "service_provider":
        return (
          <span
            className="sm-badge"
            style={{ background: "#dbeafe", color: "#1e40af" }}
          >
            Service Provider
          </span>
        );
      case "client":
        return (
          <span
            className="sm-badge"
            style={{ background: "#d1fae5", color: "#065f46" }}
          >
            Client
          </span>
        );
      default:
        return <span className="sm-badge">{role}</span>;
    }
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminNavbar
          backTo="/admin"
          pageIcon="👥"
          pageTitle="Community Users"
        />
        <main className="sm-container sm-section">
          <div style={{ textAlign: "center", padding: "3rem" }}>
            Loading users...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout animate-fade">
      <AdminNavbar backTo="/admin" pageIcon="👥" pageTitle="Community Users" />

      <main className="sm-container sm-section">
        <header
          className="page-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                color: "var(--sm-navy)",
                margin: 0,
              }}
            >
              User Management
            </h1>
            <p style={{ color: "var(--sm-text-mid)", marginTop: "0.4rem" }}>
              Manage all users on the platform
            </p>
          </div>
          <div
            className="sm-badge sm-badge-info"
            style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}
          >
            {users.length} Total Users
          </div>
        </header>

        <div style={{ marginBottom: "2rem" }}>
          <input
            className="sm-input"
            style={{ width: "100%", maxWidth: "400px" }}
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="sm-table-card">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  textAlign: "left",
                  borderBottom: "2px solid var(--sm-gray-border)",
                }}
              >
                <th
                  style={{
                    padding: "1rem",
                    fontSize: "0.85rem",
                    color: "var(--sm-text-light)",
                  }}
                >
                  User
                </th>
                <th
                  style={{
                    padding: "1rem",
                    fontSize: "0.85rem",
                    color: "var(--sm-text-light)",
                  }}
                >
                  Contact
                </th>
                <th
                  style={{
                    padding: "1rem",
                    fontSize: "0.85rem",
                    color: "var(--sm-text-light)",
                  }}
                >
                  Role
                </th>
                <th
                  style={{
                    padding: "1rem",
                    fontSize: "0.85rem",
                    color: "var(--sm-text-light)",
                  }}
                >
                  Joined
                </th>
                <th
                  style={{
                    padding: "1rem",
                    fontSize: "0.85rem",
                    color: "var(--sm-text-light)",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: "1rem",
                    fontSize: "0.85rem",
                    color: "var(--sm-text-light)",
                    textAlign: "right",
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  style={{ borderBottom: "1px solid var(--sm-gray-border)" }}
                >
                  <td style={{ padding: "1rem" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          background:
                            user.role === "admin"
                              ? "var(--sm-navy)"
                              : user.role === "service_provider"
                                ? "#2563eb"
                                : "#059669",
                          color: "#fff",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                        }}
                      >
                        {user.avatar}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{user.name}</div>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--sm-text-light)",
                          }}
                        >
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "1rem",
                      fontSize: "0.9rem",
                      color: "var(--sm-text-mid)",
                    }}
                  >
                    {user.phone}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    {getRoleBadge(user.role)}
                    {user.role === "service_provider" && (
                      <div style={{ fontSize: "0.7rem", marginTop: "0.25rem" }}>
                        {user.is_verified ? "✓ Verified" : "⏳ Pending"}
                      </div>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "1rem",
                      fontSize: "0.85rem",
                      color: "var(--sm-text-mid)",
                    }}
                  >
                    {user.joined}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span
                      className={`sm-badge ${user.status === "active" ? "sm-badge-success" : "sm-badge-danger"}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    <button
                      className="sm-btn sm-btn-ghost"
                      style={{
                        color: "var(--sm-danger)",
                        padding: "0.4rem 0.8rem",
                        fontSize: "0.75rem",
                      }}
                      onClick={() => setShowDeleteModal(user)}
                      disabled={user.role === "admin"}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "var(--sm-text-light)",
              }}
            >
              No users found
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="sm-overlay animate-fade"
          onClick={() => setShowDeleteModal(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="sm-card"
            style={{ maxWidth: "400px", textAlign: "center" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚠️</div>
            <h3 style={{ fontWeight: 800, color: "var(--sm-navy)" }}>
              Delete User?
            </h3>
            <p style={{ color: "var(--sm-text-mid)", marginBottom: "1.5rem" }}>
              Are you sure you want to delete{" "}
              <strong>{showDeleteModal.name}</strong>?<br />
              This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                className="sm-btn sm-btn-ghost"
                style={{ flex: 1 }}
                onClick={() => setShowDeleteModal(null)}
              >
                Cancel
              </button>
              <button
                className="sm-btn sm-btn-danger"
                style={{ flex: 1 }}
                onClick={() => handleDelete(showDeleteModal.id)}
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

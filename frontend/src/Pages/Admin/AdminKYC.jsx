import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../Components/AdminNavbar";
import "../../Styles/Admin.css";

const initialKYC = [
  {
    id: 1, name: "Tech Appliance Fix", email: "techfix@email.com", phone: "+977-9834444444",
    category: "Appliance Repair", avatar: "TF", submitted: "Apr 3, 2025", status: "pending",
    docs: { citizenship: true, pan: true, selfie: true, certificate: false },
    address: "Koteshwor, Kathmandu", dob: "1990-05-14", notes: "",
  },
  {
    id: 2, name: "Maya Beauty Parlour", email: "maya@email.com", phone: "+977-9867654321",
    category: "Beauty & Wellness", avatar: "MB", submitted: "Apr 2, 2025", status: "pending",
    docs: { citizenship: true, pan: false, selfie: true, certificate: true },
    address: "Baneshwor, Kathmandu", dob: "1995-08-22", notes: "",
  },
  {
    id: 3, name: "Quick Cleaning Services", email: "clean@email.com", phone: "+977-9856789012",
    category: "Cleaning", avatar: "QC", submitted: "Apr 1, 2025", status: "pending",
    docs: { citizenship: true, pan: true, selfie: false, certificate: false },
    address: "Lalitpur", dob: "1988-11-30", notes: "",
  },
  {
    id: 4, name: "Ramesh Electricals", email: "ramesh@email.com", phone: "+977-9801111111",
    category: "Electrician", avatar: "RE", submitted: "Mar 15, 2025", status: "approved",
    docs: { citizenship: true, pan: true, selfie: true, certificate: true },
    address: "Thamel, Kathmandu", dob: "1985-02-10", notes: "All documents verified successfully.",
  },
  {
    id: 5, name: "Sunita Plumbing Works", email: "sunita@email.com", phone: "+977-9812222222",
    category: "Plumber", avatar: "SP", submitted: "Mar 10, 2025", status: "rejected",
    docs: { citizenship: true, pan: false, selfie: true, certificate: false },
    address: "Lalitpur", dob: "1992-07-18", notes: "PAN card missing. Please resubmit.",
  },
];

const docLabels = {
  citizenship: "Citizenship Card",
  pan: "PAN Card",
  selfie: "Live Selfie",
  certificate: "Work Certificate",
};

export default function AdminKYC() {
  const navigate = useNavigate();
  const [kyc, setKyc] = useState(initialKYC);
  const [selected, setSelected] = useState(null);
  const [noteInput, setNoteInput] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = kyc.filter((k) => filter === "all" || k.status === filter);

  const handleAction = (id, action) => {
    setKyc((prev) =>
      prev.map((k) => k.id === id ? { ...k, status: action, notes: noteInput || k.notes } : k)
    );
    setSelected(null);
    setNoteInput("");
  };

  const openDetail = (item) => {
    setSelected(item);
    setNoteInput(item.notes || "");
  };

  const statusColor = { pending: "#f5af19", approved: "#43e97b", rejected: "#fa709a" };
  const counts = {
    all: kyc.length,
    pending: kyc.filter((k) => k.status === "pending").length,
    approved: kyc.filter((k) => k.status === "approved").length,
    rejected: kyc.filter((k) => k.status === "rejected").length,
  };

  return (
    <div className="admin-layout">
      <AdminNavbar
        backTo="/admin"
        pageIcon="📋"
        pageTitle="KYC Verification"
        rightSlot={
          <span className="admin-count-chip urgent">{counts.pending} Pending</span>
        }
      />

      <main className="admin-main">
        <div className="admin-page-header">
          <h1 className="admin-page-title">KYC Verification</h1>
          <p className="admin-page-subtitle">Review and verify service provider identity documents.</p>
        </div>

        <div className="kyc-stats-row">
          {["all", "pending", "approved", "rejected"].map((s) => (
            <div
              key={s}
              className={`kyc-stat-pill ${filter === s ? "active" : ""}`}
              onClick={() => setFilter(s)}
              style={{ borderColor: s === "all" ? "#667eea" : statusColor[s] || "#667eea" }}
            >
              <span className="kyc-stat-count" style={{ color: s === "all" ? "#667eea" : statusColor[s] }}>
                {counts[s]}
              </span>
              <span className="kyc-stat-label">{s.charAt(0).toUpperCase() + s.slice(1)}</span>
            </div>
          ))}
        </div>

        <div className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Provider</th>
                <th>Category</th>
                <th>Submitted</th>
                <th>Documents</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="admin-empty">No KYC requests found.</td></tr>
              ) : (
                filtered.map((item) => {
                  const docsSubmitted = Object.values(item.docs).filter(Boolean).length;
                  return (
                    <tr key={item.id} className="admin-table-row">
                      <td>
                        <div className="admin-user-cell">
                          <div className="admin-avatar-sm" style={{ background: "linear-gradient(135deg,#f093fb,#f5576c)" }}>
                            {item.avatar}
                          </div>
                          <div>
                            <div className="admin-user-name">{item.name}</div>
                            <div className="admin-user-email">{item.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="admin-td-muted">{item.category}</td>
                      <td className="admin-td-muted">{item.submitted}</td>
                      <td>
                        <div className="kyc-doc-indicators">
                          {Object.entries(item.docs).map(([key, val]) => (
                            <span
                              key={key}
                              className={`kyc-doc-dot ${val ? "doc-ok" : "doc-missing"}`}
                              title={`${docLabels[key]}: ${val ? "Submitted" : "Missing"}`}
                            />
                          ))}
                          <span className="kyc-doc-count">{docsSubmitted}/4</span>
                        </div>
                      </td>
                      <td>
                        <span className={`admin-status-badge ${item.status}`}>{item.status}</span>
                      </td>
                      <td>
                        <button className="provider-btn-portfolio" onClick={() => openDetail(item)}>
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>

      {selected && (
        <div className="admin-modal-overlay" onClick={() => setSelected(null)}>
          <div className="kyc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="kyc-modal-header">
              <div className="kyc-modal-avatar">{selected.avatar}</div>
              <div>
                <h3 className="kyc-modal-name">{selected.name}</h3>
                <div className="kyc-modal-meta">{selected.category} · {selected.address}</div>
              </div>
              <button className="kyc-modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="kyc-modal-info-grid">
              <div className="kyc-info-item"><span className="kyc-info-label">Email</span><span className="kyc-info-value">{selected.email}</span></div>
              <div className="kyc-info-item"><span className="kyc-info-label">Phone</span><span className="kyc-info-value">{selected.phone}</span></div>
              <div className="kyc-info-item"><span className="kyc-info-label">Date of Birth</span><span className="kyc-info-value">{selected.dob}</span></div>
              <div className="kyc-info-item"><span className="kyc-info-label">Submitted</span><span className="kyc-info-value">{selected.submitted}</span></div>
            </div>
            <div className="kyc-docs-section">
              <h4 className="kyc-docs-title">Document Checklist</h4>
              <div className="kyc-docs-grid">
                {Object.entries(selected.docs).map(([key, val]) => (
                  <div key={key} className={`kyc-doc-card ${val ? "doc-card-ok" : "doc-card-missing"}`}>
                    <span className="kyc-doc-card-icon">{val ? "✅" : "❌"}</span>
                    <span className="kyc-doc-card-label">{docLabels[key]}</span>
                    <span className="kyc-doc-card-status">{val ? "Submitted" : "Missing"}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="kyc-note-section">
              <label className="payment-label">Admin Note</label>
              <textarea
                className="payment-textarea"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Add a verification note..."
                rows={2}
              />
            </div>
            <div className="kyc-modal-actions">
              <button className="kyc-reject-btn" onClick={() => handleAction(selected.id, "rejected")}>✕ Reject</button>
              <button className="kyc-approve-btn" onClick={() => handleAction(selected.id, "approved")}>✓ Approve</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

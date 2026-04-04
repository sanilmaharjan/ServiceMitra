import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../Components/AdminNavbar";
import "../../Styles/Admin.css";
import api from "../../utils/api";
import adminApi from "../../utils/adminApi";

export default function AdminKYC() {
  const navigate = useNavigate();
  const [kyc, setKyc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [noteInput, setNoteInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [viewingDoc, setViewingDoc] = useState(null);

  useEffect(() => {
    fetchKYC();
  }, []);

  const fetchKYC = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getPendingKYC();
      setKyc(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = kyc.filter((k) => filter === "all" || k.status === filter);

  const handleAction = async (id, action) => {
    try {
      await adminApi.verifyKYC(id, {
        status: action,
        notes: noteInput
      });
      setKyc((prev) =>
        prev.map((k) => k.id === id ? { ...k, status: action, notes: noteInput || k.notes } : k)
      );
      setSelected(null);
      setNoteInput("");
      alert(`KYC ${action} successful.`);
    } catch (err) {
      console.error(err);
      alert("Failed to update KYC status.");
    }
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

  const docLabels = {
    citizenship: "Citizenship Card",
    pan: "PAN Card",
    selfie: "Live Selfie",
    certificate: "Work Certificate",
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
                        <button className="sm-btn sm-btn-outline" style={{padding: '0.4rem 1rem', fontSize: '0.75rem'}} onClick={() => openDetail(item)}>
                          Review Details
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
                  <div 
                    key={key} 
                    className={`kyc-doc-card ${val ? "doc-card-ok" : "doc-card-missing"}`}
                    onClick={() => val && setViewingDoc({ type: key, label: docLabels[key] })}
                    style={{ cursor: val ? 'pointer' : 'default' }}
                  >
                    <div className="kyc-doc-card-header">
                      <span className="kyc-doc-card-icon">{val ? "📄" : "❌"}</span>
                      <span className="kyc-doc-card-label">{docLabels[key]}</span>
                    </div>
                    {val && <span className="kyc-doc-view-hint">Click to View Document</span>}
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
              <button className="sm-btn sm-btn-outline" style={{flex: 1}} onClick={() => handleAction(selected.id, "rejected")}>✕ Reject</button>
              <button className="sm-btn sm-btn-primary" style={{flex: 1}} onClick={() => handleAction(selected.id, "approved")}>✓ Approve KYC</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Document Preview Portal --- */}
      {viewingDoc && (
        <div className="sm-overlay animate-fade" onClick={() => setViewingDoc(null)} style={{zIndex: 2000, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)'}}>
          <div className="sm-modal sm-card" onClick={e => e.stopPropagation()} style={{maxWidth: '800px', width: '90%', padding: '0', overflow: 'hidden'}}>
            <div style={{padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--sm-gray-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h3 style={{margin: 0, fontSize: '1.1rem', color: 'var(--sm-navy)'}}>{viewingDoc.label}</h3>
              <button className="sm-btn-ghost" onClick={() => setViewingDoc(null)} style={{padding: '0.5rem'}}>✕</button>
            </div>
            <div style={{padding: '2rem', background: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px'}}>
              {/* Mock visualization of a government document */}
              <div style={{
                width: '100%', 
                maxWidth: '600px', 
                aspectRatio: '1.6 / 1', 
                background: '#fff', 
                borderRadius: '12px', 
                boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                padding: '2rem',
                border: '1px solid #e2e8f0',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{display: 'flex', gap: '1.5rem'}}>
                  <div style={{width: '120px', height: '140px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem'}}>👤</div>
                  <div style={{flex: 1}}>
                    <div style={{height: '14px', width: '70%', background: 'var(--sm-navy)', opacity: 0.8, borderRadius: '4px', marginBottom: '1rem'}}></div>
                    <div style={{height: '10px', width: '90%', background: '#cbd5e1', borderRadius: '4px', marginBottom: '0.6rem'}}></div>
                    <div style={{height: '10px', width: '85%', background: '#cbd5e1', borderRadius: '4px', marginBottom: '0.6rem'}}></div>
                    <div style={{height: '10px', width: '40%', background: '#cbd5e1', borderRadius: '4px', marginBottom: '1.5rem'}}></div>
                    <div style={{height: '24px', width: '60%', background: '#f1f5f9', borderRadius: '6px', border: '1px solid #e2e8f0'}}></div>
                  </div>
                </div>
                <div style={{marginTop: '2rem', height: '60px', width: '100%', background: 'repeating-linear-gradient(45deg, #f8fafc 0, #f8fafc 10px, #fff 10px, #fff 20px)', border: '1px solid #f1f5f9', borderRadius: '8px'}}></div>
                <div style={{position: 'absolute', top: '1.5rem', right: '1.5rem', opacity: 0.1, fontSize: '5rem'}}>🇳🇵</div>
                <div style={{position: 'absolute', bottom: '1.5rem', right: '1.5rem', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600}}>GOVERNMENT OF NEPAL · {viewingDoc.type.toUpperCase()}</div>
              </div>
            </div>
            <div style={{padding: '1.25rem 1.5rem', borderTop: '1px solid var(--sm-gray-border)', background: '#fff', textAlign: 'right'}}>
              <button className="sm-btn sm-btn-primary" onClick={() => setViewingDoc(null)}>Done Reviewing</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

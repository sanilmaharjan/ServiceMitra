import React, { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import AdminNavbar from "../../Components/AdminNavbar";
import "../../Styles/Admin.css";

export default function AdminPayments() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const provider = location.state?.provider;

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank");
  const [note, setNote] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!amount || isNaN(amount) || Number(amount) <= 0) e.amount = "Enter a valid amount.";
    if (!method) e.method = "Select a payment method.";
    return e;
  };

  const handlePay = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1800);
  };

  const paymentMethods = [
    { value: "bank", label: "Bank Transfer", icon: "🏦" },
    { value: "esewa", label: "eSewa", icon: "💚" },
    { value: "khalti", label: "Khalti", icon: "🟣" },
    { value: "cash", label: "Cash", icon: "💵" },
  ];

  const recentPayments = [
    { date: "Mar 28, 2025", amount: 12000, method: "eSewa", status: "completed" },
    { date: "Feb 14, 2025", amount: 8500, method: "Bank Transfer", status: "completed" },
    { date: "Jan 30, 2025", amount: 9800, method: "Khalti", status: "completed" },
  ];

  return (
    <div className="admin-layout">
      <AdminNavbar
        backTo={-1}
        pageIcon="💳"
        pageTitle={provider ? `Pay — ${provider.name}` : "Process Payment"}
      />

      <main className="admin-main">
        <div className="payment-layout">
          <div className="payment-left">
            {success ? (
              <div className="payment-success-card">
                <div className="payment-success-icon">🎉</div>
                <h2>Payment Successful!</h2>
                <p>
                  <strong>NRS {Number(amount).toLocaleString()}</strong> has been sent to{" "}
                  <strong>{provider?.name || "the provider"}</strong> via{" "}
                  {paymentMethods.find((m) => m.value === method)?.label}.
                </p>
                {note && <div className="payment-success-note">Note: {note}</div>}
                <div className="payment-success-actions">
                  <button className="provider-btn-portfolio" onClick={() => { setSuccess(false); setAmount(""); setNote(""); }}>
                    Make Another Payment
                  </button>
                  <button className="admin-back-btn-lg" onClick={() => navigate("/admin")}>
                    Back to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div className="payment-form-card">
                <h2 className="payment-form-title">💳 New Payment</h2>

                {provider && (
                  <div className="payment-provider-info">
                    <div className="payment-provider-avatar">{provider.avatar}</div>
                    <div>
                      <div className="payment-provider-name">{provider.name}</div>
                      <div className="payment-provider-cat">{provider.category} · {provider.location}</div>
                    </div>
                    <div className="payment-provider-rating">⭐ {provider.rating}</div>
                  </div>
                )}

                <form onSubmit={handlePay} className="payment-form">
                  <div className="payment-field">
                    <label className="payment-label">Amount (NRS)</label>
                    <div className="payment-input-wrap">
                      <span className="payment-input-prefix">NRS</span>
                      <input
                        className={`payment-input ${errors.amount ? "input-error" : ""}`}
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="1"
                      />
                    </div>
                    {errors.amount && <span className="payment-error">{errors.amount}</span>}
                  </div>

                  <div className="payment-field">
                    <label className="payment-label">Payment Method</label>
                    <div className="payment-methods-grid">
                      {paymentMethods.map((m) => (
                        <div
                          key={m.value}
                          className={`payment-method-card ${method === m.value ? "selected" : ""}`}
                          onClick={() => setMethod(m.value)}
                        >
                          <span className="payment-method-icon">{m.icon}</span>
                          <span className="payment-method-label">{m.label}</span>
                        </div>
                      ))}
                    </div>
                    {errors.method && <span className="payment-error">{errors.method}</span>}
                  </div>

                  <div className="payment-field">
                    <label className="payment-label">Note (optional)</label>
                    <textarea
                      className="payment-textarea"
                      placeholder="Add a note for this payment..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <button className={`payment-submit-btn ${loading ? "loading" : ""}`} type="submit" disabled={loading}>
                    {loading ? <span className="payment-spinner">Processing...</span> : "Send Payment →"}
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="payment-right">
            <div className="payment-history-card">
              <h3 className="payment-history-title">📜 Payment History</h3>
              {provider && (
                <div className="payment-total-earnings">
                  <div className="payment-total-label">Total Earnings</div>
                  <div className="payment-total-value">NRS {provider.earnings?.toLocaleString()}</div>
                </div>
              )}
              <div className="payment-history-list">
                {recentPayments.map((p, i) => (
                  <div key={i} className="payment-history-item">
                    <div className="payment-history-left">
                      <div className="payment-history-date">{p.date}</div>
                      <div className="payment-history-method">{p.method}</div>
                    </div>
                    <div className="payment-history-right">
                      <div className="payment-history-amount">NRS {p.amount.toLocaleString()}</div>
                      <span className="admin-status-badge verified">{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="payment-summary-card">
              <h3 className="payment-history-title">📊 This Month</h3>
              <div className="payment-summary-grid">
                <div className="payment-summary-item">
                  <div className="payment-summary-value">3</div>
                  <div className="payment-summary-label">Payments</div>
                </div>
                <div className="payment-summary-item">
                  <div className="payment-summary-value">NRS 30.3K</div>
                  <div className="payment-summary-label">Total Paid</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

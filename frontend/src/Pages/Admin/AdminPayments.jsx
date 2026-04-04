import React, { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import AdminNavbar from "../../Components/AdminNavbar";
import "../../Styles/Admin.css";

const MOCK_UNPAID_PROVIDERS = [
  { id: 101, name: "Ramesh Sharma", avatar: "RS", category: "Electrical", location: "Kathmandu", rating: 4.8, balance: 12500, lastWork: "2 days ago" },
  { id: 102, name: "Sita Kumari", avatar: "SK", category: "Cleaning", location: "Lalitpur", rating: 4.5, balance: 4200, lastWork: "5 days ago" },
  { id: 103, name: "Bikram Thapa", avatar: "BT", category: "Painting", location: "Bhaktapur", rating: 4.2, balance: 18000, lastWork: "1 week ago" },
  { id: 104, name: "Maya Adhikari", avatar: "MA", category: "Plumbing", location: "Kathmandu", rating: 4.6, balance: 9500, lastWork: "3 days ago" },
];

export default function AdminPayments() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  // State for the selected provider (if we're on the payment form page)
  const [selectedProvider, setSelectedProvider] = React.useState(() => {
    if (location.state?.provider) return location.state.provider;
    if (id) {
        return MOCK_UNPAID_PROVIDERS.find(p => p.id === Number(id)) || null;
    }
    return null;
  });
  
  // Payment Form States
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
    setTimeout(() => { 
      setLoading(false); 
      setSuccess(true);
    }, 1500);
  };

  const paymentMethods = [
    { value: "bank", label: "Bank Transfer", icon: "🏦" },
    { value: "esewa", label: "eSewa", icon: "💚" },
    { value: "khalti", label: "Khalti", icon: "🟣" },
    { value: "cash", label: "Cash", icon: "💵" },
  ];

  const recentPayments = [
    { date: "Mar 28, 2025", name: "Sunil Shrestha", amount: 12000, method: "eSewa", status: "completed" },
    { date: "Feb 14, 2025", name: "Ramesh Sharma", amount: 8500, method: "Bank Transfer", status: "completed" },
    { date: "Jan 30, 2025", name: "Anita Rai", amount: 9800, method: "Khalti", status: "completed" },
  ];

  // --- Render Unpaid List ---
  if (!selectedProvider && !id) {
    return (
      <div className="admin-layout animate-fade">
        <AdminNavbar pageIcon="💳" pageTitle="Pending Payments" />
        <main className="admin-main">
          <div className="admin-page-header">
            <div>
              <h1 className="admin-page-title">Provider Payouts</h1>
              <p className="admin-page-subtitle">List of service providers with pending earnings</p>
            </div>
          </div>

          <div className="admin-table-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Category</th>
                  <th>Last Job</th>
                  <th>Pending Balance</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_UNPAID_PROVIDERS.map((p) => (
                  <tr key={p.id} className="admin-table-row">
                    <td>
                      <div className="admin-user-cell">
                        <div className="admin-avatar-sm" style={{background: 'var(--sm-navy)'}}>{p.avatar}</div>
                        <div>
                          <div className="admin-user-name">{p.name}</div>
                          <div className="admin-user-email">⭐ {p.rating}</div>
                        </div>
                      </div>
                    </td>
                    <td>{p.category}</td>
                    <td className="admin-td-muted">{p.lastWork}</td>
                    <td>
                      <strong style={{color: 'var(--sm-success)'}}>NRS {(p.balance ?? 0).toLocaleString()}</strong>
                    </td>
                    <td>
                      <button className="sm-btn sm-btn-primary" style={{padding: '0.4rem 1rem', fontSize: '0.75rem'}} 
                        onClick={() => setSelectedProvider(p)}>
                        Send Payment
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{marginTop: '2rem'}}>
            <h3 className="payment-history-title">📜 Recent Payouts</h3>
            <div className="admin-table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>To Provider</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((p, i) => (
                    <tr key={i}>
                      <td className="admin-td-muted">{p.date}</td>
                      <td className="admin-user-name">{p.name}</td>
                      <td><strong>NRS {(p.amount ?? 0).toLocaleString()}</strong></td>
                      <td>{p.method}</td>
                      <td><span className="admin-status-badge verified">{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --- Render Payment Form ---
  return (
    <div className="admin-layout animate-fade">
      <AdminNavbar 
        onBack={() => { setSelectedProvider(null); navigate("/admin/payments"); }}
        backLabel="← All Providers"
        pageIcon="💸"
        pageTitle={`Paying ${selectedProvider?.name || "Provider"}`}
      />

      <main className="admin-main">
        <div className="payment-layout">
          <div className="payment-left" style={{flex: '1.2'}}>
            {success ? (
              <div className="payment-success-card sm-card">
                <div className="payment-success-icon">🎉</div>
                <h2>Payment Successful!</h2>
                <p>
                  <strong>NRS {Number(amount).toLocaleString()}</strong> has been sent to{" "}
                  <strong>{selectedProvider?.name}</strong> via{" "}
                  {paymentMethods.find((m) => m.value === method)?.label}.
                </p>
                <div className="payment-success-actions">
                  <button className="sm-btn sm-btn-outline" onClick={() => { setSuccess(false); setAmount(""); setNote(""); }}>
                    Make Another
                  </button>
                  <button className="sm-btn sm-btn-secondary" onClick={() => setSelectedProvider(null)}>
                    Back to List
                  </button>
                </div>
              </div>
            ) : (
              <div className="payment-form-card sm-card">
                <h2 className="payment-form-title">💳 Process Payout</h2>
                
                <div className="payment-provider-info" style={{marginBottom: '1.5rem', background: 'var(--sm-navy-light)', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center'}}>
                  <div className="admin-avatar-sm" style={{width: '50px', height: '50px', fontSize: '1.2rem', background: 'var(--sm-navy)'}}>{selectedProvider?.avatar}</div>
                  <div>
                    <div className="admin-user-name" style={{fontSize: '1rem'}}>{selectedProvider?.name}</div>
                    <div className="admin-user-email">Pending Balance: <strong>NRS {(selectedProvider?.balance ?? 0).toLocaleString()}</strong></div>
                  </div>
                </div>

                <form onSubmit={handlePay} className="payment-form">
                  <div className="sm-input-group">
                    <label className="sm-label">Amount (NRS)</label>
                    <input
                      className={`sm-input ${errors.amount ? "input-error" : ""}`}
                      type="number"
                      placeholder="e.g. 5000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    {errors.amount && <span className="payment-error" style={{color: 'var(--sm-danger)', fontSize: '0.75rem'}}>{errors.amount}</span>}
                  </div>

                  <div className="sm-input-group">
                    <label className="sm-label">Method</label>
                    <div className="payment-methods-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem'}}>
                      {paymentMethods.map((m) => (
                        <div
                          key={m.value}
                          className={`payment-method-card ${method === m.value ? "selected" : ""}`}
                          onClick={() => setMethod(m.value)}
                          style={{
                            padding: '0.75rem', 
                            border: '1.5px solid var(--sm-gray-border)', 
                            borderRadius: '10px', 
                            cursor: 'pointer',
                            background: method === m.value ? 'var(--sm-orange-light)' : 'transparent',
                            borderColor: method === m.value ? 'var(--sm-orange)' : 'var(--sm-gray-border)'
                          }}
                        >
                          <span>{m.icon} {m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="sm-input-group">
                    <label className="sm-label">Note (Internal)</label>
                    <textarea
                      className="sm-input"
                      style={{minHeight: '80px'}}
                      placeholder="Reference number or reason..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>

                  <button className="sm-btn sm-btn-primary" style={{width: '100%', marginTop: '1rem'}} type="submit" disabled={loading}>
                    {loading ? "Processing..." : "Authorize Payout →"}
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="payment-right" style={{flex: '0.8'}}>
            <div className="sm-card" style={{height: '100%'}}>
              <h3 className="sm-label" style={{fontSize: '1rem', color: 'var(--sm-navy)'}}>Payout Instructions</h3>
              <p style={{fontSize: '0.85rem', color: 'var(--sm-text-mid)', lineHeight: '1.6'}}>
                Payments are processed within 24 hours of authorization. Ensure the provider's payment information is verified before sending.
              </p>
              <div style={{marginTop: '2rem', padding: '1rem', background: 'var(--sm-gray-light)', borderRadius: '10px'}}>
                <h4 style={{margin: '0 0 0.5rem', fontSize: '0.82rem'}}>Audit Log</h4>
                <div style={{fontSize: '0.75rem', color: 'var(--sm-text-light)'}}>
                  No recent changes for this provider.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

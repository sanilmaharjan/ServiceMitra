import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import AdminNavbar from "../../Components/AdminNavbar";
import "../../Styles/Admin.css";
import api from "../../utils/api";
import adminApi from "../../utils/adminApi";

export default function AdminPayments() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  const [unpaidProviders, setUnpaidProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedProvider, setSelectedProvider] = React.useState(null);
  
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank");
  const [note, setNote] = useState("");
  const [success, setSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [recentPayments, setRecentPayments] = useState([]);

  useEffect(() => {
    fetchPayoutData();
  }, []);

  const fetchPayoutData = async () => {
    try {
      setLoading(true);
      const [pendingRes, recentRes] = await Promise.all([
        adminApi.getPendingPayouts(),
        adminApi.getRecentPayouts()
      ]);
      setUnpaidProviders(pendingRes.data || []);
      setRecentPayments(recentRes.data || []);

      if (id) {
        const found = pendingRes.data.find(p => p.id === Number(id));
        if (found) setSelectedProvider(found);
      } else if (location.state?.provider) {
        setSelectedProvider(location.state.provider);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!amount || isNaN(amount) || Number(amount) <= 0) e.amount = "Enter a valid amount.";
    if (!method) e.method = "Select a payment method.";
    return e;
  };

  const handlePay = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setErrors({});
    
    try {
      setIsProcessing(true);
      await adminApi.createPayout({
        provider_id: selectedProvider.id,
        amount: Number(amount),
        method,
        note
      });
      setSuccess(true);
      alert("Payment authorized successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to authorize payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    { value: "bank", label: "Bank Transfer", icon: "🏦" },
    { value: "esewa", label: "eSewa", icon: "💚" },
    { value: "khalti", label: "Khalti", icon: "🟣" },
    { value: "cash", label: "Cash", icon: "💵" },
  ];

  if (loading) return <div className="admin-layout"><AdminNavbar /><main className="admin-main">Loading payout data...</main></div>;

  if (!selectedProvider && !id) {
    return (
      <div className="admin-layout animate-fade">
        <AdminNavbar backTo="/admin" pageIcon="💳" pageTitle="Pending Payments" />
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
                {unpaidProviders.length === 0 ? (
                  <tr><td colSpan={5} className="admin-empty">No pending payouts.</td></tr>
                ) : (
                  unpaidProviders.map((p) => (
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
                  ))
                )}
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

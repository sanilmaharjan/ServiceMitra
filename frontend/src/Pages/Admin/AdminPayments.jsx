import { useEffect, useState } from "react";
import AdminNavbar from "../../Components/AdminNavbar";
import "../../Styles/Admin.css";
import adminApi from "../../utils/adminApi";

export default function AdminPayments() {
  const [pendingProviders, setPendingProviders] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pendingRes, historyRes] = await Promise.all([
        adminApi.getPendingProviders(),
        adminApi.getPaymentHistory(),
      ]);
      setPendingProviders(pendingRes.data || []);
      setPaymentHistory(historyRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayProvider = async (providerId) => {
    if (!confirm("Are you sure you want to process this payment?")) return;
    try {
      await adminApi.payProvider(providerId, {});
      alert("Payment processed successfully!");
      await fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to process payment");
    }
  };

  return (
    <div className="admin-layout animate-fade">
      <AdminNavbar />
      <main className="sm-container sm-section">
        <header className="page-header" style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--sm-navy)", margin: 0 }}>
            Payment Management
          </h1>
          <p style={{ color: "var(--sm-text-mid)", marginTop: "0.5rem" }}>
            Manage provider payouts and view payment history.
          </p>
        </header>

        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", borderBottom: "1px solid var(--sm-gray-light)" }}>
            <button
              className={`sm-tab ${activeTab === "pending" ? "active" : ""}`}
              onClick={() => setActiveTab("pending")}
            >
              Pending Payments ({pendingProviders.length})
            </button>
            <button
              className={`sm-tab ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              Payment History ({paymentHistory.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="sm-card" style={{ textAlign: "center", padding: "3rem" }}>
            <p>Loading payment data...</p>
          </div>
        ) : activeTab === "pending" ? (
          <div>
            {pendingProviders.length === 0 ? (
              <div className="sm-card" style={{ textAlign: "center", padding: "3rem" }}>
                <p>No pending payments</p>
              </div>
            ) : (
              <div className="sm-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "1rem" }}>
                {pendingProviders.map((provider) => (
                  <div key={provider.id} className="sm-card" style={{ padding: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                      <div>
                        <h3 style={{ margin: "0 0 0.25rem", color: "var(--sm-navy)" }}>{provider.name}</h3>
                        <p style={{ margin: 0, color: "var(--sm-text-mid)", fontSize: "0.9rem" }}>{provider.email}</p>
                      </div>
                      <span className="sm-badge sm-badge-warning">Pending</span>
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                      <p style={{ margin: "0 0 0.5rem", fontWeight: 600 }}>
                        Amount Due: NRS {provider.pending_amount || 0}
                      </p>
                      <p style={{ margin: 0, color: "var(--sm-text-light)", fontSize: "0.9rem" }}>
                        Completed Jobs: {provider.completed_jobs || 0}
                      </p>
                    </div>
                    <button
                      className="sm-btn sm-btn-success"
                      onClick={() => handlePayProvider(provider.id)}
                      style={{ width: "100%" }}
                    >
                      Process Payment
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {paymentHistory.length === 0 ? (
              <div className="sm-card" style={{ textAlign: "center", padding: "3rem" }}>
                <p>No payment history</p>
              </div>
            ) : (
              <div className="sm-table-container">
                <table className="sm-table">
                  <thead>
                    <tr>
                      <th>Provider</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentHistory.map((payment) => (
                      <tr key={payment.id}>
                        <td>{payment.provider_name}</td>
                        <td>NRS {payment.amount}</td>
                        <td>{new Date(payment.created_at).toLocaleDateString()}</td>
                        <td>
                          <span className={`sm-badge ${payment.status === "completed" ? "sm-badge-success" : "sm-badge-warning"}`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
    

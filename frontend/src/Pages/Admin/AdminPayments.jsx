import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../Components/AdminNavbar";
import "../../Styles/Admin.css";

const API_BASE = 'http://127.0.0.1:8000/api';

const getToken = () => localStorage.getItem('access_token');

export default function AdminPayments() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");
  const [note, setNote] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    loadProviders();
    loadPaymentHistory();
  }, []);

  const loadProviders = async () => {
    setLoadingProviders(true);
    const token = getToken();
    
    if (!token) {
      setLoadingProviders(false);
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/jobs/?status=completed`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const jobs = await response.json();
        const providerMap = new Map();
        
        for (const job of jobs) {
          if (job.provider && job.payment_status !== 'released') {
            const providerId = job.provider.id;
            if (!providerMap.has(providerId)) {
              providerMap.set(providerId, {
                id: providerId,
                name: job.provider.name || job.provider.username,
                avatar: (job.provider.name || job.provider.username || 'P').slice(0,2).toUpperCase(),
                category: job.category?.name || 'General',
                balance: 0,
                jobs: []
              });
            }
            const provider = providerMap.get(providerId);
            provider.balance += Number(job.budget) * 0.93;
            provider.jobs.push(job);
          }
        }
        
        setProviders(Array.from(providerMap.values()));
      }
    } catch (error) {
      console.error("Error loading providers:", error);
      setProviders(MOCK_PROVIDERS);
    }
    setLoadingProviders(false);
  };

  const loadPaymentHistory = async () => {
    const token = getToken();
    if (!token) return;
    
    try {
      const response = await fetch(`${API_BASE}/payment/admin/payment-history/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPaymentHistory(data);
      }
    } catch (error) {
      console.error("Error loading history:", error);
    }
  };

  // KHALTI + CASH payment handler
  const handlePay = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setApiError("Enter a valid amount");
      return;
    }
    
    setApiError("");
    setLoading(true);
    
    const token = getToken();
    const jobId = selectedProvider.jobs?.[0]?.id || 1;
    
    try {
      if (method === 'khalti') {
        // Khalti payment - call backend
        const response = await fetch(`${API_BASE}/payment/initiate-khalti/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            amount: amount,
            job_id: jobId
          })
        });
        
        const data = await response.json();
        console.log("Khalti response:", data);
        
        if (data.payment_url) {
          // Redirect to Khalti payment page
          window.location.href = data.payment_url;
          return;
        } else {
          setApiError(data.error || "Failed to initiate Khalti payment");
          setLoading(false);
        }
      } else {
        // Cash payment
        alert(`Cash payment of Rs. ${amount} recorded for ${selectedProvider.name}`);
        setSelectedProvider(null);
        setAmount("");
        setLoading(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setApiError("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  const paymentMethods = [
    { value: "cash", label: "Cash", icon: "💵" },
    { value: "khalti", label: "Khalti", icon: "🟣" },
  ];

  const MOCK_PROVIDERS = [
    { id: 1, name: "Ramesh Sharma", avatar: "RS", category: "Electrical", balance: 12500, jobs: [{ id: 1 }] },
    { id: 2, name: "Sita Kumari", avatar: "SK", category: "Cleaning", balance: 4200, jobs: [{ id: 2 }] },
    { id: 3, name: "Bikram Thapa", avatar: "BT", category: "Painting", balance: 18000, jobs: [{ id: 3 }] },
  ];

  const displayProviders = providers.length > 0 ? providers : MOCK_PROVIDERS;

  if (!selectedProvider) {
    return (
      <div className="admin-layout animate-fade">
        <AdminNavbar pageIcon="💳" pageTitle="Provider Payouts" />
        <main className="admin-main">
          <div className="admin-page-header">
            <h1>Provider Payouts</h1>
            <p>Service providers with pending earnings</p>
          </div>
          <div className="admin-table-card">
            {loadingProviders ? (
              <div style={{textAlign:'center', padding:'2rem'}}>Loading...</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Provider</th>
                    <th>Category</th>
                    <th>Pending Balance</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayProviders.map(p => (
                    <tr key={p.id}>
                      <td><strong>{p.name}</strong></td>
                      <td>{p.category}</td>
                      <td style={{color:'green', fontWeight:'bold'}}>NRS {p.balance.toLocaleString()}</td>
                      <td>
                        <button 
                          className="sm-btn sm-btn-primary" 
                          onClick={() => setSelectedProvider(p)}
                        >
                          Pay Now
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout animate-fade">
      <AdminNavbar 
        onBack={() => setSelectedProvider(null)} 
        backLabel="← Back" 
        pageIcon="💸" 
        pageTitle={`Pay ${selectedProvider.name}`} 
      />
      <main className="admin-main">
        {success ? (
          <div style={{textAlign:'center', padding:'50px'}}>
            <h1 style={{color:'green'}}>✅ Payment Successful!</h1>
            <p>NRS {amount} sent to {selectedProvider.name}</p>
            <button 
              className="sm-btn sm-btn-outline" 
              onClick={() => { 
                setSuccess(false); 
                setSelectedProvider(null); 
                setAmount(""); 
              }}
            >
              Make Another
            </button>
          </div>
        ) : (
          <div style={{maxWidth:'500px', margin:'auto'}}>
            <div className="payment-form-card sm-card">
              <h2>Process Payout</h2>
              <p>
                <strong>{selectedProvider.name}</strong>
                <br/>
                Pending Balance: NRS {selectedProvider.balance.toLocaleString()}
              </p>
              
              {apiError && (
                <div style={{background:'#fee', color:'red', padding:'0.75rem', marginBottom:'1rem'}}>
                  {apiError}
                </div>
              )}
              
              <form onSubmit={handlePay}>
                <div className="sm-input-group">
                  <label>Amount (NRS)</label>
                  <input 
                    type="number" 
                    className="sm-input" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    required 
                  />
                  {errors.amount && <small style={{color:'red'}}>{errors.amount}</small>}
                </div>
                
                <div className="sm-input-group">
                  <label>Payment Method</label>
                  <select 
                    className="sm-input" 
                    value={method} 
                    onChange={(e) => setMethod(e.target.value)}
                  >
                    {paymentMethods.map(m => (
                      <option key={m.value} value={m.value}>{m.icon} {m.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="sm-input-group">
                  <label>Note (Optional)</label>
                  <textarea 
                    className="sm-input" 
                    rows="3" 
                    value={note} 
                    onChange={(e) => setNote(e.target.value)} 
                  />
                </div>
                
                <button 
                  className="sm-btn sm-btn-primary" 
                  style={{width:'100%'}} 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? "Processing..." : `Pay NRS ${amount || '0'}`}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SPNavbar from "../../Components/SPNavbar";
import "../../Styles/SP.css";
import { AuthContext } from "../../context/authContext";

export default function SPDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [availableJobs, setAvailableJobs] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBidModal, setShowBidModal] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidDays, setBidDays] = useState("");
  const [bidMessage, setBidMessage] = useState("");
  const [stats, setStats] = useState({
    activePosts: 0,
    totalBids: 0,
    earnings: 0,
  });
  const [filterLocation, setFilterLocation] = useState("all");

  // Provider's skills (categories they can work in)
  const providerSkills = ["Plumbing", "Electrical"];
  const providerLocation = "Kathmandu"; // Provider's base location
  
  // All demo jobs
  const allDemoJobs = [
    { id: 1, title: "Fix Leaky Pipe", description: "Water leaking from kitchen pipe.", budget: 2000, category_name: "Plumbing", city: "Kathmandu", status: "pending" },
    { id: 2, title: "Install New AC", description: "Need to install split AC.", budget: 5000, category_name: "Electrical", city: "Kathmandu", status: "pending" },
    { id: 3, title: "Bathroom Renovation", description: "Complete bathroom renovation.", budget: 15000, category_name: "Plumbing", city: "Lalitpur", status: "pending" },
    { id: 4, title: "House Cleaning", description: "Deep cleaning for 3BHK.", budget: 3000, category_name: "Cleaning", city: "Bhaktapur", status: "pending" },
    { id: 5, title: "Paint Living Room", description: "Paint entire living room.", budget: 8000, category_name: "Painting", city: "Pokhara", status: "pending" },
    { id: 6, title: "Water Heater Repair", description: "Geyser not working.", budget: 2500, category_name: "Plumbing", city: "Kathmandu", status: "pending" },
  ];

  // Filter jobs based on provider's skills AND location
  const getFilteredJobs = () => {
    let filtered = allDemoJobs.filter(job => providerSkills.includes(job.category_name));
    
    if (filterLocation === "nearby") {
      filtered = filtered.filter(job => job.city === providerLocation);
    }
    
    return filtered;
  };

  const demoBids = [
    { id: 1, job: { title: "Fix Leaky Pipe" }, amount: 1800, estimated_days: 2, status: "pending", message: "I can fix this quickly" },
    { id: 2, job: { title: "Install New AC" }, amount: 4500, estimated_days: 3, status: "accepted", message: "Professional installation" },
  ];

  useEffect(() => {
    setAvailableJobs(getFilteredJobs());
    setMyBids(demoBids);
    setStats({
      activePosts: getFilteredJobs().length,
      totalBids: demoBids.length,
      earnings: 4500,
    });
    setLoading(false);
  }, [filterLocation]);

  const placeBid = async (jobId) => {
    if (!bidAmount || !bidDays) {
      alert("Please enter amount and days");
      return;
    }
    
    alert(`Demo: Bid of Rs. ${bidAmount} placed on job!`);
    setShowBidModal(null);
    setBidAmount("");
    setBidDays("");
    setBidMessage("");
  };

  const PROVIDER_NAME = "Ram Provider";

  if (loading) {
    return (
      <div className="provider-layout">
        <SPNavbar providerName={PROVIDER_NAME} />
        <div style={{ padding: "50px", textAlign: "center" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="provider-layout animate-fade">
      <SPNavbar providerName={PROVIDER_NAME} />

      <main className="sm-container sm-section">
        <header className="page-header" style={{marginBottom: '2.5rem'}}>
          <h1 style={{fontSize: '2rem', fontWeight: 800, color: 'var(--sm-navy)', margin: 0}}>Provider Dashboard</h1>
          <p style={{color: 'var(--sm-text-mid)', marginTop: '0.4rem'}}>Your Skills: Plumbing, Electrical | Location: Kathmandu</p>
        </header>

        <section className="sm-card" style={{padding: '2rem', marginBottom: '2.5rem', background: 'linear-gradient(135deg, var(--sm-navy), #1e293b)', color: '#fff'}}>
          <div>
            <h2 style={{fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem'}}>Welcome back, Ram!</h2>
            <p style={{margin: 0, opacity: 0.8, fontSize: '0.95rem'}}>You have {availableJobs.length} job matches based on your skills & location.</p>
          </div>
        </section>

        {/* Location Filter */}
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ fontWeight: 600 }}>Filter by Location:</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => setFilterLocation("all")}
              style={{ 
                padding: '8px 16px', 
                background: filterLocation === 'all' ? '#f4a261' : '#e2e8f0',
                color: filterLocation === 'all' ? 'white' : 'black',
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer' 
              }}
            >
              All Locations
            </button>
            <button 
              onClick={() => setFilterLocation("nearby")}
              style={{ 
                padding: '8px 16px', 
                background: filterLocation === 'nearby' ? '#f4a261' : '#e2e8f0',
                color: filterLocation === 'nearby' ? 'white' : 'black',
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer' 
              }}
            >
              Nearby (Kathmandu)
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="sm-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginBottom: '2.5rem'}}>
          <div className="sm-card" style={{padding: '1.75rem'}}>
            <div style={{fontSize: '2.5rem', fontWeight: 900, color: 'var(--sm-navy)', marginBottom: '0.25rem'}}>{availableJobs.length}</div>
            <h3 style={{margin: 0}}>Jobs Matching</h3>
            <p style={{fontSize: '0.85rem', color: 'var(--sm-text-light)'}}>Based on your skills & location</p>
          </div>
          <div className="sm-card" style={{padding: '1.75rem'}}>
            <div style={{fontSize: '2.5rem', fontWeight: 900, color: 'var(--sm-navy)', marginBottom: '0.25rem'}}>{myBids.length}</div>
            <h3 style={{margin: 0}}>My Bids</h3>
            <p style={{fontSize: '0.85rem', color: 'var(--sm-text-light)'}}>Proposals sent</p>
          </div>
          <div className="sm-card" style={{padding: '1.75rem'}}>
            <div style={{fontSize: '2.5rem', fontWeight: 900, color: 'var(--sm-navy)', marginBottom: '0.25rem'}}>NRS {stats.earnings}</div>
            <h3 style={{margin: 0}}>Total Earnings</h3>
            <p style={{fontSize: '0.85rem', color: 'var(--sm-text-light)'}}>From completed jobs</p>
          </div>
        </div>

        {/* Available Jobs Section */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Jobs Matching Your Skills</h2>
          {availableJobs.length === 0 ? (
            <div className="sm-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p>No jobs matching your skills and location right now.</p>
            </div>
          ) : (
            <div className="sm-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'}}>
              {availableJobs.map(job => (
                <div key={job.id} className="sm-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', padding: '4px 8px', background: '#22c55e', color: 'white', borderRadius: '20px' }}>{job.category_name}</span>
                    {job.city === providerLocation && (
                      <span style={{ fontSize: '0.7rem', padding: '4px 8px', background: '#3b82f6', color: 'white', borderRadius: '20px' }}>📍 Nearby</span>
                    )}
                  </div>
                  <h3>{job.title}</h3>
                  <p>{job.description?.substring(0, 100)}...</p>
                  <p><strong>Budget:</strong> Rs. {job.budget}</p>
                  <p><strong>Location:</strong> {job.city}</p>
                  <button 
                    className="sm-btn sm-btn-primary" 
                    style={{ width: '100%', marginTop: '1rem' }}
                    onClick={() => setShowBidModal(job)}
                  >
                    Place Bid
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* My Bids Section */}
        <section>
          <h2 style={{ marginBottom: '1rem' }}>My Bids</h2>
          {myBids.length === 0 ? (
            <div className="sm-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p>You haven't placed any bids yet.</p>
            </div>
          ) : (
            <div className="sm-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'}}>
              {myBids.map(bid => (
                <div key={bid.id} className="sm-card" style={{ padding: '1.5rem' }}>
                  <h3>{bid.job?.title || 'Job'}</h3>
                  <p><strong>My Bid:</strong> Rs. {bid.amount}</p>
                  <p><strong>Estimated Days:</strong> {bid.estimated_days} days</p>
                  <p><strong>Status:</strong> 
                    <span style={{ 
                      marginLeft: "10px", 
                      padding: "4px 12px", 
                      borderRadius: "20px", 
                      background: bid.status === 'accepted' ? '#22c55e' : bid.status === 'rejected' ? '#ef4444' : '#f4a261',
                      color: "white",
                      fontSize: "12px"
                    }}>
                      {bid.status}
                    </span>
                  </p>
                  {bid.status === 'accepted' && (
                    <button 
                      className="sm-btn sm-btn-primary"
                      style={{ width: '100%', marginTop: '1rem', background: '#3b82f6' }}
                      onClick={() => alert("Demo: Start working on this job")}
                    >
                      Start Working
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Bid Modal */}
      {showBidModal && (
        <div className="sm-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="sm-card" style={{ maxWidth: '450px', width: '90%', padding: '2rem' }}>
            <h2>Place Bid on: {showBidModal.title}</h2>
            <div style={{ marginBottom: '15px' }}>
              <label>Amount (NRS)</label>
              <input 
                type="number" 
                className="sm-input"
                value={bidAmount} 
                onChange={e => setBidAmount(e.target.value)} 
                placeholder="e.g., 5000"
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Estimated Days</label>
              <input 
                type="number" 
                className="sm-input"
                value={bidDays} 
                onChange={e => setBidDays(e.target.value)} 
                placeholder="e.g., 3"
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Message (Optional)</label>
              <textarea 
                className="sm-input"
                value={bidMessage} 
                onChange={e => setBidMessage(e.target.value)} 
                style={{ minHeight: '80px' }}
                placeholder="Add a message to the client..."
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="sm-btn sm-btn-primary" style={{ flex: 1 }} onClick={() => placeBid(showBidModal.id)}>Submit Bid</button>
              <button className="sm-btn sm-btn-outline" style={{ flex: 1 }} onClick={() => setShowBidModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
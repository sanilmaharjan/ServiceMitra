import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SPNavbar from "../../Components/SPNavbar";
import "../../Styles/SP.css";
import { AuthContext } from "../../context/authContext";
import bidsApi from "../../utils/bidsApi";
import jobsApi from "../../utils/jobsApi";

export default function SPDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidMessage, setBidMessage] = useState("");
  const [submittingBid, setSubmittingBid] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const [jobsRes, bidsRes] = await Promise.all([
        jobsApi.getAvailableJobs(),
        bidsApi.getMyBids(),
      ]);
      setPosts(jobsRes.data || []);
      setBids(bidsRes.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load provider dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBidSubmit = async () => {
    if (!bidAmount || Number(bidAmount) <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }

    try {
      setSubmittingBid(true);
      await bidsApi.createBid(selectedPost.id, {
        amount: Number(bidAmount),
        message: bidMessage,
        estimated_days: 1,
      });
      await fetchDashboard();
      setSelectedPost(null);
      setBidAmount("");
      setBidMessage("");
      alert("Bid placed successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to place bid.");
    } finally {
      setSubmittingBid(false);
    }
  };

  const handleJobAction = async (jobId, action) => {
    try {
      if (action === 'start') {
        await jobsApi.startJob(jobId);
        alert("Job started successfully!");
      } else if (action === 'complete') {
        await jobsApi.completeJob(jobId);
        alert("Job marked as completed!");
      }
      await fetchDashboard();
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action} job.`);
    }
  };

  const PROVIDER_NAME = user?.name || "Provider";
  const pendingBids = bids.filter((bid) => bid.status === "pending").length;
  const acceptedBids = bids.filter((bid) => bid.status === "accepted").length;
  const rejectedBids = bids.filter((bid) => bid.status === "rejected").length;

  const openJobs = posts.filter(job => job.status === 'open');
  const assignedJobs = posts.filter(job => job.status === 'assigned' || job.status === 'in_progress' || job.status === 'completed');

  return (
    <div className="provider-layout animate-fade">
      <SPNavbar providerName={PROVIDER_NAME} />

      <main className="sm-container sm-section">
        <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--sm-navy)', margin: 0 }}>Provider Dashboard</h1>
            <p style={{ color: 'var(--sm-text-mid)', marginTop: '0.5rem' }}>Browse open jobs, place bids, and manage your proposals.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button className="sm-btn sm-btn-secondary" onClick={() => navigate('/provider/bids')}>
              View My Bids
            </button>
            <button className="sm-btn sm-btn-ghost" onClick={fetchDashboard}>
              Refresh
            </button>
          </div>
        </header>

        {error && (
          <div className="sm-card" style={{ marginBottom: '1.5rem', padding: '1rem', borderLeft: '4px solid #dc2626' }}>
            <p style={{ margin: 0, color: '#7f1d1d' }}>{error}</p>
          </div>
        )}

        <section className="dashboard-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="sm-card" style={{ padding: '1.5rem' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--sm-text-light)' }}>Open Jobs</p>
            <h2 style={{ margin: '0.75rem 0 0', fontSize: '2rem', color: 'var(--sm-navy)' }}>{openJobs.length}</h2>
          </div>
          <div className="sm-card" style={{ padding: '1.5rem' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--sm-text-light)' }}>Assigned Jobs</p>
            <h2 style={{ margin: '0.75rem 0 0', fontSize: '2rem', color: 'var(--sm-navy)' }}>{assignedJobs.length}</h2>
          </div>
          <div className="sm-card" style={{ padding: '1.5rem' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--sm-text-light)' }}>Pending Proposals</p>
            <h2 style={{ margin: '0.75rem 0 0', fontSize: '2rem', color: 'var(--sm-navy)' }}>{pendingBids}</h2>
          </div>
          <div className="sm-card" style={{ padding: '1.5rem' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--sm-text-light)' }}>Accepted Proposals</p>
            <h2 style={{ margin: '0.75rem 0 0', fontSize: '2rem', color: 'var(--sm-navy)' }}>{acceptedBids}</h2>
          </div>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--sm-navy)', margin: 0 }}>Open Jobs to Bid</h2>
              <p style={{ color: 'var(--sm-text-mid)', marginTop: '0.5rem' }}>Choose a job and submit a proposal directly from your dashboard.</p>
            </div>
            <span className="sm-badge sm-badge-info">{openJobs.length} available</span>
          </div>

          {loading ? (
            <div className="sm-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ margin: 0, color: 'var(--sm-text-light)' }}>Loading available jobs...</p>
            </div>
          ) : openJobs.length === 0 ? (
            <div className="sm-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ margin: 0, color: 'var(--sm-text-light)' }}>No open jobs available right now. Check back soon or refresh the page.</p>
            </div>
          ) : (
            <div className="sm-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
              {openJobs.map((job) => (
                <div key={job.id} className="sm-card animate-fade" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <span className={`sm-badge ${job.status === 'open' ? 'sm-badge-success' : 'sm-badge-warning'}`}>
                      {job.status || 'open'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--sm-text-light)' }}>{job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}</span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.75rem', color: 'var(--sm-navy)' }}>{job.title || 'Untitled Job'}</h3>
                  <p style={{ margin: 0, color: 'var(--sm-text-mid)', fontSize: '0.95rem', lineHeight: 1.6, minHeight: '3.5rem' }}>{job.description || 'No description available.'}</p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                    <span className="sm-pill" style={{ background: '#eff6ff', color: '#1d4ed8' }}>{job.category_name || job.category || 'General'}</span>
                    {job.budget > 0 && <span className="sm-pill" style={{ background: '#f0fdf4', color: '#166534' }}>NRS {job.budget}</span>}
                    {job.location && <span className="sm-pill" style={{ background: '#fffbeb', color: '#92400e' }}>{job.location}</span>}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
                    <button className="sm-btn sm-btn-primary" onClick={() => setSelectedPost(job)}>
                      Place Bid
                    </button>
                    <button className="sm-btn sm-btn-ghost" onClick={() => navigate(`/provider/posts`)}>
                      View Job List
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {assignedJobs.length > 0 && (
          <section style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--sm-navy)', margin: 0 }}>My Assigned Jobs</h2>
                <p style={{ color: 'var(--sm-text-mid)', marginTop: '0.5rem' }}>Manage your active and completed projects.</p>
              </div>
              <span className="sm-badge sm-badge-warning">{assignedJobs.length} assigned</span>
            </div>

            <div className="sm-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
              {assignedJobs.map((job) => (
                <div key={job.id} className="sm-card animate-fade" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <span className={`sm-badge ${job.status === 'assigned' ? 'sm-badge-info' : job.status === 'in_progress' ? 'sm-badge-warning' : 'sm-badge-success'}`}>
                      {job.status === 'assigned' ? 'Assigned' : job.status === 'in_progress' ? 'In Progress' : 'Completed'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--sm-text-light)' }}>{job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}</span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.75rem', color: 'var(--sm-navy)' }}>{job.title || 'Untitled Job'}</h3>
                  <p style={{ margin: 0, color: 'var(--sm-text-mid)', fontSize: '0.95rem', lineHeight: 1.6, minHeight: '3.5rem' }}>{job.description || 'No description available.'}</p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                    <span className="sm-pill" style={{ background: '#eff6ff', color: '#1d4ed8' }}>{job.category_name || job.category || 'General'}</span>
                    {job.budget > 0 && <span className="sm-pill" style={{ background: '#f0fdf4', color: '#166534' }}>NRS {job.budget}</span>}
                    {job.location && <span className="sm-pill" style={{ background: '#fffbeb', color: '#92400e' }}>{job.location}</span>}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
                    {job.status === 'assigned' && (
                      <button className="sm-btn sm-btn-success" onClick={() => handleJobAction(job.id, 'start')}>
                        Start Job
                      </button>
                    )}
                    {job.status === 'in_progress' && (
                      <button className="sm-btn sm-btn-primary" onClick={() => handleJobAction(job.id, 'complete')}>
                        Mark Complete
                      </button>
                    )}
                    {job.status === 'completed' && (
                      <span className="sm-text-success">Job Completed</span>
                    )}
                    <button className="sm-btn sm-btn-outline" onClick={() => navigate(`/user/posts/${job.id}`)}>
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {selectedPost && (
        <div className="sm-overlay animate-fade" onClick={() => setSelectedPost(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 1000 }}>
          <div className="sm-card" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '520px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--sm-navy)' }}>Place a Bid</h3>
                <p style={{ margin: '0.6rem 0 0', color: 'var(--sm-text-mid)' }}>{selectedPost.title}</p>
              </div>
              <button className="sm-btn-ghost" onClick={() => setSelectedPost(null)}>✕</button>
            </div>

            <div className="sm-input-group">
              <label className="sm-label">Proposal Amount (NRS)</label>
              <input className="sm-input" type="number" min="0" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} placeholder="Enter your bid amount" />
            </div>
            <div className="sm-input-group">
              <label className="sm-label">Message to Client</label>
              <textarea className="sm-input" style={{ minHeight: '120px' }} value={bidMessage} onChange={(e) => setBidMessage(e.target.value)} placeholder="Add a short note or proposal details." />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.25rem' }}>
              <button className="sm-btn sm-btn-outline" onClick={() => setSelectedPost(null)}>Cancel</button>
              <button className="sm-btn sm-btn-primary" onClick={handleBidSubmit} disabled={submittingBid || !bidAmount}>
                {submittingBid ? 'Submitting...' : 'Submit Bid'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
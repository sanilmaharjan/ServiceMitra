import { useContext, useEffect, useState } from "react";
import Footer from "../../Components/Footer";
import UserNavbar from "../../Components/UserNavbar";
import "../../Styles/Global.css";
import { AuthContext } from "../../context/authContext";
import jobsApi from "../../utils/jobsApi";
import reviewsApi from "../../utils/reviewsApi";

export default function UserHistory() {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewingJob, setReviewingJob] = useState(null);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await jobsApi.getJobHistory();
      setJobs(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    try {
      const reviewData = {
        rating,
        comment,
      };
      await reviewsApi.createReview(reviewingJob.id, reviewData);

      setJobs(prev => prev.map(j =>
        j.id === reviewingJob.id
          ? { ...j, review: { rating, comment, anonymous: isAnonymous } }
          : j
      ));
      setReviewingJob(null);
      setRating(0);
      setComment("");
      setIsAnonymous(false);
      alert("Review submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit review.");
    }
  };

  const USER_NAME = user?.name || "User";

  return (
    <div className="d-flex flex-column min-vh-100 animate-fade">
      <UserNavbar userName="Aarav Sharma" backTo="/user" />

      <main className="sm-container sm-section">
        <header style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--sm-navy)', margin: 0 }}>Project History</h1>
          <p style={{ color: 'var(--sm-text-mid)', marginTop: '0.4rem' }}>Review your past projects and provide feedback.</p>
        </header>

        <div className="sm-history-grid">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Loading project history...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: 'red' }}>{error}</p>
              <button onClick={fetchHistory} className="sm-btn sm-btn-primary">Retry</button>
            </div>
          ) : jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No jobs found. Your active jobs will appear here.</p>
            </div>
          ) : (
            <div className="sm-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem'}}>
              {jobs.map((job) => (
                <div key={job.id} className="sm-card animate-fade" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--sm-navy)' }}>{job.title}</h3>
                      <div style={{ fontSize: '0.85rem', color: 'var(--sm-text-mid)', marginTop: '0.35rem' }}>{job.category_name || job.category}</div>
                    </div>
                    <span className={`sm-badge ${job.status === 'pending' ? 'sm-badge-warning' : 'sm-badge-success'}`} style={{ textTransform: 'capitalize' }}>{job.status}</span>
                  </div>

                  <p style={{ fontSize: '0.95rem', color: 'var(--sm-text-mid)', marginBottom: '1rem', minHeight: '3rem' }}>{job.description}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--sm-text-light)' }}>
                      <div><strong>Budget:</strong> NPR {job.budget}</div>
                      <div><strong>Location:</strong> {job.city || job.address}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--sm-text-light)' }}>{new Date(job.created_at || job.preferred_start_date).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* --- Review Modal --- */}
      {reviewingJob && (
        <div className="sm-overlay animate-fade" onClick={() => setReviewingJob(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="sm-card" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: '450px', padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--sm-navy)', marginBottom: '0.5rem' }}>Rate Service</h2>
            <p style={{ color: 'var(--sm-text-mid)', fontSize: '0.9rem', marginBottom: '2rem' }}>How was your experience with <strong>{reviewingJob.provider}</strong>?</p>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '2.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    style={{ cursor: 'pointer', color: star <= rating ? '#f59e0b' : '#e2e8f0', transition: 'color 0.2s' }}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--sm-text-light)', marginTop: '0.5rem' }}>Tap to rate</div>
            </div>

            <div className="sm-input-group">
              <label className="sm-label">Your Review</label>
              <textarea
                className="sm-input"
                style={{ minHeight: '100px' }}
                placeholder="Share more details about the service..."
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: '2rem', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={e => setIsAnonymous(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.9rem', color: 'var(--sm-text-mid)', fontWeight: 500 }}>Post review anonymously</span>
            </label>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="sm-btn sm-btn-outline" style={{ flex: 1 }} onClick={() => setReviewingJob(null)}>Cancel</button>
              <button
                className="sm-btn sm-btn-primary"
                style={{ flex: 1 }}
                disabled={!rating}
                onClick={handleSubmitReview}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

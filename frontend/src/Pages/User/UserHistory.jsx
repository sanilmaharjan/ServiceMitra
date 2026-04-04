import React, { useState } from "react";
import UserNavbar from "../../Components/UserNavbar";
import Footer from "../../Components/Footer";
import "../../Styles/Global.css";

const COMPLETED_JOBS = [
  { id: 1, title: "AC Maintenance", provider: "Ramesh Sharma", date: "Apr 2, 2025", amount: 2500, status: "completed", review: null },
  { id: 2, title: "Kitchen Deep Cleaning", provider: "Sita Kumari", date: "Mar 25, 2025", amount: 1800, status: "completed", review: { rating: 5, comment: "Excellent service!" } },
  { id: 3, title: "Garden Fencing", provider: "Bikas Rai", date: "Mar 10, 2025", amount: 15000, status: "completed", review: null },
];

export default function UserHistory() {
  const [jobs, setJobs] = useState(COMPLETED_JOBS);
  const [reviewingJob, setReviewingJob] = useState(null);

  // Review Form State
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmitReview = () => {
    setJobs(prev => prev.map(j =>
      j.id === reviewingJob.id
        ? { ...j, review: { rating, comment, anonymous: isAnonymous } }
        : j
    ));
    setReviewingJob(null);
    setRating(0);
    setComment("");
    setIsAnonymous(false);
  };

  return (
    <div className="d-flex flex-column min-vh-100 animate-fade">
      <UserNavbar userName="Aarav Sharma" backTo="/user" />

      <main className="sm-container sm-section">
        <header style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--sm-navy)', margin: 0 }}>Project History</h1>
          <p style={{ color: 'var(--sm-text-mid)', marginTop: '0.4rem' }}>Review your past projects and provide feedback.</p>
        </header>

        <div className="sm-history-grid">
          {jobs.map((job) => (
            <div key={job.id} className="sm-history-card animate-fade">
              <div className="sm-history-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div>
                    <div className="sm-badge sm-badge-info" style={{ marginBottom: '0.6rem', fontSize: '0.65rem' }}>Project ID: #SM-{job.id}0{job.id}</div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--sm-navy)', margin: 0 }}>{job.title}</h3>
                    <div style={{ fontSize: '0.9rem', color: 'var(--sm-text-mid)', marginTop: '0.4rem' }}>
                       with <strong style={{color: 'var(--sm-navy)'}}>{job.provider}</strong>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--sm-orange)' }}>NRS {job.amount.toLocaleString()}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--sm-text-light)', marginTop: '0.25rem' }}>{job.date}</div>
                  </div>
                </div>

                {job.review && (
                  <div style={{ padding: '1rem', background: 'var(--sm-navy-light)', borderRadius: '12px', marginTop: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <div style={{ color: '#f59e0b', fontSize: '1.1rem' }}>
                        {"★".repeat(job.review.rating)}{"☆".repeat(5 - job.review.rating)}
                      </div>
                      {job.review.anonymous && <span className="sm-badge" style={{ fontSize: '0.6rem', background: 'var(--sm-navy)', color: '#fff' }}>Anonymous</span>}
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--sm-navy)', margin: 0, fontStyle: 'italic' }}>"{job.review.comment}"</p>
                  </div>
                )}
              </div>

              <div className="sm-history-card-footer">
                {!job.review ? (
                  <button className="sm-btn sm-btn-primary" style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }} onClick={() => setReviewingJob(job)}>
                    Leave a Feedback
                  </button>
                ) : (
                  <span className="sm-badge sm-badge-success" style={{border: '1.5px solid var(--sm-success)'}}>✅ Feedback Received</span>
                )}
              </div>
            </div>
          ))}
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

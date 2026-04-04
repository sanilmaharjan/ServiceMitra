import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../Components/UserNavbar";
import "../../Styles/User.css";
import { AuthContext } from "../../context/authContext";
import api from "../../utils/api";
import jobsApi from "../../utils/jobsApi";
import categoriesApi from "../../utils/categoriesApi";

const CATEGORIES = [
  "Electrical", "Plumbing", "Painting", "Carpentry", "Cleaning",
  "Gardening", "Appliance Repair", "Electronics", "Beauty & Wellness", "Other",
];

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [urgency, setUrgency] = useState("normal");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsApi.getMyJobs();
      setPosts(response.data || []);
    } catch (err) {
      setError("Failed to load your service requests.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const canPost = title.trim().length > 0 && description.trim().length > 0 && category;

  const handlePost = async () => {
    if (!canPost) return;
    try {
      setSubmitting(true);
      
      const categories = await categoriesApi.getCategories();
      const selectedCategory = categories.data?.find(c => c.name === category);
      
      const newJobData = {
        title: title.trim(),
        description: description.trim(),
        category: selectedCategory ? selectedCategory.id : 1,
        budget: budget ? parseFloat(budget) : 0,
        address: location || "Not specified",
        city: location || "Not specified",
        preferred_start_date: new Date().toISOString().split('T')[0],
        preferred_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };
      const response = await jobsApi.createJob(newJobData);
      setPosts((prev) => [response.data, ...prev]);
      setTitle(""); setDescription(""); setCategory(""); setBudget(""); setLocation(""); setUrgency("normal");
      setIsOpen(false);
      alert("Job posted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to post job. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const USER_NAME = user?.name || "User";
  const USER_INITIALS = USER_NAME.split(" ").map(n => n[0]).join("").toUpperCase();

  return (
    <div className="user-layout animate-fade">
      <UserNavbar userName={USER_NAME} />

      <main className="sm-container sm-section">
        <header className="page-header" style={{marginBottom: '2rem'}}>
          <h1 style={{fontSize: '2rem', fontWeight: 800, color: 'var(--sm-navy)', margin: 0}}>Service Requests</h1>
          <p style={{color: 'var(--sm-text-mid)', marginTop: '0.5rem'}}>Manage your active jobs and find the best professionals.</p>
        </header>

        {/* --- Simplified Composer --- */}
        <section className="composer-section" style={{marginBottom: '3rem'}}>
          {!isOpen ? (
            <div className="sm-card" onClick={() => setIsOpen(true)} style={{cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem'}}>
              <div className="avatar-circle" style={{width: '40px', height: '40px', background: 'var(--sm-navy)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800}}>{USER_INITIALS}</div>
              <div style={{color: 'var(--sm-text-light)', fontSize: '0.95rem'}}>What service do you need today, {USER_NAME.split(" ")[0]}?</div>
              <button className="sm-btn sm-btn-primary" style={{marginLeft: 'auto', padding: '0.5rem 1.25rem'}}>Create Post</button>
            </div>
          ) : (
            <div className="sm-card animate-fade" style={{padding: '2rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                <h3 style={{margin: 0, fontSize: '1.1rem', color: 'var(--sm-navy)'}}>New Service Request</h3>
                <button className="sm-btn-ghost" onClick={() => setIsOpen(false)}>✕</button>
              </div>

              <div className="sm-grid" style={{gridTemplateColumns: '1fr 1fr'}}>
                <div className="sm-input-group" style={{gridColumn: '1 / -1'}}>
                  <label className="sm-label">Project Title *</label>
                  <input className="sm-input" placeholder="e.g. Repair Kitchen Sink" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="sm-input-group" style={{gridColumn: '1 / -1'}}>
                  <label className="sm-label">Details *</label>
                  <textarea className="sm-input" style={{minHeight: '100px'}} placeholder="Describe the problem..." value={description} onChange={e => setDescription(e.target.value)} />
                </div>
                <div className="sm-input-group">
                  <label className="sm-label">Category *</label>
                  <select className="sm-input" value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="">Select Category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="sm-input-group">
                  <label className="sm-label">Urgency</label>
                  <select className="sm-input" value={urgency} onChange={e => setUrgency(e.target.value)}>
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem'}}>
                <button className="sm-btn sm-btn-outline" onClick={() => setIsOpen(false)}>Cancel</button>
                <button className="sm-btn sm-btn-primary" onClick={handlePost} disabled={!canPost || submitting}>
                  {submitting ? 'Posting...' : 'Post Request'}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* --- Active Posts --- */}
        <section className="posts-section">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
            <h2 style={{fontSize: '1.25rem', fontWeight: 700, color: 'var(--sm-navy)', margin: 0}}>Active Requests</h2>
            <div className="sm-badge sm-badge-info">{posts.length} Active</div>
          </div>

          <div className="sm-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'}}>
            {posts.map(post => (
              <div key={post.id} className="sm-card" onClick={() => navigate(`/user/posts/${post.id}`, { state: { post } })} style={{cursor: 'pointer', padding: '1.5rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem'}}>
                  <span className={`sm-badge ${post.status === 'open' ? 'sm-badge-success' : 'sm-badge-warning'}`}>{post.status}</span>
                  <span style={{fontSize: '0.8rem', color: 'var(--sm-text-light)'}}>{post.postedAt}</span>
                </div>
                <h3 style={{fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem', color: 'var(--sm-text-dark)'}}>{post.title}</h3>
                <p style={{fontSize: '0.9rem', color: 'var(--sm-text-mid)', lineClamp: '2', webkitLineClamp: '2', display: '-webkit-box', webkitBoxOrient: 'vertical', overflow: 'hidden', margin: '0 0 1.25rem', lineHeight: '1.5'}}>{post.description}</p>
                
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--sm-gray-border)'}}>
                  <div style={{display: 'flex', gap: '0.5rem'}}>
                    <span style={{fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '4px', background: 'var(--sm-gray-light)'}}>{post.category}</span>
                    {post.urgency === 'urgent' && <span style={{fontSize: '0.75rem', fontWeight: 700, color: 'var(--sm-danger)'}}>Urgent</span>}
                  </div>
                  <div style={{fontSize: '0.85rem', color: 'var(--sm-navy)', fontWeight: 600}}>🏷️ {post.bidCount} Bids</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

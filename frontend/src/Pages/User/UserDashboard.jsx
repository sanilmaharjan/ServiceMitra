import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../Components/UserNavbar";
import "../../Styles/User.css";
import { AuthContext } from "../../context/authContext";
import categoriesApi from "../../utils/categoriesApi";
import jobsApi from "../../utils/jobsApi";

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState(() => jobsApi.getCachedJobs() || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableCategories, setAvailableCategories] = useState(() => categoriesApi.getCachedCategories() || []);

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [urgency, setUrgency] = useState("normal");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const cachedJobs = jobsApi.getCachedJobs();
      if (cachedJobs?.length) {
        setPosts(cachedJobs);
        setLoading(false);
      }

      const cachedCategories = categoriesApi.getCachedCategories();
      if (cachedCategories?.length) {
        setAvailableCategories(cachedCategories);
      }

      await Promise.all([fetchJobs(), fetchCategories()]);
    } catch (err) {
      setError("Failed to load data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    const response = await jobsApi.getMyJobs();
    setPosts(response.data || []);
  };

  const fetchCategories = async () => {
    const response = await categoriesApi.getCategories();
    setAvailableCategories(response.data || []);
  };

  const canPost = title.trim().length > 0 && description.trim().length > 0 && category;

  const handlePost = async () => {
    if (!canPost) return;
    try {
      setSubmitting(true);
      
      const selectedCategory = availableCategories.find(c => c.name === category);
      
      if (!selectedCategory) {
        alert("Please select a valid category");
        return;
      }
      
      const newJobData = {
        title: title.trim(),
        description: description.trim(),
        category: selectedCategory.id,
        budget: budget ? parseFloat(budget) : 0,
        address: location || "Not specified",
        city: location || "Not specified",
        preferred_start_date: new Date().toISOString().split('T')[0],
        preferred_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };
      await jobsApi.createJob(newJobData);
      await fetchJobs(); // Refetch to get updated list with correct data
      setTitle(""); setDescription(""); setCategory(""); setBudget(""); setLocation(""); setUrgency("normal");
      setIsOpen(false);
      // Removed alert to prevent potential UI issues
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
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Loading your dashboard...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'red' }}>{error}</p>
            <button onClick={fetchData} className="sm-btn sm-btn-primary">Retry</button>
          </div>
        ) : (
          <>
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
                    {availableCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="sm-input-group">
                  <label className="sm-label">Budget (NRS)</label>
                  <input className="sm-input" type="number" placeholder="Optional" value={budget} onChange={e => setBudget(e.target.value)} />
                </div>
                <div className="sm-input-group">
                  <label className="sm-label">Location</label>
                  <input className="sm-input" placeholder="e.g. Kathmandu" value={location} onChange={e => setLocation(e.target.value)} />
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
                  <span className={`sm-badge ${post.status === 'pending' ? 'sm-badge-success' : 'sm-badge-warning'}`}>{post.status}</span>
                  <span style={{fontSize: '0.8rem', color: 'var(--sm-text-light)'}}>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
                <h3 style={{fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem', color: 'var(--sm-text-dark)'}}>{post.title}</h3>
                <p style={{fontSize: '0.9rem', color: 'var(--sm-text-mid)', lineClamp: '2', webkitLineClamp: '2', display: '-webkit-box', webkitBoxOrient: 'vertical', overflow: 'hidden', margin: '0 0 1.25rem', lineHeight: '1.5'}}>{post.description}</p>
                
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--sm-gray-border)'}}>
                  <div style={{display: 'flex', gap: '0.5rem'}}>
                    <span style={{fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '4px', background: 'var(--sm-gray-light)'}}>{post.category_name}</span>
                  </div>
                  <div style={{fontSize: '0.85rem', color: 'var(--sm-navy)', fontWeight: 600}}>Budget: NPR {post.budget}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
        </>
        )}
      </main>
    </div>
  );
}

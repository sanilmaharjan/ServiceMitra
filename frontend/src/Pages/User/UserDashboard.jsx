// TEMPORARY - Remove after login is fixed
const DEMO_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzc1MzYwOTQ0LCJpYXQiOjE3NzUzNDI5NDQsImp0aSI6ImZkMzQ2MTBlNjQ2ZTRiZDI4M2M1ZjEyNGViYWU5NDMyIiwidXNlcl9pZCI6IjM2In0.V3CDJxe7K31_kRo4GsimuF74pn3txcpVvuETOPk2w5A";
localStorage.setItem("access_token", DEMO_TOKEN);

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../Components/UserNavbar";
import "../../Styles/User.css";

const CATEGORIES = [
  "Electrical", "Plumbing", "Painting", "Carpentry", "Cleaning",
  "Gardening", "Appliance Repair", "Electronics", "Beauty & Wellness", "Other",
];

export default function UserDashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/api/jobs/", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      const data = await response.json();
      console.log("Jobs:", data);
      setPosts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!title || !description || !category) {
      alert("Please fill all required fields");
      return;
    }
    
    setSubmitting(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/jobs/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        },
        body: JSON.stringify({
          title: title,
          description: description,
          category: 1,
          budget: budget ? parseFloat(budget) : 0,
          address: location || "Not specified",
          city: location || "Not specified",
        })
      });
      
      if (response.ok) {
        await fetchJobs();
        setTitle("");
        setDescription("");
        setCategory("");
        setBudget("");
        setLocation("");
        setIsOpen(false);
        alert("Job posted successfully!");
      } else {
        alert("Failed to post job");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to post job");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="user-layout">
        <UserNavbar userName="User" />
        <main className="sm-container sm-section">Loading...</main>
      </div>
    );
  }

  return (
    <div className="user-layout animate-fade">
      <UserNavbar userName="User" />

      <main className="sm-container sm-section">
        <header style={{marginBottom: '2rem'}}>
          <h1 style={{fontSize: '2rem', fontWeight: 800, color: '#1e293b', margin: 0}}>Service Requests</h1>
          <p style={{color: '#64748b', marginTop: '0.5rem'}}>Manage your active jobs and find the best professionals.</p>
        </header>

        {/* Create Post Section */}
        <section style={{marginBottom: '3rem'}}>
          {!isOpen ? (
            <div style={{border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem'}} onClick={() => setIsOpen(true)}>
              <div style={{width: '40px', height: '40px', background: '#1e293b', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800}}>U</div>
              <div style={{color: '#64748b'}}>What service do you need today?</div>
              <button style={{marginLeft: 'auto', padding: '0.5rem 1.25rem', background: '#f4a261', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>Create Post</button>
            </div>
          ) : (
            <div style={{border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
                <h3 style={{margin: 0}}>New Service Request</h3>
                <button style={{background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer'}} onClick={() => setIsOpen(false)}>✕</button>
              </div>

              <div style={{display: 'grid', gap: '1rem'}}>
                <div>
                  <label>Project Title *</label>
                  <input style={{width: '100%', padding: '8px', marginTop: '5px'}} placeholder="e.g. Repair Kitchen Sink" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div>
                  <label>Details *</label>
                  <textarea style={{width: '100%', padding: '8px', marginTop: '5px', minHeight: '100px'}} placeholder="Describe the problem..." value={description} onChange={e => setDescription(e.target.value)} />
                </div>
                <div>
                  <label>Category *</label>
                  <select style={{width: '100%', padding: '8px', marginTop: '5px'}} value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="">Select Category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label>Budget (NRS)</label>
                  <input type="number" style={{width: '100%', padding: '8px', marginTop: '5px'}} placeholder="Optional" value={budget} onChange={e => setBudget(e.target.value)} />
                </div>
                <div>
                  <label>Location</label>
                  <input style={{width: '100%', padding: '8px', marginTop: '5px'}} placeholder="e.g. Kathmandu" value={location} onChange={e => setLocation(e.target.value)} />
                </div>
              </div>

              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem'}}>
                <button style={{padding: '8px 16px', background: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer'}} onClick={() => setIsOpen(false)}>Cancel</button>
                <button style={{padding: '8px 16px', background: '#f4a261', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'}} onClick={handlePost} disabled={submitting}>
                  {submitting ? 'Posting...' : 'Post Request'}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Active Posts */}
        <section>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
            <h2 style={{fontSize: '1.25rem', fontWeight: 700, margin: 0}}>Active Requests</h2>
            <span style={{padding: '4px 8px', background: '#e2e8f0', borderRadius: '20px', fontSize: '0.8rem'}}>{posts.length} Active</span>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem'}}>
            {posts.length === 0 ? (
              <div style={{border: '1px solid #e2e8f0', borderRadius: '12px', textAlign: 'center', padding: '3rem'}}>
                <p>No active requests. Create your first service request!</p>
              </div>
            ) : (
              posts.map(post => (
                <div key={post.id} style={{border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', cursor: 'pointer'}} onClick={() => navigate(`/user/posts/${post.id}`)}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem'}}>
                    <span style={{padding: '4px 8px', background: '#22c55e', color: 'white', borderRadius: '20px', fontSize: '0.75rem'}}>{post.status || 'pending'}</span>
                    <span style={{fontSize: '0.8rem', color: '#64748b'}}>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 style={{margin: '0 0 0.5rem'}}>{post.title}</h3>
                  <p style={{color: '#64748b', margin: '0 0 1.25rem'}}>{post.description?.substring(0, 100)}...</p>
                  <div style={{display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #e2e8f0'}}>
                    <span style={{fontSize: '0.75rem', padding: '4px 8px', background: '#f1f5f9', borderRadius: '4px'}}>{post.category_name || 'General'}</span>
                    <span style={{fontWeight: 600}}>💰 Rs. {post.budget}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
import React, { useState, useEffect, useContext } from "react";
import UserNavbar from "../../Components/UserNavbar";
import Footer from "../../Components/Footer";
import "../../Styles/Global.css";
import { AuthContext } from "../../context/authContext";

export default function UserHistory() {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      console.log("Token:", token);
      
      const response = await fetch("http://127.0.0.1:8000/api/jobs/", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Jobs data:", data);
      setJobs(data || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const USER_NAME = user?.name || "User";

  if (loading) {
    return (
      <div>
        <UserNavbar userName={USER_NAME} backTo="/user" />
        <div style={{ padding: "50px", textAlign: "center" }}>Loading jobs...</div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <UserNavbar userName={USER_NAME} backTo="/user" />
        <div style={{ padding: "50px", textAlign: "center", color: "red" }}>
          Error: {error}<br/>
          <button onClick={() => fetchJobs()} style={{ marginTop: "10px" }}>Try Again</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100 animate-fade">
      <UserNavbar userName={USER_NAME} backTo="/user" />

      <main className="sm-container sm-section">
        <header style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--sm-navy)', margin: 0 }}>My Jobs</h1>
          <p style={{ color: 'var(--sm-text-mid)', marginTop: '0.4rem' }}>View all your service requests.</p>
        </header>

        <div>
          {jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed #ccc', borderRadius: '12px' }}>
              <p>No jobs found. Create your first job!</p>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', padding: '4px 8px', background: job.status === 'completed' ? '#22c55e' : '#f4a261', color: 'white', borderRadius: '20px' }}>
                      {job.status || 'pending'}
                    </span>
                    <h3 style={{ margin: '10px 0 5px' }}>{job.title}</h3>
                    <p style={{ color: '#64748b', margin: 0 }}>{job.description}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f4a261' }}>NRS {job.budget}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: '#f1f5f9', borderRadius: '4px' }}>{job.category_name || 'General'}</span>
                  <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: '#f1f5f9', borderRadius: '4px' }}>📍 {job.city || 'N/A'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
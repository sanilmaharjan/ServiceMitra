import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../Components/AdminNavbar";
import "../../Styles/Admin.css";

const initialProviders = [
  { id: 1, name: "Ramesh Electricals", avatar: "RE", category: "Electrician", location: "Kathmandu", rating: 4.8, jobs: 132, status: "verified", earnings: 85000 },
  { id: 2, name: "Sunita Plumbing Works", avatar: "SP", category: "Plumber", location: "Lalitpur", rating: 4.6, jobs: 89, status: "verified", earnings: 62000 },
  { id: 3, name: "Bijay Painting Co.", avatar: "BP", category: "Painter", location: "Bhaktapur", rating: 4.9, jobs: 210, status: "verified", earnings: 120000 },
  { id: 4, name: "Tech Appliance Fix", avatar: "TF", category: "Appliance Repair", location: "Kathmandu", rating: 4.5, jobs: 67, status: "pending", earnings: 34000 },
];

export default function AdminServiceProviders() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState(initialProviders);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = providers.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="admin-layout animate-fade">
      <AdminNavbar backTo="/admin" pageIcon="🛠️" pageTitle="Service Providers" />

      <main className="sm-container sm-section">
        <header className="page-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem'}}>
          <div>
            <h1 style={{fontSize: '2rem', fontWeight: 800, color: 'var(--sm-navy)', margin: 0}}>Service Professionals</h1>
            <p style={{color: 'var(--sm-text-mid)', marginTop: '0.4rem'}}>Manage partners and monitor their platform activity.</p>
          </div>
          <div className="sm-badge sm-badge-info">{providers.length} Partners</div>
        </header>

        <div style={{display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap'}}>
            <input 
              className="sm-input" 
              style={{flex: 1, minWidth: '300px'}} 
              placeholder="Search by name, category, or location..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div style={{display: 'flex', gap: '0.5rem'}}>
              {['All', 'Verified', 'Pending'].map(f => (
                <button 
                  key={f} 
                  className={`sm-btn ${filter.toLowerCase() === f.toLowerCase() ? 'sm-btn-secondary' : 'sm-btn-outline'}`}
                  style={{padding: '0.5rem 1.25rem', fontSize: '0.85rem'}}
                  onClick={() => setFilter(f.toLowerCase())}
                >
                  {f}
                </button>
              ))}
            </div>
        </div>

        <div className="sm-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'}}>
          {filtered.map(p => (
            <div key={p.id} className="sm-card animate-fade" style={{padding: '1.5rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem'}}>
                <div style={{width: '56px', height: '56px', background: 'var(--sm-navy)', color: '#fff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800}}>{p.avatar}</div>
                <span className={`sm-badge ${p.status === 'verified' ? 'sm-badge-success' : 'sm-badge-warning'}`}>{p.status}</span>
              </div>
              
              <h3 style={{fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.25rem', color: 'var(--sm-text-dark)'}}>{p.name}</h3>
              <p style={{margin: '0 0 1rem', fontSize: '0.85rem', color: 'var(--sm-text-mid)'}}>{p.category} · 📍 {p.location}</p>
              
              <div style={{display: 'flex', gap: '1.25rem', margin: '1rem 0', fontSize: '0.75rem', color: 'var(--sm-text-light)', fontWeight: 600}}>
                <span>⭐ {p.rating} Rating</span>
                <span>✅ {p.jobs} Jobs</span>
              </div>

              <div style={{display: 'flex', gap: '0.5rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--sm-gray-border)'}}>
                 <button className="sm-btn sm-btn-primary" style={{flex: 1, padding: '0.65rem', fontSize: '0.85rem'}} onClick={() => navigate(`/admin/service-providers/${p.id}/portfolio`, { state: { provider: p } })}>View Portfolio</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

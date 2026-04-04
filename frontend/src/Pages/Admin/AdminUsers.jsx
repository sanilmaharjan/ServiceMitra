import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../Components/AdminNavbar";
import "../../Styles/Admin.css";

const initialUsers = [
  { id: 1, name: "Aarav Sharma", email: "aarav@email.com", avatar: "AS", joined: "Jan 12, 2025", status: "active", jobs: 4 },
  { id: 2, name: "Priya Thapa", email: "priya@email.com", avatar: "PT", joined: "Feb 3, 2025", status: "active", jobs: 2 },
  { id: 3, name: "Bikas Rai", email: "bikas@email.com", avatar: "BR", joined: "Mar 15, 2025", status: "inactive", jobs: 7 },
  { id: 4, name: "Sita Gurung", email: "sita@email.com", avatar: "SG", joined: "Mar 20, 2025", status: "active", jobs: 1 },
];

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [removeId, setRemoveId] = useState(null);

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || u.status === filter;
    return matchSearch && matchFilter;
  });

  const handleRemove = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setRemoveId(null);
  };

  return (
    <div className="admin-layout animate-fade">
      <AdminNavbar backTo="/admin" pageIcon="👥" pageTitle="Community Users" />

      <main className="sm-container sm-section">
        <header className="page-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem'}}>
          <div>
            <h1 style={{fontSize: '2rem', fontWeight: 800, color: 'var(--sm-navy)', margin: 0}}>User Management</h1>
            <p style={{color: 'var(--sm-text-mid)', marginTop: '0.4rem'}}>Review client activity and manage accounts.</p>
          </div>
          <div className="sm-badge sm-badge-info">{users.length} Total Users</div>
        </header>

        <div style={{display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap'}}>
            <input 
              className="sm-input" 
              style={{flex: 1, minWidth: '300px'}} 
              placeholder="Search by name or email..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div style={{display: 'flex', gap: '0.5rem'}}>
              {['All', 'Active', 'Inactive'].map(f => (
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

        <div className="sm-table-card">
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{textAlign: 'left', borderBottom: '2px solid var(--sm-gray-border)'}}>
                <th style={{padding: '1.25rem', fontSize: '0.85rem', color: 'var(--sm-text-light)', textTransform: 'uppercase'}}>User</th>
                <th style={{padding: '1.25rem', fontSize: '0.85rem', color: 'var(--sm-text-light)', textTransform: 'uppercase'}}>Joined</th>
                <th style={{padding: '1.25rem', fontSize: '0.85rem', color: 'var(--sm-text-light)', textTransform: 'uppercase'}}>Projects</th>
                <th style={{padding: '1.25rem', fontSize: '0.85rem', color: 'var(--sm-text-light)', textTransform: 'uppercase'}}>Status</th>
                <th style={{padding: '1.25rem', fontSize: '0.85rem', color: 'var(--sm-text-light)', textTransform: 'uppercase', textAlign: 'right'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id} className="admin-table-row" style={{borderBottom: '1px solid var(--sm-gray-border)'}}>
                  <td style={{padding: '1.25rem'}}>
                    <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                      <div style={{width: '40px', height: '40px', background: 'var(--sm-navy)', color: '#fff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem'}}>{user.avatar}</div>
                      <div>
                        <div style={{fontWeight: 700, fontSize: '0.95rem'}}>{user.name}</div>
                        <div style={{fontSize: '0.8rem', color: 'var(--sm-text-light)'}}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{padding: '1.25rem', fontSize: '0.9rem', color: 'var(--sm-text-mid)'}}>{user.joined}</td>
                  <td style={{padding: '1.25rem'}}>
                    <span style={{fontWeight: 700, color: 'var(--sm-navy)'}}>{user.jobs}</span>
                  </td>
                  <td style={{padding: '1.25rem'}}>
                    <span className={`sm-badge ${user.status === 'active' ? 'sm-badge-success' : 'sm-badge-danger'}`}>{user.status}</span>
                  </td>
                  <td style={{padding: '1.25rem', textAlign: 'right'}}>
                    <button className="sm-btn sm-btn-ghost" style={{color: 'var(--sm-danger)', padding: '0.4rem 0.8rem', fontSize: '0.75rem'}} onClick={() => setRemoveId(user.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {removeId && (
        <div className="sm-overlay animate-fade" onClick={() => setRemoveId(null)} style={{position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div className="sm-card" style={{maxWidth: '380px', textAlign: 'center'}}>
             <div style={{fontSize: '2.5rem', marginBottom: '1rem'}}>⚠️</div>
             <h3 style={{fontWeight: 800, color: 'var(--sm-navy)'}}>Suspend Account?</h3>
             <p style={{color: 'var(--sm-text-mid)', fontSize: '0.9rem', marginBottom: '1.5rem'}}>This user will lose access to all ServiceMitra portals. This action is reversible by the support team.</p>
             <div style={{display: 'flex', gap: '0.75rem'}}>
                <button className="sm-btn sm-btn-ghost" style={{flex: 1}} onClick={() => setRemoveId(null)}>Cancel</button>
                <button className="sm-btn sm-btn-primary" style={{flex: 1, background: 'var(--sm-danger)'}} onClick={() => handleRemove(removeId)}>Suspend</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

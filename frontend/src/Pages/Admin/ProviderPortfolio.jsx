import React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import AdminNavbar from "../../Components/AdminNavbar";
import "../../Styles/Admin.css";

export default function ProviderPortfolio() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const provider = location.state?.provider;

  if (!provider) {
    return (
      <div className="admin-layout">
        <AdminNavbar backTo="/admin/service-providers" />
        <main className="sm-container sm-section">
          <div className="sm-card" style={{textAlign: 'center', padding: '4rem'}}>
            <h2 style={{color: 'var(--sm-navy)'}}>Provider Not Found</h2>
            <button className="sm-btn sm-btn-primary" onClick={() => navigate("/admin/service-providers")}>Back to List</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout animate-fade">
      <AdminNavbar 
        backTo="/admin/service-providers" 
        pageIcon="👤" 
        pageTitle={`Portfolio — ${provider.name}`} 
      />

      <main className="sm-container sm-section" style={{maxWidth: '1000px'}}>
        {/* --- Header Card --- */}
        <section className="sm-card" style={{padding: '2.5rem', display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2rem'}}>
          <div style={{width: '90px', height: '90px', background: 'var(--sm-navy)', color: '#fff', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900}}>{provider.avatar}</div>
          <div style={{flex: 1}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
              <h1 style={{fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--sm-navy)'}}>{provider.name}</h1>
              <span className={`sm-badge ${provider.status === 'verified' ? 'sm-badge-success' : 'sm-badge-warning'}`}>{provider.status}</span>
            </div>
            <p style={{margin: '0 0 1rem', fontSize: '1rem', color: 'var(--sm-text-mid)'}}>{provider.category} · 📍 {provider.location}</p>
            <div style={{display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--sm-text-light)'}}>
              <span>⭐ {provider.rating} Rating</span>
              <span>✅ {provider.jobs} Jobs Complete</span>
              <span>📅 Joined {provider.joined}</span>
            </div>
          </div>
        </section>

        <div className="sm-grid" style={{gridTemplateColumns: '1.5fr 1fr'}}>
          <div>
            {/* --- Bio --- */}
            <section className="sm-card" style={{marginBottom: '1.5rem'}}>
              <h3 style={{fontSize: '1.1rem', fontWeight: 700, color: 'var(--sm-navy)', marginBottom: '1rem'}}>About Provider</h3>
              <p style={{fontSize: '0.95rem', color: 'var(--sm-text-mid)', lineHeight: '1.7', margin: 0}}>{provider.bio}</p>
            </section>

            {/* --- Past Work --- */}
            <section className="sm-card">
              <h3 style={{fontSize: '1.1rem', fontWeight: 700, color: 'var(--sm-navy)', marginBottom: '1.5rem'}}>Portfolio Highlights</h3>
              {provider.portfolio.length === 0 ? (
                <p style={{color: 'var(--sm-text-light)', fontStyle: 'italic'}}>No projects uploaded yet.</p>
              ) : (
                <div className="sm-grid">
                  {provider.portfolio.map((p, i) => (
                    <div key={i} style={{padding: '1.25rem', border: '1px solid var(--sm-gray-border)', borderRadius: '12px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                         <h4 style={{margin: 0, fontSize: '1rem', fontWeight: 700}}>{p.title}</h4>
                         <span style={{fontSize: '0.75rem', fontWeight: 600, color: 'var(--sm-text-light)'}}>{p.year}</span>
                      </div>
                      <p style={{margin: 0, fontSize: '0.85rem', color: 'var(--sm-text-mid)', lineHeight: '1.5'}}>{p.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="sm-grid" style={{alignContent: 'start'}}>
            {/* --- Earnings & Payout --- */}
            <section className="sm-card" style={{background: 'var(--sm-navy-light)', border: 'none', marginBottom: '1.5rem'}}>
              <h3 style={{fontSize: '1rem', fontWeight: 700, color: 'var(--sm-navy)', marginBottom: '0.5rem'}}>Accumulated Earnings</h3>
              <div style={{fontSize: '2rem', fontWeight: 900, color: 'var(--sm-navy)', marginBottom: '1rem'}}>NRS {provider.earnings.toLocaleString()}</div>
              <button className="sm-btn sm-btn-primary" style={{width: '100%'}} onClick={() => navigate(`/admin/payments/${provider.id}`, { state: { provider } })}>
                💳 Process Payout
              </button>
            </section>

            {/* --- Skills --- */}
            <section className="sm-card">
              <h3 style={{fontSize: '1rem', fontWeight: 700, color: 'var(--sm-navy)', marginBottom: '1rem'}}>Skills</h3>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                {provider.skills.map(s => (
                  <span key={s} className="sm-badge" style={{background: 'var(--sm-gray-light)', color: 'var(--sm-text-mid)', textTransform: 'none', fontSize: '0.7rem'}}>{s}</span>
                ))}
              </div>
            </section>

            {/* --- Contact Info --- */}
            <section className="sm-card" style={{marginTop: '1.5rem'}}>
              <h3 style={{fontSize: '1rem', fontWeight: 700, color: 'var(--sm-navy)', marginBottom: '1rem'}}>Verification & Contact</h3>
              <div style={{fontSize: '0.85rem', color: 'var(--sm-text-mid)'}}>
                <div style={{marginBottom: '0.75rem'}}>📧 {provider.email}</div>
                <div style={{marginBottom: '0.75rem'}}>📱 {provider.phone}</div>
                <div style={{padding: '0.5rem', background: 'var(--sm-orange-light)', color: 'var(--sm-orange-dark)', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, textAlign: 'center'}}>
                   KYC Status: {provider.kyc?.toUpperCase()}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

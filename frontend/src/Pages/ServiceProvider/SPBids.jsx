import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SPNavbar from "../../Components/SPNavbar";
import "../../Styles/SP.css";

const PROVIDER_NAME = "Ramesh Sharma";

const INITIAL_BIDS = [
  { id: 1, postTitle: "Need AC Repair at Home", client: "Sunita Rai", category: "Electrical", location: "Kathmandu, Baneshwor", myBid: 2000, budget: "1,500 – 3,000", placedAt: "2 hours ago", status: "pending", note: "I have 5 years of experience in AC repair. Can fix within 2 hours." },
  { id: 2, postTitle: "Plumbing – Pipe Leakage Fix", client: "Anita Shrestha", category: "Plumbing", location: "Bhaktapur", myBid: 800, budget: "500 – 1,200", placedAt: "1 day ago", status: "accepted", note: "Experienced plumber available immediately." },
  { id: 3, postTitle: "House Painting – 3BHK", client: "Bikram Thapa", category: "Painting", location: "Lalitpur, Patan", myBid: 18000, budget: "15,000 – 25,000", placedAt: "5 hours ago", status: "pending", note: "Professional painter with 8 years experience. Premium quality guaranteed." },
];

export default function SPBids() {
  const navigate = useNavigate();
  const [bids, setBids]           = useState(INITIAL_BIDS);
  const [filter, setFilter]       = useState("all");

  const [editBid, setEditBid]     = useState(null); 
  const [editAmount, setEditAmount] = useState("");
  const [editNote, setEditNote]   = useState("");
  const [withdrawId, setWithdrawId] = useState(null);

  const filtered = filter === "all" ? bids : bids.filter(b => b.status === filter);

  const openEdit = bid => {
    setEditBid(bid);
    setEditAmount(String(bid.myBid));
    setEditNote(bid.note);
  };

  const handleEditSave = () => {
    setBids(prev => prev.map(b =>
      b.id === editBid.id
        ? { ...b, myBid: Number(editAmount) || b.myBid, note: editNote || b.note }
        : b
    ));
    setEditBid(null);
  };

  const handleWithdraw = () => {
    setBids(prev => prev.filter(b => b.id !== withdrawId));
    setWithdrawId(null);
  };

  return (
    <div className="provider-layout animate-fade">
      <SPNavbar providerName={PROVIDER_NAME} backTo="/provider" />

      <main className="sm-container sm-section">
        <header className="page-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem'}}>
          <div>
            <h1 style={{fontSize: '2rem', fontWeight: 800, color: 'var(--sm-navy)', margin: 0}}>My Bids</h1>
            <p style={{color: 'var(--sm-text-mid)', marginTop: '0.4rem'}}>Review and manage your active proposals.</p>
          </div>
          <button className="sm-btn sm-btn-primary" onClick={() => navigate("/provider/posts")}>Find More Jobs</button>
        </header>

        {/* --- Filters --- */}
        <div style={{display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem'}}>
          {["All", "Pending", "Accepted", "Rejected"].map(f => (
            <button 
              key={f} 
              className={`sm-btn ${filter.toLowerCase() === f.toLowerCase() ? 'sm-btn-secondary' : 'sm-btn-ghost'}`}
              style={{padding: '0.5rem 1.25rem', fontSize: '0.85rem', borderRadius: '50px'}}
              onClick={() => setFilter(f.toLowerCase())}
            >
              {f}
            </button>
          ))}
        </div>

        {/* --- Bids Grid --- */}
        <div className="sm-grid">
          {filtered.length === 0 ? (
            <div className="sm-card" style={{textAlign: 'center', padding: '4rem 2rem'}}>
              <div style={{fontSize: '2.5rem', marginBottom: '1rem'}}>📋</div>
              <p style={{color: 'var(--sm-text-light)'}}>No bids found in this category.</p>
            </div>
          ) : (
            filtered.map((bid, index) => (
              <div key={bid.id} className="sm-card animate-fade" style={{animationDelay: `${index * 0.05}s`}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
                   <div>
                      <h3 style={{fontSize: '1.2rem', fontWeight: 800, color: 'var(--sm-navy)', margin: '0 0 0.25rem'}}>{bid.postTitle}</h3>
                      <div style={{display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--sm-text-light)'}}>
                        <span>👤 {bid.client}</span>
                        <span>📍 {bid.location}</span>
                        <span>🕑 {bid.placedAt}</span>
                      </div>
                   </div>
                   <div style={{textAlign: 'right'}}>
                     <div style={{fontSize: '1.1rem', fontWeight: 800, color: 'var(--sm-orange)'}}>NRS {bid.myBid.toLocaleString()}</div>
                     <span className={`sm-badge ${bid.status === 'accepted' ? 'sm-badge-success' : (bid.status === 'pending' ? 'sm-badge-warning' : 'sm-badge-danger')}`} style={{marginTop: '0.5rem'}}>
                        {bid.status}
                     </span>
                   </div>
                </div>

                <div style={{background: 'var(--sm-gray-light)', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem'}}>
                  <p style={{margin: 0, fontSize: '0.88rem', color: 'var(--sm-text-mid)', fontStyle: 'italic'}}>"{bid.note}"</p>
                </div>

                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--sm-gray-border)'}}>
                   <span style={{fontSize: '0.75rem', color: 'var(--sm-text-light)'}}>Project Budget: {bid.budget}</span>
                   {bid.status === 'pending' && (
                     <div style={{display: 'flex', gap: '0.5rem'}}>
                       <button className="sm-btn sm-btn-outline" style={{padding: '0.4rem 1rem', fontSize: '0.75rem'}} onClick={() => openEdit(bid)}>Edit Bid</button>
                       <button className="sm-btn sm-btn-ghost" style={{padding: '0.4rem 1rem', fontSize: '0.75rem', color: 'var(--sm-danger)'}} onClick={() => setWithdrawId(bid.id)}>Withdraw</button>
                     </div>
                   )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* --- Modals --- */}
      {editBid && (
        <div className="sm-overlay animate-fade" onClick={() => setEditBid(null)} style={{position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div className="sm-card" onClick={e => e.stopPropagation()} style={{width: '90%', maxWidth: '400px'}}>
             <h3 style={{fontWeight: 800, color: 'var(--sm-navy)', margin: '0 0 1.5rem'}}>Modify Your Bid</h3>
             <div className="sm-input-group">
                <label className="sm-label">Proposal Amount (NRS)</label>
                <input className="sm-input" type="number" value={editAmount} onChange={e => setEditAmount(e.target.value)} />
             </div>
             <div className="sm-input-group">
                <label className="sm-label">Message to Client</label>
                <textarea className="sm-input" style={{minHeight: '100px'}} value={editNote} onChange={e => setEditNote(e.target.value)} />
             </div>
             <div style={{display: 'flex', gap: '0.75rem', marginTop: '1.5rem'}}>
                <button className="sm-btn sm-btn-outline" style={{flex: 1}} onClick={() => setEditBid(null)}>Cancel</button>
                <button className="sm-btn sm-btn-primary" style={{flex: 1}} onClick={handleEditSave}>Save Changes</button>
             </div>
          </div>
        </div>
      )}

      {withdrawId && (
        <div className="sm-overlay animate-fade" onClick={() => setWithdrawId(null)} style={{position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div className="sm-card" style={{maxWidth: '380px', textAlign: 'center'}}>
             <div style={{fontSize: '2.5rem', marginBottom: '1rem'}}>🗑️</div>
             <h3 style={{fontWeight: 800, color: 'var(--sm-navy)'}}>Withdraw Proposal?</h3>
             <p style={{color: 'var(--sm-text-mid)', fontSize: '0.9rem', marginBottom: '1.5rem'}}>The client will no longer see your offer. This action cannot be undone.</p>
             <div style={{display: 'flex', gap: '0.75rem'}}>
                <button className="sm-btn sm-btn-ghost" style={{flex: 1}} onClick={() => setWithdrawId(null)}>Keep it</button>
                <button className="sm-btn sm-btn-primary" style={{flex: 1, background: 'var(--sm-danger)'}} onClick={handleWithdraw}>Yes, Withdraw</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

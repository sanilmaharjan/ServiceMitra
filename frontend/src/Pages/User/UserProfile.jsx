import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../Components/UserNavbar";
import "../../Styles/User.css";

const USER_NAME = "Aarav Sharma";

const initialProfile = {
  name: "Aarav Sharma",
  email: "aarav@email.com",
  phone: "+977-9801234567",
  location: "Kathmandu, Nepal",
  bio: "Regular user of ServiceMitra. I frequently hire service professionals for home maintenance.",
};

export default function UserProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(initialProfile);
  const [form, setForm]       = useState(initialProfile);
  const [saved, setSaved]     = useState(false);
  const initials = profile.name.split(" ").map(n => n[0]).join("").toUpperCase();

  const handleSave = () => {
    setProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const setField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const changed = JSON.stringify(form) !== JSON.stringify(profile);

  return (
    <div className="user-layout animate-fade">
      <UserNavbar userName={USER_NAME} backTo="/user" />

      <main className="sm-container sm-section" style={{maxWidth: '800px'}}>
        <section className="sm-card" style={{padding: '2.5rem', marginBottom: '2rem'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem'}}>
            <div style={{width: '80px', height: '80px', background: 'var(--sm-navy)', color: '#fff', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.8rem'}}>{initials}</div>
            <div>
              <h1 style={{fontSize: '1.75rem', fontWeight: 800, color: 'var(--sm-navy)', margin: '0 0 0.25rem'}}>{profile.name}</h1>
              <p style={{margin: 0, color: 'var(--sm-text-light)', fontSize: '0.9rem'}}>📍 {profile.location} · 📧 {profile.email}</p>
            </div>
          </div>

          <div className="sm-grid">
            <div className="sm-grid" style={{gridTemplateColumns: '1fr 1fr'}}>
              <div className="sm-input-group">
                <label className="sm-label">Full Name</label>
                <input className="sm-input" value={form.name} onChange={e => setField('name', e.target.value)} />
              </div>
              <div className="sm-input-group">
                <label className="sm-label">Email Address</label>
                <input className="sm-input" type="email" value={form.email} onChange={e => setField('email', e.target.value)} />
              </div>
            </div>

            <div className="sm-grid" style={{gridTemplateColumns: '1fr 1fr'}}>
              <div className="sm-input-group">
                <label className="sm-label">Phone Number</label>
                <input className="sm-input" value={form.phone} onChange={e => setField('phone', e.target.value)} />
              </div>
              <div className="sm-input-group">
                <label className="sm-label">Current Location</label>
                <input className="sm-input" value={form.location} onChange={e => setField('location', e.target.value)} />
              </div>
            </div>

            <div className="sm-input-group">
              <label className="sm-label">Short Bio</label>
              <textarea className="sm-input" style={{minHeight: '100px'}} value={form.bio} onChange={e => setField('bio', e.target.value)} placeholder="A bit about yourself..." />
            </div>

            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem'}}>
              {saved && <span style={{display: 'flex', alignItems: 'center', color: 'var(--sm-success)', fontSize: '0.85rem', fontWeight: 600}}>✓ Settings Saved</span>}
              <button className="sm-btn sm-btn-ghost" onClick={() => setForm(profile)}>Reset</button>
              <button className="sm-btn sm-btn-primary" disabled={!changed} onClick={handleSave}>Save Profile Updates</button>
            </div>
          </div>
        </section>

        <section className="sm-card" style={{padding: '1.5rem 2.5rem', border: '1.5px dashed var(--sm-gray-border)', background: 'transparent'}}>
           <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <h3 style={{margin: '0 0 0.25rem', fontSize: '1rem', color: 'var(--sm-navy)'}}>Account Security</h3>
                <p style={{margin: 0, fontSize: '0.8rem', color: 'var(--sm-text-light)'}}>Update your password and login methods.</p>
              </div>
              <button className="sm-btn sm-btn-outline" style={{padding: '0.5rem 1rem', fontSize: '0.8rem'}}>Change Password</button>
           </div>
        </section>
      </main>
    </div>
  );
}

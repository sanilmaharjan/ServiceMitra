import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SPNavbar from "../../Components/SPNavbar";
import "../../Styles/SP.css";

const PROVIDER_NAME = "Ramesh Sharma";

const SKILLS_OPTIONS = [
  "AC Repair","Electrical Wiring","Pipe Fitting","Interior Painting","Solar Setup",
  "LED Installation","Bathroom Fitting","Carpentry","Appliance Repair","Gardening",
  "Cleaning","Welding","Plumbing","Panel Upgrade","Generator Repair",
];

const initialProfile = {
  name: "Ramesh Sharma",
  email: "ramesh@email.com",
  phone: "+977-9801111111",
  location: "Kathmandu, Thamel",
  category: "Electrical",
  bio: "Certified electrician and plumber with over 8 years of experience serving residential and commercial clients across the Kathmandu Valley.",
  skills: ["AC Repair","Electrical Wiring","Pipe Fitting","Solar Setup"],
};

export default function SPProfile() {
  const navigate   = useNavigate();
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

  const toggleSkill = skill => {
    setForm(p => ({
      ...p,
      skills: p.skills.includes(skill)
        ? p.skills.filter(s => s !== skill)
        : [...p.skills, skill],
    }));
  };

  const changed = JSON.stringify(form) !== JSON.stringify(profile);

  return (
    <div className="provider-layout animate-fade">
      <SPNavbar providerName={PROVIDER_NAME} backTo="/provider" />

      <main className="sm-container sm-section" style={{maxWidth: '850px'}}>
        <section className="sm-card" style={{padding: '2.5rem', marginBottom: '2rem'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem'}}>
            <div style={{width: '80px', height: '80px', background: 'var(--sm-orange)', color: '#fff', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.8rem'}}>{initials}</div>
            <div>
              <h1 style={{fontSize: '1.75rem', fontWeight: 800, color: 'var(--sm-navy)', margin: '0 0 0.25rem'}}>{profile.name}</h1>
              <p style={{margin: 0, color: 'var(--sm-text-light)', fontSize: '0.9rem'}}>{profile.category} · 📍 {profile.location} · 📧 {profile.email}</p>
            </div>
          </div>

          <div className="sm-grid">
            <div className="sm-grid" style={{gridTemplateColumns: '1fr 1fr'}}>
              <div className="sm-input-group">
                <label className="sm-label">Professional Name</label>
                <input className="sm-input" value={form.name} onChange={e => setField('name', e.target.value)} />
              </div>
              <div className="sm-input-group">
                <label className="sm-label">Primary Specialty</label>
                <input className="sm-input" value={form.category} onChange={e => setField('category', e.target.value)} />
              </div>
            </div>

            <div className="sm-grid" style={{gridTemplateColumns: '1fr 1fr'}}>
              <div className="sm-input-group">
                <label className="sm-label">Direct Contact (Phone)</label>
                <input className="sm-input" value={form.phone} onChange={e => setField('phone', e.target.value)} />
              </div>
              <div className="sm-input-group">
                <label className="sm-label">Service Area</label>
                <input className="sm-input" value={form.location} onChange={e => setField('location', e.target.value)} />
              </div>
            </div>

            <div className="sm-input-group">
              <label className="sm-label">Professional Bio</label>
              <textarea className="sm-input" style={{minHeight: '120px'}} value={form.bio} onChange={e => setField('bio', e.target.value)} placeholder="A bit about yourself and your experience..." />
            </div>

            {/* Skills Picker */}
            <div className="sm-input-group">
              <label className="sm-label">Select Skills</label>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem'}}>
                {SKILLS_OPTIONS.map(skill => (
                  <button
                    key={skill}
                    className={`sm-btn ${form.skills.includes(skill) ? 'sm-btn-secondary' : 'sm-btn-ghost'}`}
                    style={{padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '50px', border: form.skills.includes(skill) ? 'none' : '1px solid var(--sm-gray-border)'}}
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                    {form.skills.includes(skill) && <span style={{marginLeft: '0.25rem'}}>✓</span>}
                  </button>
                ))}
              </div>
            </div>

            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem'}}>
              {saved && <span style={{display: 'flex', alignItems: 'center', color: 'var(--sm-success)', fontSize: '0.85rem', fontWeight: 600}}>✓ Profile Persistent</span>}
              <button className="sm-btn sm-btn-ghost" onClick={() => setForm(profile)}>Reset</button>
              <button className="sm-btn sm-btn-primary" disabled={!changed} onClick={handleSave}>Save Profile Updates</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

import { useContext, useEffect, useState } from "react";
import SPNavbar from "../../Components/SPNavbar";
import "../../Styles/SP.css";
import { AuthContext } from "../../context/authContext";
import providerApi from "../../utils/providerApi";

const SKILLS_OPTIONS = [
  "AC Repair","Electrical Wiring","Pipe Fitting","Interior Painting","Solar Setup",
  "LED Installation","Bathroom Fitting","Carpentry","Appliance Repair","Gardening",
  "Cleaning","Welding","Plumbing","Panel Upgrade","Generator Repair",
];

export default function SPProfile() {
  const { user, setUserData } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    category: "",
    bio: "",
    skills: [],
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    category: "",
    bio: "",
    skills: [],
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await providerApi.getProfile();
      const data = response.data;
      setProfile(data);
      setForm(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await providerApi.updateProfile(form);
      setProfile(response.data);
      setUserData(response.data, localStorage.getItem("token"));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
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
  const initials = (form.name || "P").split(" ").map(n => n[0]).join("").toUpperCase();
  const PROVIDER_NAME = user?.name || "Provider";

  if (loading) return <div className="provider-layout"><SPNavbar providerName={user?.name} /><main className="sm-container sm-section">Loading...</main></div>;

  return (
    <div className="provider-layout animate-fade">
      <SPNavbar providerName={PROVIDER_NAME} backTo="/provider" />

      <main className="sm-container sm-section" style={{maxWidth: '850px'}}>
        <section className="sm-card" style={{padding: '2.5rem', marginBottom: '2rem'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem'}}>
            <div style={{width: '80px', height: '80px', background: 'var(--sm-orange)', color: '#fff', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.8rem'}}>{initials}</div>
            <div>
              <h1 style={{fontSize: '1.75rem', fontWeight: 800, color: 'var(--sm-navy)', margin: '0 0 0.25rem'}}>{profile.name}</h1>
              <p style={{margin: 0, color: 'var(--sm-text-light)', fontSize: '0.9rem'}}>{profile.category} ·  {profile.location} ·  {profile.email}</p>
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
                  </button>
                ))}
              </div>
            </div>

            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem'}}>
              {saved && <span style={{display: 'flex', alignItems: 'center', color: 'var(--sm-success)', fontSize: '0.85rem', fontWeight: 600}}>Profile Saved</span>}
              <button className="sm-btn sm-btn-ghost" onClick={() => setForm(profile)}>Reset</button>
              <button className="sm-btn sm-btn-primary" disabled={!changed} onClick={handleSave}>Save Profile Updates</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

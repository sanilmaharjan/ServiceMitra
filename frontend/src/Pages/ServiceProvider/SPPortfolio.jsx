import React from "react";
import { useNavigate } from "react-router-dom";
import SPNavbar from "../../Components/SPNavbar";
import "../../Styles/SP.css";

const PROVIDER_NAME = "Ramesh Sharma";

const provider = {
  name: "Ramesh Sharma",
  category: "Electrical & Plumbing",
  location: "Kathmandu, Nepal",
  memberSince: "Jan 2023",
  bio: "Certified electrician and plumber with 8+ years experience. Specializing in AC repair, home wiring, and plumbing solutions. Reliable and high-quality service guaranteed.",
  rating: 4.8,
  totalReviews: 63,
  completedJobs: 7,
  earnings: "NRS 45,200",
  skills: ["AC Installation", "Electrical Wiring", "Pipe Fitting", "Solar Setup", "Generator Repair"],
  recentProjects: [
    { title: "Solar Panel Installation", client: "Priya Lama", amount: "NRS 18,000", date: "Jan 2026" },
    { title: "Full Electrical Rewiring", client: "Hotel Himalaya", amount: "NRS 12,500", date: "Feb 2026" },
    { title: "Bathroom Plumbing Setup", client: "Rajan Pandey", amount: "NRS 7,200", date: "Mar 2026" },
  ],
  certifications: [
    { title: "Certified Master Electrician", issuer: "CTEVT Nepal", year: "2018" },
    { title: "Advanced Plumbing Certificate", issuer: "Skill Lab, Kathmandu", year: "2021" },
    { title: "Safety Protocol Certified", issuer: "Labor Dept. of Nepal", year: "2022" },
  ],
  reviews: [
    { id: 1, client: "Sunita Rai", rating: 5, comment: "Excellent work! Fixed my AC in under an hour. Very professional.", date: "March 2026" },
    { id: 2, client: "Anita Shrestha", rating: 5, comment: "Came on time, fixed the pipe quickly.", date: "March 2026" },
    { id: 3, client: "Bikram Thapa", rating: 4, comment: "Good quality work on the painting. Friendly professional.", date: "Feb 2026" },
  ],
};

export default function SPPortfolio() {
  const navigate = useNavigate();
  const initials = provider.name.split(" ").map(n => n[0]).join("");

  return (
    <div className="provider-layout animate-fade">
      <SPNavbar providerName={PROVIDER_NAME} backTo="/provider" />

      <main className="sm-container sm-section" style={{maxWidth: '1000px'}}>
        {/* --- Hero Section --- */}
        <section className="sm-card" style={{padding: '3rem', display: 'flex', gap: '2.5rem', alignItems: 'center', marginBottom: '2.5rem', background: 'var(--sm-navy)', color: '#fff'}}>
          <div style={{width: '100px', height: '100px', background: 'var(--sm-white)', color: 'var(--sm-navy)', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 900}}>{initials}</div>
          <div style={{flex: 1}}>
            <h1 style={{fontSize: '2.2rem', fontWeight: 800, margin: '0 0 0.5rem'}}>{provider.name}</h1>
            <p style={{fontSize: '1.1rem', opacity: 0.9, margin: '0 0 1rem'}}>{provider.category} · 📍 {provider.location}</p>
            <div style={{display: 'flex', gap: '1.5rem', fontSize: '0.9rem', opacity: 0.8}}>
              <span>⭐ {provider.rating} ({provider.totalReviews} Reviews)</span>
              <span>📅 {provider.memberSince}</span>
              <span>✅ {provider.completedJobs} Jobs</span>
            </div>
          </div>
        </section>

        <div className="sm-grid" style={{gridTemplateColumns: '1.5fr 1fr'}}>
          <div>
            {/* --- Bio --- */}
            <section className="sm-card" style={{marginBottom: '2rem'}}>
              <h3 style={{fontSize: '1.25rem', fontWeight: 800, color: 'var(--sm-navy)', marginBottom: '1rem'}}>Professional Bio</h3>
              <p style={{fontSize: '1rem', color: 'var(--sm-text-mid)', lineHeight: '1.7', margin: 0}}>{provider.bio}</p>
            </section>

            {/* --- Certificates Section --- */}
            <section className="sm-card" style={{marginBottom: '2rem'}}>
              <h3 style={{fontSize: '1.25rem', fontWeight: 800, color: 'var(--sm-navy)', marginBottom: '1.5rem'}}>Certifications</h3>
              <div className="sm-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem'}}>
                {provider.certifications.map((cert, i) => (
                  <div key={i} style={{padding: '1.25rem', border: '1px solid var(--sm-gray-border)', borderRadius: '12px', background: 'var(--sm-gray-light)'}}>
                    <div style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>🏆</div>
                    <div style={{fontWeight: 700, fontSize: '0.95rem', color: 'var(--sm-navy)', marginBottom: '0.25rem'}}>{cert.title}</div>
                    <div style={{fontSize: '0.8rem', color: 'var(--sm-text-light)'}}>{cert.issuer} · {cert.year}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* --- Client Reviews --- */}
            <section className="sm-card">
              <h3 style={{fontSize: '1.25rem', fontWeight: 800, color: 'var(--sm-navy)', marginBottom: '1.5rem'}}>Client Reviews</h3>
              <div className="sm-grid">
                {provider.reviews.map((rev, i) => (
                  <div key={rev.id} style={{paddingBottom: '1.25rem', borderBottom: i < provider.reviews.length - 1 ? '1px solid var(--sm-gray-border)' : 'none', marginBottom: i < provider.reviews.length - 1 ? '1.25rem' : '0'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                      <div style={{fontWeight: 700, fontSize: '0.95rem'}}>{rev.client}</div>
                      <div style={{color: 'var(--sm-orange)', fontWeight: 800}}>⭐ {rev.rating}</div>
                    </div>
                    <p style={{margin: '0 0 0.5rem', fontSize: '0.85rem', color: 'var(--sm-text-mid)', fontStyle: 'italic'}}>"{rev.comment}"</p>
                    <div style={{fontSize: '0.75rem', color: 'var(--sm-text-light)'}}>{rev.date}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="sm-grid" style={{alignContent: 'start'}}>
            {/* --- Stats Summary --- */}
            <section className="sm-card" style={{marginBottom: '2rem'}}>
              <h3 style={{fontSize: '1.1rem', fontWeight: 800, color: 'var(--sm-navy)', marginBottom: '1.25rem'}}>Performance</h3>
              <div className="sm-grid" style={{gap: '1rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--sm-gray-light)', borderRadius: '8px'}}>
                   <span style={{color: 'var(--sm-text-light)', fontSize: '0.85rem'}}>Earnings</span>
                   <span style={{fontWeight: 800, color: 'var(--sm-success)'}}>{provider.earnings}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--sm-gray-light)', borderRadius: '8px'}}>
                   <span style={{color: 'var(--sm-text-light)', fontSize: '0.85rem'}}>Experience</span>
                   <span style={{fontWeight: 800, color: 'var(--sm-navy)'}}>8+ Years</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--sm-gray-light)', borderRadius: '8px'}}>
                   <span style={{color: 'var(--sm-text-light)', fontSize: '0.85rem'}}>Success Rate</span>
                   <span style={{fontWeight: 800, color: 'var(--sm-orange)'}}>96%</span>
                </div>
              </div>
            </section>

            {/* --- Skills --- */}
            <section className="sm-card" style={{marginBottom: '2rem'}}>
              <h3 style={{fontSize: '1.1rem', fontWeight: 800, color: 'var(--sm-navy)', marginBottom: '1rem'}}>Expertise</h3>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                {provider.skills.map(s => (
                  <span key={s} className="sm-badge sm-badge-info" style={{background: 'var(--sm-navy-light)', color: 'var(--sm-navy)', textTransform: 'none'}}>{s}</span>
                ))}
              </div>
            </section>

            {/* --- Recent Work --- */}
            <section className="sm-card">
              <h3 style={{fontSize: '1.1rem', fontWeight: 800, color: 'var(--sm-navy)', marginBottom: '1rem'}}>Recent History</h3>
              <div className="sm-grid" style={{gap: '0.75rem'}}>
                {provider.recentProjects.map((p, i) => (
                  <div key={i} style={{fontSize: '0.85rem', color: 'var(--sm-text-mid)', borderLeft: '3px solid var(--sm-orange)', paddingLeft: '0.75rem'}}>
                     <div style={{fontWeight: 700, color: 'var(--sm-text-dark)'}}>{p.title}</div>
                     <div style={{fontSize: '0.75rem', color: 'var(--sm-text-light)'}}>{p.date}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

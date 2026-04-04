import React from "react";
import { useNavigate } from "react-router-dom";
import SPNavbar from "../../Components/SPNavbar";
import "../../Styles/SP.css";

const PROVIDER_NAME = "Ramesh Sharma";

const provider = {
  name: "Ramesh Sharma",
  category: "Electrical & Plumbing",
  location: "Kathmandu, Nepal",
  memberSince: "January 2023",
  bio: "Certified electrician and plumber with over 8 years of experience serving residential and commercial clients across the Kathmandu Valley. Specializing in AC installation, wiring, and plumbing solutions.",
  rating: 4.8,
  totalReviews: 63,
  completedJobs: 7,
  totalBids: 23,
  acceptedBids: 9,
  earnings: "NRS 45,200",
  skills: [
    "AC Installation & Repair", "Electrical Wiring", "Pipe Fitting",
    "Water Heater Installation", "Circuit Breaker Repair", "Solar Panel Setup",
    "Bathroom Fitting", "Generator Repair",
  ],
  certifications: [
    { title: "Certified Electrician",     issuer: "CTEVT Nepal",              year: "2018" },
    { title: "Plumbing Excellence Award", issuer: "Nepal Plumbers Assoc.",    year: "2022" },
    { title: "Safety Training Certified", issuer: "Labor Department Nepal",   year: "2021" },
  ],
  reviews: [
    { id: 1, client: "Sunita Rai",    rating: 5, comment: "Excellent work! Fixed my AC in under an hour. Very professional.", date: "March 2026", job: "AC Repair" },
    { id: 2, client: "Anita Shrestha",rating: 5, comment: "Came on time, fixed the pipe quickly. Very reasonable price.",      date: "March 2026", job: "Pipe Leakage Fix" },
    { id: 3, client: "Rajan Pandey",  rating: 4, comment: "Good service. Would recommend to others.",                          date: "February 2026", job: "Wiring Repair" },
    { id: 4, client: "Priya Lama",    rating: 5, comment: "Outstanding! The best technician I've hired on ServiceMitra.",       date: "January 2026", job: "Solar Panel Setup" },
  ],
  completedProjects: [
    { title: "Solar Panel Installation",  client: "Priya Lama",     amount: "NRS 18,000", date: "Jan 2026", icon: "☀️" },
    { title: "Full Electrical Rewiring",  client: "Hotel Himalaya", amount: "NRS 12,500", date: "Feb 2026", icon: "⚡" },
    { title: "Bathroom Plumbing Setup",   client: "Rajan Pandey",   amount: "NRS 7,200",  date: "Mar 2026", icon: "🚿" },
    { title: "AC Installation x3 Units", client: "Office Complex",  amount: "NRS 9,500",  date: "Mar 2026", icon: "❄️" },
  ],
};

function StarRating({ rating }) {
  return (
    <div className="sp-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(rating) ? "sp-star filled" : "sp-star"}>★</span>
      ))}
      <span className="sp-rating-num">{rating}</span>
    </div>
  );
}

export default function SPPortfolio() {
  const navigate = useNavigate();
  const initials = provider.name.split(" ").map((n) => n[0]).join("");

  return (
    <div className="sp-layout">
      <SPNavbar providerName={PROVIDER_NAME} backTo="/provider" />

      <main className="sp-main">
        {/* Hero Banner */}
        <div className="sp-portfolio-hero">
          <div className="sp-portfolio-hero-bg" />
          <div className="sp-portfolio-hero-content">
            <div className="sp-portfolio-avatar-lg">{initials}</div>
            <div className="sp-portfolio-info">
              <h1 className="sp-portfolio-name">{provider.name}</h1>
              <span className="sp-portfolio-category">{provider.category}</span>
              <p className="sp-portfolio-bio">{provider.bio}</p>
              <div className="sp-portfolio-hero-meta">
                <span>📍 {provider.location}</span>
                <span>📅 Member since {provider.memberSince}</span>
                <span>⭐ {provider.rating} ({provider.totalReviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="sp-portfolio-stats-row">
          {[
            { icon: "✅", value: provider.completedJobs, label: "Completed Jobs" },
            { icon: "🏷️", value: provider.totalBids,    label: "Total Bids" },
            { icon: "🎯", value: provider.acceptedBids,  label: "Bids Won" },
            { icon: "💰", value: provider.earnings,      label: "Total Earned" },
          ].map((s, i) => (
            <div key={i} className="sp-portfolio-stat-card">
              <span className="sp-portfolio-stat-icon">{s.icon}</span>
              <span className="sp-portfolio-stat-value">{s.value}</span>
              <span className="sp-portfolio-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Two-column grid */}
        <div className="sp-portfolio-grid">
          <div className="sp-portfolio-section">
            <h3 className="sp-portfolio-section-title">🛠️ Skills & Expertise</h3>
            <div className="sp-portfolio-skills">
              {provider.skills.map((skill) => (
                <span key={skill} className="sp-portfolio-skill-tag">{skill}</span>
              ))}
            </div>
          </div>

          <div className="sp-portfolio-section">
            <h3 className="sp-portfolio-section-title">🏅 Certifications</h3>
            <div className="sp-certifications-list">
              {provider.certifications.map((cert) => (
                <div key={cert.title} className="sp-cert-item">
                  <div className="sp-cert-icon">🏅</div>
                  <div>
                    <div className="sp-cert-title">{cert.title}</div>
                    <div className="sp-cert-issuer">{cert.issuer} · {cert.year}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sp-portfolio-section">
            <h3 className="sp-portfolio-section-title">🎉 Completed Projects</h3>
            <div className="sp-projects-list">
              {provider.completedProjects.map((proj) => (
                <div key={proj.title} className="sp-project-item">
                  <div className="sp-project-icon">{proj.icon}</div>
                  <div className="sp-project-info">
                    <div className="sp-project-title">{proj.title}</div>
                    <div className="sp-project-meta">{proj.client} · {proj.date}</div>
                  </div>
                  <div className="sp-project-amount">{proj.amount}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="sp-portfolio-section">
            <h3 className="sp-portfolio-section-title">⭐ Client Reviews</h3>
            <div className="sp-reviews-list">
              {provider.reviews.map((review) => (
                <div key={review.id} className="sp-review-item">
                  <div className="sp-review-header">
                    <div className="sp-review-avatar">{review.client[0]}</div>
                    <div>
                      <div className="sp-review-client">{review.client}</div>
                      <div className="sp-review-job">{review.job} · {review.date}</div>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="sp-review-comment">"{review.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

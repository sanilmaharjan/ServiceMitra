import React from "react";
import "../Styles/Global.css";

const teamMembers = [
  { name: "Ankit Shrestha", role: "Project Manager", bio: "Leading the vision of ServiceMitra with 5+ years of PM experience." },
  { name: "Binish Thapa", role: "Frontend Developer", bio: "Passionate about creating seamless and beautiful user interfaces." },
  { name: "Chanda Rai", role: "Backend Architect", bio: "Expert in scalable systems and secure database management." },
  { name: "Dinesh Maharjan", role: "UI/UX Designer", bio: "Focusing on human-centered design and intuitive workflows." },
  { name: "Esha Poudel", role: "Quality Assurance", bio: "Ensuring every service request is processed without a hitch." },
  { name: "Farhan Ali", role: "Mobile Lead", bio: "Bridging the gap between web and mobile for ServiceMitra." },
  { name: "Gita Gurung", role: "Marketing Head", bio: "Connecting our community with the best service providers in town." },
];

export default function AboutUs() {
  return (
    <div className="d-flex flex-column min-vh-100 animate-fade">
      <main className="flex-grow-1">
        <section className="sm-section text-center" style={{ background: "var(--sm-navy)", color: "#fff", padding: "5rem 1rem" }}>
          <div className="sm-container">
            <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "1.5rem" }}>About Service<span>Mitra</span></h1>
            <p style={{ fontSize: "1.2rem", maxWidth: "800px", margin: "0 auto", opacity: 0.9, lineHeight: "1.8" }}>
              ServiceMitra is Nepal's leading platform connecting households with trusted, verified local service providers.
              Our mission is to simplify home maintenance and empower local professionals by providing a transparent,
              efficient, and reliable marketplace for all your service needs.
            </p>
          </div>
        </section>

        <section className="sm-section sm-container">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--sm-navy)" }}>Meet Our Team</h2>
            <div style={{ width: "80px", height: "5px", background: "var(--sm-orange)", margin: "1rem auto" }}></div>
            <p style={{ color: "var(--sm-text-mid)" }}>The passionate individuals behind the ServiceMitra platform.</p>
          </div>

          <div className="sm-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
            {teamMembers.map((member, i) => (
              <div key={i} className="sm-card" style={{ textAlign: "center", padding: "2.5rem 1.5rem", transition: "transform 0.3s" }}>
                <div style={{
                  width: "100px",
                  height: "100px",
                  background: "var(--sm-navy-light)",
                  color: "var(--sm-navy)",
                  borderRadius: "30px",
                  margin: "0 auto 1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  fontWeight: 900
                }}>
                  {member.name.split(" ").map(n => n[0]).join("")}
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--sm-navy)", margin: "0 0 0.5rem" }}>{member.name}</h3>
                <div style={{ fontSize: "0.9rem", color: "var(--sm-orange)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>{member.role}</div>
                <p style={{ fontSize: "0.85rem", color: "var(--sm-text-mid)", margin: 0, lineHeight: "1.6" }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

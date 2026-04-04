import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SPNavbar from "../../Components/SPNavbar";
import "../../Styles/SP.css";

const PROVIDER_NAME = "Ramesh Sharma";

const mockStats = {
  activePosts: 12,
  totalBids: 23,
  earnings: 45200,
};

export default function SPDashboard() {
  const navigate = useNavigate();

  const [animated, setAnimated] = useState({
    activePosts: 0,
    totalBids: 0,
    earnings: 0,
  });

  useEffect(() => {
    const steps = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const ease = 1 - Math.pow(1 - step / steps, 3);
      setAnimated({
        activePosts: Math.round(mockStats.activePosts * ease),
        totalBids: Math.round(mockStats.totalBids * ease),
        earnings: Math.round(mockStats.earnings * ease),
      });
      if (step >= steps) clearInterval(timer);
    }, 1000 / steps);
    return () => clearInterval(timer);
  }, []);

  const cards = [
    {
      title: "Active Requests",
      value: animated.activePosts,
      icon: "🔍",
      color: "var(--sm-navy)",
      subtitle: "New jobs in your area",
      route: "/provider/posts",
      badge: "Browse Jobs",
    },
    {
      title: "My Proposals",
      value: animated.totalBids,
      icon: "✉️",
      color: "var(--sm-orange)",
      subtitle: "Bids awaiting review",
      route: "/provider/bids",
      badge: "Manage Bids",
    },
    {
      title: "Total Earnings",
      value: `NRS ${animated.earnings.toLocaleString()}`,
      icon: "💰",
      color: "var(--sm-success)",
      subtitle: "Lifetime platform income",
      route: "/provider/portfolio",
      badge: "Portfolio",
    },
  ];

  return (
    <div className="provider-layout animate-fade">
      <SPNavbar providerName={PROVIDER_NAME} />

      <main className="sm-container sm-section">
        {/* --- Header --- */}
        <header className="page-header" style={{marginBottom: '2.5rem'}}>
          <h1 style={{fontSize: '2rem', fontWeight: 800, color: 'var(--sm-navy)', margin: 0}}>Provider Dashboard</h1>
          <p style={{color: 'var(--sm-text-mid)', marginTop: '0.4rem'}}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </header>

        {/* --- Welcome Quick Actions --- */}
        <section className="sm-card" style={{padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', background: 'linear-gradient(135deg, var(--sm-navy), #1e293b)', color: '#fff'}}>
          <div>
            <h2 style={{fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem'}}>Welcome back, {PROVIDER_NAME.split(" ")[0]}!</h2>
            <p style={{margin: 0, opacity: 0.8, fontSize: '0.95rem'}}>You have {mockStats.activePosts} potential job matches waiting for your bid.</p>
          </div>
          <div style={{display: 'flex', gap: '0.75rem'}}>
            <button className="sm-btn" style={{background: 'var(--sm-orange)', color: '#fff'}} onClick={() => navigate("/provider/posts")}>Find Work Now</button>
            <button className="sm-btn sm-btn-outline" style={{borderColor: 'rgba(255,255,255,0.3)', color: '#fff'}} onClick={() => navigate("/provider/portfolio")}>View Profile</button>
          </div>
        </section>

        {/* --- Stats Grid --- */}
        <div className="sm-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'}}>
          {cards.map((card, i) => (
            <div key={card.title} className="sm-card animate-fade" onClick={() => navigate(card.route)} style={{cursor: 'pointer', padding: '1.75rem', animationDelay: `${i * 0.1}s`}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
                <div style={{width: '50px', height: '50px', background: 'var(--sm-gray-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'}}>{card.icon}</div>
                <span style={{fontSize: '0.75rem', fontWeight: 700, background: 'var(--sm-gray-light)', color: card.color, padding: '0.25rem 0.75rem', borderRadius: '50px'}}>{card.badge}</span>
              </div>
              <div style={{fontSize: '2.5rem', fontWeight: 900, color: 'var(--sm-navy)', marginBottom: '0.25rem'}}>{card.value}</div>
              <h3 style={{fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem', color: 'var(--sm-text-dark)'}}>{card.title}</h3>
              <p style={{fontSize: '0.85rem', color: 'var(--sm-text-light)', margin: 0}}>{card.subtitle}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../Components/AdminNavbar";
import "../../Styles/Admin.css";

const mockStats = {
  users: 128,
  serviceProviders: 47,
  pendingKYC: 12,
  pendingPayments: 8,
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [animatedStats, setAnimatedStats] = useState({
    users: 0, serviceProviders: 0, pendingKYC: 0, pendingPayments: 0,
  });

  useEffect(() => {
    const duration = 1000;
    const steps = 40;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3);
      setAnimatedStats({
        users: Math.round(mockStats.users * ease),
        serviceProviders: Math.round(mockStats.serviceProviders * ease),
        pendingKYC: Math.round(mockStats.pendingKYC * ease),
        pendingPayments: Math.round(mockStats.pendingPayments * ease),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  const cards = [
    { title: "Total Users", value: animatedStats.users, icon: "👥", route: "/admin/users", badge: "+12 week" },
    { title: "Service Providers", value: animatedStats.serviceProviders, icon: "🛠️", route: "/admin/service-providers", badge: "+3 week" },
    { title: "Pending KYC", value: animatedStats.pendingKYC, icon: "📋", route: "/admin/kyc", badge: "Action Needed", urgent: true },
    { title: "Pending Payouts", value: animatedStats.pendingPayments, icon: "💳", route: "/admin/payments", badge: "Authorize Now", urgent: true },
  ];

  return (
    <div className="admin-layout animate-fade">
      <AdminNavbar />

      <main className="sm-container sm-section">
        <header className="page-header" style={{marginBottom: '2.5rem'}}>
          <h1 style={{fontSize: '2rem', fontWeight: 800, color: 'var(--sm-navy)', margin: 0}}>Admin Control Panel</h1>
          <p style={{color: 'var(--sm-text-mid)', marginTop: '0.4rem'}}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </header>

        <div className="sm-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))'}}>
          {cards.map((card, i) => (
            <div key={card.route} className="sm-card animate-fade" onClick={() => navigate(card.route)} style={{cursor: 'pointer', padding: '1.75rem', animationDelay: `${i * 0.1}s`}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem'}}>
                <div style={{width: '48px', height: '48px', background: 'var(--sm-gray-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem'}}>{card.icon}</div>
                {card.urgent && <span className="sm-badge sm-badge-danger">Urgent</span>}
              </div>
              <div style={{fontSize: '2.5rem', fontWeight: 900, color: 'var(--sm-navy)', marginBottom: '0.25rem'}}>{card.value}</div>
              <h3 style={{fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.5rem', color: 'var(--sm-text-mid)'}}>{card.title}</h3>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--sm-gray-border)'}}>
                 <span style={{fontSize: '0.75rem', color: 'var(--sm-text-light)', fontWeight: 600}}>{card.badge}</span>
                 <span style={{color: 'var(--sm-orange)', fontWeight: 800}}>→</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

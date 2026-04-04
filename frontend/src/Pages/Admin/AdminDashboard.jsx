import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/Admin.css";

const mockStats = {
  users: 128,
  serviceProviders: 47,
  pendingKYC: 12,
  pendingPayments: 8,
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { text: "Good Morning", emoji: "☀️" };
  if (hour >= 12 && hour < 17) return { text: "Good Afternoon", emoji: "🌤️" };
  return { text: "Good Evening", emoji: "🌙" };
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const greeting = getGreeting();
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    serviceProviders: 0,
    pendingKYC: 0,
    pendingPayments: 0,
  });

  useEffect(() => {
    const duration = 1200;
    const steps = 60;
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
    {
      title: "Total Users",
      value: animatedStats.users,
      icon: "👥",
      gradient: "card-gradient-blue",
      subtitle: "Registered customers",
      route: "/admin/users",
      badge: "+12 this week",
    },
    {
      title: "Service Providers",
      value: animatedStats.serviceProviders,
      icon: "🛠️",
      gradient: "card-gradient-green",
      subtitle: "Active professionals",
      route: "/admin/service-providers",
      badge: "+3 this week",
    },
    {
      title: "Pending KYC",
      value: animatedStats.pendingKYC,
      icon: "📋",
      gradient: "card-gradient-orange",
      subtitle: "Awaiting verification",
      route: "/admin/kyc",
      badge: "Action needed",
      urgent: true,
    },
    {
      title: "Pending Payments",
      value: animatedStats.pendingPayments,
      icon: "💳",
      gradient: "card-gradient-green",
      subtitle: "Provider payouts",
      route: "/admin/payments",
      badge: "Review now",
      urgent: true,
    },
  ];

  return (
    <div className="admin-layout">
      {/* Navbar */}
      <nav className="admin-navbar">
        <div className="admin-navbar-brand">
          <span className="admin-brand-text">Service<span>Mitra</span> Admin</span>
        </div>
        <div className="admin-navbar-right">
          <div className="admin-greeting">
            <span className="greeting-emoji">{greeting.emoji}</span>
            <span className="greeting-text">{greeting.text}, Admin!</span>
          </div>
          <button className="admin-logout-btn" onClick={() => navigate("/login")}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="admin-main">
        {/* Page Header */}
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Dashboard Overview</h1>
            <p className="admin-page-subtitle">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="admin-cards-grid">
          {cards.map((card, index) => (
            <div
              key={card.route}
              className={`admin-card ${card.gradient}`}
              onClick={() => navigate(card.route)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="admin-card-header">
                <div className="admin-card-icon">{card.icon}</div>
                {card.urgent && <span className="admin-card-dot"></span>}
              </div>
              <div className="admin-card-value">{card.value}</div>
              <div className="admin-card-title">{card.title}</div>
              <div className="admin-card-subtitle">{card.subtitle}</div>
              <div className="admin-card-footer">
                <span className={`admin-card-badge ${card.urgent ? "badge-urgent" : "badge-info"}`}>
                  {card.badge}
                </span>
                <span className="admin-card-arrow">→</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

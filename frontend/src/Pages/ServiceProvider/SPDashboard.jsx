import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SPNavbar from "../../Components/SPNavbar";
import "../../Styles/SP.css";

const PROVIDER_NAME = "Ramesh Sharma";

const mockStats = {
  activePosts: 8,
  totalBids: 23,
  wonBids: 7,
  earnings: 45200,
};

export default function SPDashboard() {
  const navigate = useNavigate();

  const [animated, setAnimated] = useState({
    activePosts: 0,
    totalBids: 0,
    wonBids: 0,
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
        wonBids: Math.round(mockStats.wonBids * ease),
        earnings: Math.round(mockStats.earnings * ease),
      });
      if (step >= steps) clearInterval(timer);
    }, 1200 / steps);
    return () => clearInterval(timer);
  }, []);

  const cards = [
    {
      title: "Active Posts",
      value: animated.activePosts,
      icon: "📋",
      gradient: "sp-card-blue",
      subtitle: "Open service requests",
      route: "/provider/posts",
      badge: "View all",
    },
    {
      title: "My Bids",
      value: animated.totalBids,
      icon: "🏷️",
      gradient: "sp-card-orange",
      subtitle: "Total bids placed",
      route: "/provider/bids",
      badge: "Track bids",
    },
    {
      title: "Won Bids",
      value: animated.wonBids,
      icon: "🏆",
      gradient: "sp-card-green",
      subtitle: "Successfully awarded",
      route: "/provider/bids",
      badge: "View details",
    },
    {
      title: "Total Earnings",
      value: `NRS ${animated.earnings.toLocaleString()}`,
      icon: "💰",
      gradient: "sp-card-purple",
      subtitle: "Lifetime earnings",
      route: "/provider/portfolio",
      badge: "See portfolio",
    },
  ];

  return (
    <div className="sp-layout">
      <SPNavbar providerName={PROVIDER_NAME} />

      <main className="sp-main">
        {/* Page Header */}
        <div className="sp-page-header">
          <div>
            <h1 className="sp-page-title">Dashboard Overview</h1>
            <p className="sp-page-subtitle">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="sp-header-badge">
            <span className="sp-status-dot" />
            Active Provider
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="sp-welcome-banner">
          <div className="sp-welcome-left">
            <div>
              <h2 className="sp-welcome-name">Welcome back, {PROVIDER_NAME}! 👋</h2>
              <p className="sp-welcome-sub">
                You have{" "}
                <strong>{mockStats.activePosts} open posts</strong> and{" "}
                <strong>{mockStats.totalBids} bids</strong> to track today.
              </p>
            </div>
          </div>
          <div className="sp-welcome-actions">
            <button className="sp-btn-primary" onClick={() => navigate("/provider/posts")}>
              Browse Posts →
            </button>
            <button className="sp-btn-ghost" onClick={() => navigate("/provider/portfolio")}>
              View Portfolio
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="sp-cards-grid">
          {cards.map((card, index) => (
            <div
              key={card.title}
              className={`sp-card ${card.gradient}`}
              onClick={() => navigate(card.route)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="sp-card-header">
                <div className="sp-card-icon">{card.icon}</div>
              </div>
              <div className="sp-card-value">{card.value}</div>
              <div className="sp-card-title">{card.title}</div>
              <div className="sp-card-subtitle">{card.subtitle}</div>
              <div className="sp-card-footer">
                <span className="sp-card-badge">{card.badge}</span>
                <span className="sp-card-arrow">→</span>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}

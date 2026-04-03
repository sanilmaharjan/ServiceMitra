import React, { useState } from "react";
import "../styles/Auth.css";

const serviceCategories = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Cleaning",
  "Painting",
  "Landscaping",
  "HVAC / AC Repair",
  "Appliance Repair",
  "Pest Control",
  "Tutoring",
  "Beauty & Wellness",
  "Other",
];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("client");       // "client" | "provider"
  const [category, setCategory] = useState("");

  return (
    <div className="auth-container">
      <div className={`auth-card ${isLogin ? "login-mode" : "register-mode"}`}>

        <div className="auth-form-panel login-panel">
          <h2>Sign In</h2>
          <p>Welcome back! Please sign in.</p>
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Email" className="auth-input" required />
            <input type="password" placeholder="Password" className="auth-input" required />
            <div className="forgot-link">
              <a href="#">Forgot password?</a>
            </div>
            <button type="submit" className="btn-solid">SIGN IN</button>
          </form>
        </div>

        <div className="auth-form-panel register-panel">
          <h2>Create Account</h2>
          <p>Create your ServiceMitra account</p>
          <form onSubmit={(e) => e.preventDefault()}>
            {/* Role toggle */}
            <div className="role-toggle">
              <button
                type="button"
                className={`role-btn ${role === "client" ? "role-active" : ""}`}
                onClick={() => { setRole("client"); setCategory(""); }}
              >
                Client
              </button>
              <button
                type="button"
                className={`role-btn ${role === "provider" ? "role-active" : ""}`}
                onClick={() => setRole("provider")}
              >
                Service Provider
              </button>
            </div>

            <input type="text" placeholder="Full Name" className="auth-input" required />
            <input type="email" placeholder="Email" className="auth-input" required />
            <input type="tel" placeholder="Phone Number" className="auth-input" required />
            <input type="password" placeholder="Password" className="auth-input" required />
            <input type="password" placeholder="Confirm Password" className="auth-input" required />

            {/* Category — only for service providers */}
            {role === "provider" && (
              <select
                className="auth-input auth-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" disabled>Select Service Category</option>
                {serviceCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            )}

            <button type="submit" className="btn-solid">SIGN UP</button>
          </form>
        </div>

        <div className="auth-overlay-wrapper">
          <div className="auth-overlay-panel">
            {isLogin ? (
              <div className="overlay-content">
                <h2>Hello, Friend 👋</h2>
                <p>New here? Create an account and start hiring local professionals.</p>
                <button className="btn-ghost" onClick={() => setIsLogin(false)}>
                  SIGN UP
                </button>
              </div>
            ) : (
              <div className="overlay-content">
                <h2>Welcome Back 👋</h2>
                <p>Already registered? Sign in to continue your work.</p>
                <button className="btn-ghost" onClick={() => setIsLogin(true)}>
                  SIGN IN
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;

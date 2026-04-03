import React, { useState } from "react";
import "../styles/Auth.css";

const serviceCategories = [
  "Cleaning",
  "Plumbing",
  "Electrical Appliance Repairing",
  "Servicing",
  "Painting",
];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("client");       // "client" | "provider"
  const [categories, setCategories] = useState([]);

  const toggleCategory = (cat) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

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
                onClick={() => { setRole("client"); setCategories([]); }}
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

            {/* Services — only for service providers */}
            {role === "provider" && (
              <div className="service-checkbox-group">
                <p className="service-checkbox-label">Select Services Offered</p>
                <div className="service-checkbox-grid">
                  {serviceCategories.map((cat) => (
                    <label key={cat} className={`service-checkbox-item ${categories.includes(cat) ? "checked" : ""}`}>
                      <input
                        type="checkbox"
                        value={cat}
                        checked={categories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                      />
                      <span className="checkbox-icon"></span>
                      {cat}
                    </label>
                  ))}
                </div>
              </div>
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

import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

// Service categories with IDs
const serviceCategories = [
  { id: 1, name: "Cleaning" },
  { id: 2, name: "Plumbing" },
  { id: 3, name: "Electrical Appliance Repairing" },
  { id: 4, name: "Servicing" },
  { id: 5, name: "Painting" },
];

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("client");
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // toggle categories by ID only
  const toggleCategory = (catId) => {
    setCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/users/login/", {
        email,
        password,
      });
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      navigate("/user");
    } catch (error) {
      console.error(error.response?.data || error);
      alert("Invalid login credentials");
    }
  };

  // REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/users/register/", {
        name,
        email,
        phone,
        password,
        role: role === "provider" ? "service_provider" : "client",
        category_ids: categories,
      });
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      navigate("/user");
    } catch (error) {
      console.error(error.response?.data || error);
      alert("Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className={`auth-card ${isLogin ? "login-mode" : "register-mode"}`}>

        {/* LOGIN PANEL */}
        <div className="auth-form-panel login-panel">
          <h2>Sign In</h2>
          <p>Welcome back! Please sign in.</p>
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" className="auth-input" required onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" className="auth-input" required onChange={(e) => setPassword(e.target.value)} />
            <div className="forgot-link"><a href="#">Forgot password?</a></div>
            <button type="submit" className="btn-solid">SIGN IN</button>
          </form>
        </div>

        {/* REGISTER PANEL */}
        <div className="auth-form-panel register-panel">
          <h2>Create Account</h2>
          <p>Create your ServiceMitra account</p>
          <form onSubmit={handleRegister}>

            {/* ROLE SWITCH */}
            <div className="role-toggle">
              <button type="button" className={`role-btn ${role === "client" ? "role-active" : ""}`} onClick={() => { setRole("client"); setCategories([]); }}>Client</button>
              <button type="button" className={`role-btn ${role === "provider" ? "role-active" : ""}`} onClick={() => setRole("provider")}>Service Provider</button>
            </div>

            <input type="text" placeholder="Full Name" className="auth-input" required onChange={(e) => setName(e.target.value)} />
            <input type="email" placeholder="Email" className="auth-input" required onChange={(e) => setEmail(e.target.value)} />
            <input type="tel" placeholder="Phone Number" className="auth-input" required onChange={(e) => setPhone(e.target.value)} />
            <input type="password" placeholder="Password" className="auth-input" required onChange={(e) => setPassword(e.target.value)} />
            <input type="password" placeholder="Confirm Password" className="auth-input" required onChange={(e) => setConfirmPassword(e.target.value)} />

            {/* SERVICE CATEGORIES */}
            {role === "provider" && (
              <div className="service-checkbox-group">
                <p className="service-checkbox-label">Select Services Offered</p>
                <div className="service-checkbox-grid">
                  {serviceCategories.map(cat => (
                    <label key={cat.id} className={`service-checkbox-item ${categories.includes(cat.id) ? "checked" : ""}`}>
                      <input type="checkbox" value={cat.id} checked={categories.includes(cat.id)} onChange={() => toggleCategory(cat.id)} />
                      <span className="checkbox-icon"></span>
                      {cat.name}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" className="btn-solid">SIGN UP</button>
          </form>
        </div>

        {/* OVERLAY PANEL */}
        <div className="auth-overlay-wrapper">
          <div className="auth-overlay-panel">
            {isLogin ? (
              <div className="overlay-content">
                <h2>Hello, Friend</h2>
                <p>New here? Create an account and start hiring local professionals.</p>
                <button className="btn-ghost" onClick={() => setIsLogin(false)}>SIGN UP</button>
              </div>
            ) : (
              <div className="overlay-content">
                <h2>Welcome Back</h2>
                <p>Already registered? Sign in to continue your work.</p>
                <button className="btn-ghost" onClick={() => setIsLogin(true)}>SIGN IN</button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;
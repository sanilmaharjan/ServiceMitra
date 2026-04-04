import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import { AuthContext } from "../context/authContext";
import api from "../utils/api";
import categoriesApi from "../utils/categoriesApi";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, token, setUserData } = useContext(AuthContext);

  useEffect(() => {
    if (token && user && user.role) {
      const timeout = setTimeout(() => {
        handleRedirect(user.role);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [user, token]);

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

  const handleRedirect = (userRole) => {
    if (userRole === "admin") navigate("/admin");
    else if (userRole === "provider") navigate("/provider");
    else navigate("/user");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      setIsSubmitting(true);
      const response = await api.post("/users/login/", data);
      setUserData(response.data.user, response.data.token);
      handleRedirect(response.data.user.role);
    } catch (error) {
      console.error("failed to login", error);
      alert(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUpHandle = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (formData.get("password") !== formData.get("confirmPassword")) {
      alert("Passwords do not match");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // If provider, fetch categories and map names to IDs
      let categoryIds = [];
      if (role === "provider" && categories.length > 0) {
        const catsResponse = await categoriesApi.getCategories();
        const allCategories = catsResponse.data || [];
        categoryIds = categories
          .map(catName => {
            const matched = allCategories.find(c => c.name.toLowerCase() === catName.toLowerCase());
            return matched ? matched.id : null;
          })
          .filter(id => id !== null);
      }

      const data = {
        email: formData.get("email"),
        password: formData.get("password"),
        name: formData.get("fullName"),
        phone: formData.get("phoneNumber"),
        role: role,
        category_ids: categoryIds,
      };

      const response = await api.post("/users/register/", data);
      setUserData(response.data.user, response.data.token);
      handleRedirect(response.data.user.role);
    } catch (error) {
      console.error("failed to register", error);
      alert(error.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="auth-container">
      <div className={`auth-card ${isLogin ? "login-mode" : "register-mode"}`}>

        {/* LOGIN PANEL */}
        <div className="auth-form-panel login-panel">
          <h2>Sign In</h2>
          <p>Welcome back! Please sign in.</p>
          <form onSubmit={handleSubmit}>
            <input name="email" type="email" placeholder="Email" className="auth-input" required />
            <input name="password" type="password" placeholder="Password" className="auth-input" required />
            <div className="forgot-link">
              <a href="#">Forgot password?</a>
            </div>
            <button type="submit" className="btn-solid">SIGN IN</button>
          </form>
        </div>

        {/* REGISTER PANEL */}
        <div className="auth-form-panel register-panel">
          <h2>Create Account</h2>
          <p>Create your ServiceMitra account</p>
          <form onSubmit={handleSignUpHandle}>
            {/* Role toggle */}
            <div className="role-toggle">
              <button type="button" className={`role-btn ${role === "client" ? "role-active" : ""}`} onClick={() => { setRole("client"); setCategories([]); }}>Client</button>
              <button type="button" className={`role-btn ${role === "provider" ? "role-active" : ""}`} onClick={() => setRole("provider")}>Service Provider</button>
            </div>

            <input name="fullName" type="text" placeholder="Full Name" className="auth-input" required />
            <input name="email" type="email" placeholder="Email" className="auth-input" required />
            <input name="phoneNumber" type="tel" placeholder="Phone Number" className="auth-input" required />
            <input name="password" type="password" placeholder="Password" className="auth-input" required />
            <input name="confirmPassword" type="password" placeholder="Confirm Password" className="auth-input" required />

            {/* SERVICE CATEGORIES */}
            {role === "provider" && (
              <div className="service-checkbox-group">
                <p className="service-checkbox-label">Select Services Offered</p>
                <div className="service-checkbox-grid">
                  {serviceCategories.map((cat) => (
                    <label key={cat} className={`service-checkbox-item ${categories.includes(cat) ? "checked" : ""}`}>
                      <input
                        name="serviceCheckbox"
                        type="checkbox"
                        value={cat}
                        checked={categories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                      />
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
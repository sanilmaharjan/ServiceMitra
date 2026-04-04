import React, { useContext, useState } from "react";
import "../styles/Auth.css";
// import { authContext, useUser } from "../context/authContext";
import { redirect } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const serviceCategories = [
  "Cleaning",
  "Plumbing",
  "Electrical Appliance Repairing",
  "Servicing",
  "Painting",
];

const BACKEND_URL = "http://localhost:8000/api"

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("client");
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {setUserData}= useContext(AuthContext)

  const toggleCategory = (cat) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = async(e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = JSON.stringify({
      email : formData.get("email"),
      password: formData.get("password")
    })
    console.log("data:", data)
    try {
      setIsSubmitting(true)
      const response = await fetch(`${BACKEND_URL}/users/login`, {body : data, method: "POST"} )
      if(!responseData.ok) {
        alert("failed")
        return
      }

      const responseData = await response.json()
      setUserData(responseData.data.user)
      redirect("/home")

      console.log("response Data: ", responseData)
    } catch (error) {
      console.error("failed to login", error)
    }
    setIsSubmitting(false)
  }

 const handleSignUpHandle= async(e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = JSON.stringify({
      email : formData.get("email"),
      password: formData.get("password"),
      name: formData.get("fullName"),
      phone: formData.get("phoneNumber"),
      role: role ,
      category_ids: [categories]

    })
    console.log("data:", data)
    try {
      setIsSubmitting(true)
      const response = await fetch(`${BACKEND_URL}/users/register`, {body : data, method: "POST"} )
      const responseData = await response.json()
      if(!responseData.ok) {
        alert("failed to register")
        return
      }
      setUserData(responseData.data.user)
      redirect("/home")
    } catch (error) {
      console.error("failed to login", error)
    }
    setIsSubmitting(false)
  }
  return (
    <div className="auth-container">
      <div className={`auth-card ${isLogin ? "login-mode" : "register-mode"}`}>

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

        <div className="auth-form-panel register-panel">
          <h2>Create Account</h2>
          <p>Create your ServiceMitra account</p>
          <form onSubmit={handleSignUpHandle}>
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

            <input name="fullName" type="text" placeholder="Full Name" className="auth-input" required />
            <input name="email" type="email" placeholder="Email" className="auth-input" required />
            <input name="phoneNumber" type="tel" placeholder="Phone Number" className="auth-input" required />
            <input name="password" type="password" placeholder="Password" className="auth-input" required />
            <input name="confirmPassword" type="password" placeholder="Confirm Password" className="auth-input" required />

            {/* Services — only for service providers */}
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

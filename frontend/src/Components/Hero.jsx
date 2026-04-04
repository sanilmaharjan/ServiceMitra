import React from "react";
import { Link } from "react-router-dom";
import "../styles/Hero.css";
import providerImg from "../assets/serviceprovider.jpg";

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="container-fluid px-4 px-xl-5">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-5 mb-lg-0 pe-lg-5">
            <h1 className="display-4 hero-heading mb-3">
              Book{" "}
              <span className="text-brand-orange">Home Service Providers</span>{" "}
              at your fingertips
            </h1>
            <p className="lead text-muted mb-5">
              Post your job requirements, receive competitive bids from verified
              local professionals, and choose the best fit for your needs.
            </p>
            <div className="d-flex flex-wrap gap-3 mb-5">
              <Link to="/login" className="btn btn-brand-orange px-4 py-3 rounded-pill fw-bold text-decoration-none">
                Post a Job for Free
              </Link>
              <button className="btn btn-outline-navy px-4 py-3 rounded-pill fw-bold">
                Explore Services
              </button>
            </div>
            <div className="d-flex align-items-center flex-wrap gap-2 mt-4">
              <span className="text-muted small fw-bold me-1">
                Popular Services:
              </span>
              <span className="badge rounded-pill bg-white text-dark border fw-normal px-3 py-2 popular-tag">
                Electrician
              </span>
              <span className="badge rounded-pill bg-white text-dark border fw-normal px-3 py-2 popular-tag">
                Plumber
              </span>
              <span className="badge rounded-pill bg-white text-dark border fw-normal px-3 py-2 popular-tag">
                Painting
              </span>
            </div>
          </div>
          <div className="col-lg-6 text-center">
            <div className="hero-image-wrapper">
              <img
                src={providerImg}
                alt="Verified Service Provider"
                className="hero-person-img"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;

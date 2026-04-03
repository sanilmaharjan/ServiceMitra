import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="custom-footer py-5 mt-5">
      <div className="container">
        <div className="row">
          <div className="row align-items-center small footer-text">
            <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
              &copy; {currentYear} ServiceMitra. All Rights Reserved.
            </div>
            <div className="col-md-6 text-center text-md-end">
              <span className="me-3">Reg. No: 123-456-789</span>
              <Link to="#" className="footer-link me-3">
                Privacy Policy
              </Link>
              <Link to="#" className="footer-link">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

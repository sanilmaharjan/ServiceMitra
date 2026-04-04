import React from 'react';
import '../Styles/ContactPage.css';

const ContactPage = () => {
  return (
    <div className="contact-container">
      <h2 className="contact-heading">Contact Us</h2>
      <p className="contact-description">
        Reach out to us for any queries, suggestions, or service requests. We are always happy to help!
      </p>

      <div className="contact-content">
        {/* Google Maps Iframe */}
        <div className="map-container">
          <iframe
            title="ServiceMitra Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.312658234063!2d85.309718!3d27.717245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190e5bcb3b7b%3A0x8c12c1a7f1d6f7a1!2sKathmandu!5e0!3m2!1sen!2snp!4v1680560000000!5m2!1sen!2snp"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Contact Info */}
        <div className="contact-info">
          <h3>Get in Touch</h3>
          <p>Email: <a href="mailto:servicemitra@example.com">servicemitra@example.com</a></p>
          <p>Phone: +977-1234567890</p>
          <p>Address: Kathmandu, Nepal</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
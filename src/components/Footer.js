import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-section">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/news">News</a></li>
          <li><a href="/portfolio">Portfolio</a></li>
          <li><a href="/account">Account</a></li>
        </ul>
      </div>
      <div className="footer-section">
        <h3>Contact Info</h3>
        <p>Email: support@stockwizard.com</p>
        <p>Phone: +91 7738077145</p>
        <p>Phone: +91 9867802679</p>
      </div>
      <div className="footer-section">
        <h3>Disclaimer</h3>
        <p>All information provided is for informational purposes only and is not intended for trading or investment advice.</p>
      </div>
      <div className="footer-section">
        <h3>Privacy Policy</h3>
        <p><a href="/privacy-policy">Read our privacy policy</a></p>
      </div>
    </footer>
  );
};

export default Footer;
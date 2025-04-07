// src/components/Footer.js
import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>📍 Arlington, TX | ✉️ contact@travella.com | ☎️ +1 (123) 456-7890</p>
        <p>© {new Date().getFullYear()} Travella. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
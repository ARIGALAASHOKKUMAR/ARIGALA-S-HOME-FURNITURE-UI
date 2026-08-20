import React from 'react';

const Footer = ({ token, setPanel, requireLogin }) => {
  return (
    <footer className="footer" id="contact">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="brand footer-logo">
            <div className="brand-icon">▰</div>
            <div>
              <h1>ARIGALA HOME</h1>
              <span>FURNITURE</span>
            </div>
          </div>
          <p>Crafting comfort and style for your beautiful home.</p>
          <div className="social-icons">
            <a href="#facebook">f</a>
            <a href="#instagram">◎</a>
            <a href="#twitter">𝕏</a>
            <a href="#pinterest">p</a>
          </div>
        </div>

        <div className="footer-column">
          <h3>QUICK LINKS</h3>
          <a href="#home">Home</a>
          <a href="#shop">Shop</a>
          <a href="#categories">Categories</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="footer-column">
          <h3>CUSTOMER CARE</h3>
          <a href="#account" onClick={(e) => { e.preventDefault(); setPanel(token ? "account" : "auth"); }}>
            My Account
          </a>
          <a href="#orders" onClick={(e) => { e.preventDefault(); if (requireLogin("orders")) setPanel("orders"); }}>
            Track Order
          </a>
          <a href="#wishlist" onClick={(e) => { e.preventDefault(); setPanel("wishlist"); }}>
            Wishlist
          </a>
          <a href="#returns">Returns & Refunds</a>
          <a href="#faq">FAQs</a>
        </div>

        <div className="footer-column footer-newsletter">
          <h3>NEWSLETTER</h3>
          <p>Subscribe to get updates on new arrivals and exclusive offers.</p>
          <div className="footer-email">
            <input placeholder="Your email" />
            <button>→</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Arigala Home Furniture. All Rights Reserved.</p>
        <div>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
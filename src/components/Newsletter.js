import React from 'react';

const Newsletter = ({ setNotice }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    setNotice("Thanks for subscribing — we'll be in touch.");
  };

  return (
    <section className="newsletter-section">
      <div>
        <span className="section-label">STAY IN THE LOOP</span>
        <h2>Get Inspired. Get Exclusive.</h2>
        <p>Subscribe to receive new arrivals, special offers and design inspiration.</p>
      </div>

      <form className="newsletter-form" onSubmit={handleSubmit}>
        <input type="email" placeholder="Enter your email address" />
        <button type="submit">
          Subscribe <span>→</span>
        </button>
      </form>
    </section>
  );
};

export default Newsletter;
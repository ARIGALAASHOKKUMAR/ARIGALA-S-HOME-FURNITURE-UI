import React from 'react';

const Promotion = () => {
  return (
    <section className="promotion-section">
      <div className="promotion-pattern" />
      <div className="promotion-icon">
        <span>✦</span>
      </div>
      <div className="promotion-content">
        <span>LIMITED TIME OFFER</span>
        <h2>Summer Sale <strong>is Live!</strong></h2>
        <p>Upgrade your home with up to 30% off selected furniture.</p>
      </div>
      <button 
        className="primary-button promotion-button" 
        onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
      >
        Shop Sale <span>→</span>
      </button>
    </section>
  );
};

export default Promotion;
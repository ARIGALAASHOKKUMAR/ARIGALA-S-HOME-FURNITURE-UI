import React from 'react';

const About = () => {
  return (
    <section className="about-section" id="about">
      <div className="about-image">
        <img
          src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=85"
          alt="Premium furniture interior"
        />
      </div>

      <div className="about-content">
        <span className="section-label">OUR STORY</span>
        <h2>
          Furniture That Makes
          <span> Your House Home</span>
        </h2>
        <p>
          At Arigala Home, we believe furniture should be more than just
          functional. Every piece is carefully selected to bring together
          comfort, craftsmanship and timeless design.
        </p>
        <p>
          From elegant living rooms to warm bedrooms, our collection is
          designed to create spaces you'll love coming home to.
        </p>
        <button className="outline-button">
          Discover Our Story <span>→</span>
        </button>
      </div>
    </section>
  );
};

export default About;
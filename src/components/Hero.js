import React from 'react';
import { heroSlides } from '../constants/data';

const Hero = ({ activeSlide, setActiveSlide, previousSlide, nextSlide }) => {
  const slide = heroSlides[activeSlide];

  return (
    <section className="hero-section" id="home">
      <div
        className="hero-background"
        style={{ backgroundImage: `url(${slide.image})` }}
      />

      <div className="hero-overlay" />

      <button
        className="hero-arrow hero-arrow-left"
        onClick={previousSlide}
        aria-label="Previous slide"
      >
        ‹
      </button>

      <div className="hero-content">
        <span className="hero-eyebrow">{slide.eyebrow}</span>
        <h2>
          {slide.title}
          <br />
          <span>{slide.highlight}</span>
        </h2>
        <p>{slide.description}</p>
        <button 
          className="primary-button" 
          onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
        >
          {slide.button}
          <span>→</span>
        </button>
      </div>

      <button
        className="hero-arrow hero-arrow-right"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        ›
      </button>

      <div className="hero-dots">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`hero-dot ${activeSlide === index ? "active" : ""}`}
            onClick={() => setActiveSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
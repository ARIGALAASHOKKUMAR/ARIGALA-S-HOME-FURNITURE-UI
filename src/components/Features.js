import React from 'react';

const Features = () => {
  const features = [
    { icon: "🚚", title: "FREE SHIPPING", desc: "On orders above ₹999" },
    { icon: "◇", title: "SECURE PAYMENT", desc: "100% secure payment" },
    { icon: "↻", title: "EASY RETURNS", desc: "7 days return policy" },
    { icon: "♧", title: "24/7 SUPPORT", desc: "Dedicated support" }
  ];

  return (
    <section className="features-section">
      {features.map((feature, index) => (
        <React.Fragment key={index}>
          <div className="feature-item">
            <div className="feature-icon">{feature.icon}</div>
            <div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          </div>
          {index < features.length - 1 && <div className="feature-divider" />}
        </React.Fragment>
      ))}
    </section>
  );
};

export default Features;
import React from 'react';

const AnnouncementBar = () => {
  return (
    <div className="announcement-bar">
      <div className="announcement-content">
        <span>🚚</span>
        <span>Free Shipping on orders above ₹999</span>
        <span className="announcement-divider">|</span>
        <span>7 Days Easy Returns</span>
      </div>
    </div>
  );
};

export default AnnouncementBar;
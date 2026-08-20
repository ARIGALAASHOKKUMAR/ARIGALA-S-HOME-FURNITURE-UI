import React from 'react';

const Categories = ({ categories, setActiveCategory }) => {
  const getCategorySymbol = (name) => {
    const symbols = {
      Sofas: "▱",
      Beds: "▰",
      Chairs: "♜",
      Tables: "⌗",
      Storage: "▤",
      Decor: "◇"
    };
    return symbols[name] || "✦";
  };

  return (
    <section className="content-section" id="categories">
      <div className="section-heading">
        <div>
          <span className="section-label">EXPLORE OUR COLLECTION</span>
          <h2>Shop By Category</h2>
        </div>
        <button 
          className="view-all-button" 
          onClick={() => { 
            setActiveCategory("All"); 
            document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); 
          }}
        >
          View All <span>→</span>
        </button>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <button
            className="category-card"
            key={category.name}
            onClick={() => {
              setActiveCategory(category.name);
              document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <img src={category.image} alt={category.name} />
            <div className="category-overlay" />
            <div className="category-content">
              <div className="category-symbol">
                {getCategorySymbol(category.name)}
              </div>
              <h3>{category.name}</h3>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Categories;
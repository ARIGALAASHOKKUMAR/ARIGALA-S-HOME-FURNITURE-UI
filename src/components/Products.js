import React from 'react';
import ProductCard from './ProductCard';

const Products = ({ 
  filteredProducts, 
  activeCategory, 
  setActiveCategory, 
  categories,
  wishlist,
  toggleWishlist,
  openProduct,
  addToCart,
  isAdmin,
  submitting,
  setSearch
}) => {
  return (
    <section className="content-section products-section" id="products">
      <div className="section-heading">
        <div>
          <span className="section-label">HANDPICKED FOR YOU</span>
          <h2>Best Sellers</h2>
        </div>

        <div className="product-filter-buttons">
          {["All", ...categories.map((cat) => cat.name)].slice(0, 6).map((category) => (
            <button
              key={category}
              className={activeCategory === category ? "filter-active" : ""}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              openProduct={openProduct}
              addToCart={addToCart}
              isAdmin={isAdmin}
              submitting={submitting}
            />
          ))}
        </div>
      ) : (
        <div className="no-products">
          <div>⌕</div>
          <h3>No products found</h3>
          <p>Try another search or category.</p>
          <button onClick={() => { setSearch(""); setActiveCategory("All"); }}>
            Clear Filters
          </button>
        </div>
      )}
    </section>
  );
};

export default Products;
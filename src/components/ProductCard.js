import React from 'react';
import { formatPrice } from '../utils/formatting';

const ProductCard = ({ 
  product, 
  wishlist, 
  toggleWishlist, 
  openProduct, 
  addToCart, 
  isAdmin, 
  submitting 
}) => {
  return (
    <article className="product-card">
      <div className="product-image-wrapper">
        <img src={product.image} alt={product.name} />
        <span className="product-badge">{product.badge}</span>
        
        <button
          className={`wishlist-button ${wishlist.includes(product.id) ? "wishlisted" : ""}`}
          onClick={() => toggleWishlist(product.id)}
          aria-label="Add to wishlist"
        >
          {wishlist.includes(product.id) ? "♥" : "♡"}
        </button>

        <div className="product-image-actions">
          <button onClick={() => openProduct(product)}>Quick View</button>
        </div>
      </div>

      <div className="product-details">
        <span className="product-category">{product.category}</span>
        <h3>{product.name}</h3>
        
        <div className="product-rating">
          <span>★</span>
          <span>{product.rating}</span>
          <span className="rating-count">(124)</span>
        </div>

        <div className="product-bottom">
          <div className="price-wrapper">
            <strong>{formatPrice(product.price)}</strong>
            {product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}
          </div>

          {!isAdmin && (
            <button
              className="add-cart-button"
              onClick={() => addToCart(product)}
              disabled={submitting || product.stock === 0}
            >
              <span>+</span> Add
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
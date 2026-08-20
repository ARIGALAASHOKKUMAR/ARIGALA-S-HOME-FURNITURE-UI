import React from 'react';

const Navbar = ({ 
  search, 
  setSearch, 
  token, 
  setPanel, 
  isAdmin, 
  wishlist, 
  cartCount, 
  requireLogin 
}) => {
  return (
    <header className="main-header">
      <div className="navbar-container">
        <div className="brand">
          <div className="brand-icon">▰</div>
          <div>
            <h1 className='text-white'>ARIGALA HOME</h1>
            <span>FURNITURE</span>
          </div>
        </div>

        <nav className="desktop-navigation">
          <a href="#home" className="active">Home</a>
          <a href="#shop">Shop</a>
          <a href="#categories">Categories</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="navbar-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span>⌕</span>
          </div>

          <button 
            className="nav-icon-button" 
            aria-label="Account" 
            onClick={() => { setPanel(token ? "account" : "auth"); }}
          >
            ♙
          </button>

          {!isAdmin && (
            <>
              <button 
                className="nav-icon-button" 
                aria-label="Wishlist" 
                onClick={() => requireLogin("wishlist") && setPanel("wishlist")}
              >
                ♡
                {wishlist.length > 0 && <span className="icon-badge">{wishlist.length}</span>}
              </button>

              <button 
                className="nav-icon-button cart-button" 
                aria-label="Cart" 
                onClick={() => requireLogin("cart") && setPanel("cart")}
              >
                🛒
                {cartCount > 0 && <span className="icon-badge">{cartCount}</span>}
              </button>
            </>
          )}

          <button className="mobile-menu-button">☰</button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
import { useState, useEffect } from 'react';

export const useWishlist = (isLoggedIn) => {
  const [wishlist, setWishlist] = useState(() => {
    if (!isLoggedIn) return [];
    try {
      return JSON.parse(localStorage.getItem("woodhaven-wishlist") || "[]");
    } catch (_) {
      return [];
    }
  });

  useEffect(() => {
    if (!isLoggedIn) {
      setWishlist([]);
      localStorage.removeItem("woodhaven-wishlist");
      return;
    }
    localStorage.setItem("woodhaven-wishlist", JSON.stringify(wishlist));
  }, [wishlist, isLoggedIn]);

  const toggleWishlist = (id) => {
    setWishlist((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  return { wishlist, toggleWishlist };
};
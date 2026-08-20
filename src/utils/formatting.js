export const formatPrice = (price) => {
  return `₹${Number(price || 0).toLocaleString("en-IN")}`;
};

export const normalizeProduct = (product) => ({
  ...product,
  category: product.category_name || product.category || "Furniture",
  price: Number(product.price),
  oldPrice: product.old_price ? Number(product.old_price) : null,
  rating: product.rating || "New",
  image: product.image_url || product.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85",
  badge: product.badge || (product.stock > 0 ? "In Stock" : "Sold Out"),
});
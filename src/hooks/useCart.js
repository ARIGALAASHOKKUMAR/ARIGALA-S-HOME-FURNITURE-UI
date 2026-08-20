import { useEffect, useReducer, useCallback } from 'react';
import { apiRequest } from '../api';

const initialState = { items: [] };

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload };
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
};

const aggregateItems = (rawItems = []) => {
  const map = new Map();
  for (const it of rawItems) {
    const id = it.product_id || it.productId || (it.product && it.product.id);
    if (!id) continue;
    const existing = map.get(id) || {
      product_id: id,
      name: it.name || it.product_name || (it.product && it.product.name) || "",
      price: Number(it.price || (it.product && it.product.price) || 0),
      quantity: 0,
      line_total: 0,
      image_url: it.image_url || (it.product && it.product.image_url) || it.image || null,
    };
    const qty = Number(it.quantity || 1);
    const price = Number(it.price || existing.price || 0);
    existing.quantity = Number(existing.quantity || 0) + qty;
    existing.line_total = Number(existing.line_total || 0) + price * qty;
    if (!existing.image_url && (it.image || (it.product && it.product.image))) {
      existing.image_url = it.image || (it.product && it.product.image);
    }
    map.set(id, existing);
  }
  return Array.from(map.values());
};

export const useCart = (token, loadCustomerData) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchAndSetCart = useCallback(async () => {
    if (!token) return dispatch({ type: 'CLEAR' });
    try {
      const data = await apiRequest('/cart', { token });
      const raw = data.items || [];
      let items = aggregateItems(raw);

      // Enrich missing images by fetching product details
      const missingImageIds = items.filter(i => !i.image_url).map(i => i.product_id);
      if (missingImageIds.length) {
        const promises = missingImageIds.map((id) => apiRequest(`/products/${id}`)
          .then((p) => ({ id, image: p.image_url || p.image }))
          .catch(() => ({ id, image: null }))
        );
        const results = await Promise.all(promises);
        const imgMap = new Map(results.map(r => [r.id, r.image]));
        items = items.map((it) => ({ ...it, image_url: it.image_url || imgMap.get(it.product_id) || it.image_url }));
      }

      dispatch({ type: 'SET_ITEMS', payload: items });
    } catch (e) {
      dispatch({ type: 'CLEAR' });
    }
  }, [token]);

  useEffect(() => { fetchAndSetCart(); }, [fetchAndSetCart]);

  const addToCart = async (product, requireLogin, setError, setSubmitting, setNotice) => {
    if (!requireLogin()) return;
    setSubmitting(true);
    setError("");
    try {
      await apiRequest('/cart/items', {
        method: 'POST', token,
        body: JSON.stringify({ productId: Number(product.id), quantity: 1 })
      });
      await (loadCustomerData ? loadCustomerData() : fetchAndSetCart());
      setNotice && setNotice(`${product.name} was added to your cart.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateCartQuantity = async (productId, quantity, setError) => {
    try {
      if (quantity < 1) {
        await apiRequest(`/cart/items/${productId}`, { method: 'DELETE', token });
      } else {
        await apiRequest(`/cart/items/${productId}`, { method: 'PATCH', token, body: JSON.stringify({ quantity }) });
      }
      await (loadCustomerData ? loadCustomerData() : fetchAndSetCart());
    } catch (requestError) {
      setError && setError(requestError.message);
    }
  };

  const cart = state.items;
  const cartCount = cart.reduce((total, item) => total + Number(item.quantity || 0), 0);

  return { cart, addToCart, updateCartQuantity, cartCount, reloadCart: fetchAndSetCart };
};
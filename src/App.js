import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormikProvider } from 'formik';
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css'; // Add this line


// Components
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Categories from './components/Categories';
import Products from './components/Products';
import Promotion from './components/Promotion';
import About from './components/About';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
// import StoreModal from './components/modals/StoreModal';
// import AuthModal from './components/modals/AuthModal';
// import AddressFormModal from './components/modals/AddressFormModal';
// import AdminProductForm from './components/modals/AdminProductForm';

// Hooks
import { useStoreData } from './hooks/useStoreData';
import { useWishlist } from './hooks/useWishlist';
import { useAuth } from './hooks/useAuth';

// Utils
import { formatPrice, normalizeProduct } from './utils/formatting';
import { apiRequest } from './api';
// import { heroSlides } from './constants/data';
import StoreModal from './modals/StoreModal';
import AuthModal from './modals/AuthModal';
import AddressFormModal from './modals/AddressFormModal';
import AdminProductForm from './modals/AdminProductForm';
import { heroSlides } from './constants/data';

function App() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [panel, setPanel] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
  const [expandedOrders, setExpandedOrders] = useState([]);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.CartReducer.items || []);
  const [checkoutAddressId, setCheckoutAddressId] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethodChoice, setPaymentMethodChoice] = useState('cod');
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({ 
    fullName: "", phone: "", line1: "", line2: "", city: "", 
    state: "", postalCode: "", country: "India", isDefault: true 
  });
  const [adminProducts, setAdminProducts] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminSection, setAdminSection] = useState("overview");
  const [adminDashboard, setAdminDashboard] = useState({ 
    overview: {}, dailySales: [], productSales: [], inventory: [] 
  });
  const [adminProductForm, setAdminProductForm] = useState({ 
    id: null, name: "", slug: "", description: "", 
    price: "", stock: "", categoryId: "", imageUrl: "", isActive: true 
  });
  
  const { catalogProducts, setCatalogProducts, catalogCategories, error: storeError, setError: setStoreError } = useStoreData();
  const { 
    token, setToken, user, setUser, authMode, setAuthMode, 
    submitting, setSubmitting, error, setError, notice, setNotice,
    handleAuth, logout, isAdmin 
  } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist(Boolean(token));

  // Hero slides auto-rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Load customer data when token changes
  useEffect(() => {
    if (token) loadCustomerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadCustomerData = async () => {
    try {
      const [cartResp, addressData, orderData, profileData] = await Promise.all([
        import('./services/commonAPICall').then(m => m.commonAPICall('/cart')),
        apiRequest('/addresses', { token }),
        apiRequest('/orders', { token }),
        apiRequest('/profile', { token }),
      ]);
      const cartItems = cartResp?.data?.data?.items || cartResp?.data?.items || [];
      dispatch({ type: 'SET_CART', payload: cartItems });
      setAddresses(addressData || []);
      setOrders(orderData || []);
      if (profileData.user) setUser(profileData.user);
    } catch (requestError) {
      if (/token|unauthorized|invalid/i.test(requestError.message)) logout();
    }
  };

  const aggregateOrderItems = (rawItems = []) => {
    const map = new Map();
    for (const it of rawItems) {
      const id = it.product_id || it.productId || (it.product && it.product.id) || it.product_id;
      if (!id) continue;
      const existing = map.get(id) || {
        product_id: id,
        name: it.product_name || it.name || (it.product && it.product.name) || '',
        unit_price: Number(it.unit_price || it.price || (it.product && it.product.price) || 0),
        quantity: 0,
        line_total: 0,
        image_url: it.image_url || (it.product && it.product.image_url) || it.image || null,
      };
      const qty = Number(it.quantity || 1);
      const price = Number(existing.unit_price || 0);
      existing.quantity = Number(existing.quantity || 0) + qty;
      existing.line_total = Number(existing.line_total || 0) + price * qty;
      map.set(id, existing);
    }
    return Array.from(map.values());
  };

  const loadOrderDetails = async (orderId) => {
    if (orderDetails[orderId]) return;
    try {
      const data = await apiRequest(`/orders/${orderId}`, { token });
      const raw = data.items || [];
      let items = aggregateOrderItems(raw);

      const missingImageIds = items.filter(i => !i.image_url).map(i => i.product_id);
      if (missingImageIds.length) {
        const promises = missingImageIds.map(id => apiRequest(`/products/${id}`).then(p => ({ id, image: p.image_url || p.image })).catch(() => ({ id, image: null })));
        const results = await Promise.all(promises);
        const imgMap = new Map(results.map(r => [r.id, r.image]));
        items = items.map(it => ({ ...it, image_url: it.image_url || imgMap.get(it.product_id) || it.image_url }));
      }

      setOrderDetails(prev => ({ ...prev, [orderId]: items }));
    } catch (e) {
      setOrderDetails(prev => ({ ...prev, [orderId]: [] }));
    }
  };

  const toggleOrderExpand = async (orderId) => {
    if (!expandedOrders.includes(orderId)) {
      await loadOrderDetails(orderId);
      setExpandedOrders(prev => [...prev, orderId]);
    } else {
      setExpandedOrders(prev => prev.filter(id => id !== orderId));
    }
  };

  const requireLogin = (nextPanel = "auth") => {
    if (token) return true;
    setAuthMode("login");
    setPanel(nextPanel);
    setError("Please sign in to continue.");
    return false;
  };

  const handleAuthAndClose = async (values) => {
    await handleAuth(values);
    setPanel(null);
  };

  const logoutAndClose = () => {
    logout();
    setPanel(null);
    dispatch({type:"CLEAR_CART"})
  };

  const toggleWishlistForUser = (productId) => {
    if (!requireLogin("wishlist")) return;
    toggleWishlist(productId);
  };

  const addToCart = async (product) => {
    if (isAdmin) {
      setError("Admin accounts manage the store and cannot place customer orders.");
      return;
    }
    if (!requireLogin()) return;
    setSubmitting(true);
    setError("");
    try {
      const { commonAPICall } = await import('./services/commonAPICall');
      const resp = await commonAPICall('/cart/items', { productId: Number(product.id), quantity: 1 }, 'POST');
      if (resp.status === 401) {
        logout();
        setError('Session expired. Please login again.');
        return;
      }
      // refresh only cart to avoid failing whole customer data load
      const cartResp = await commonAPICall('/cart');
      const cartItems = cartResp?.data?.data?.items || cartResp?.data?.items || [];
      dispatch({ type: 'SET_CART', payload: cartItems });
      setNotice(`${product.name} was added to your cart.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateCartQuantity = async (productId, quantity) => {
    try {
      const { commonAPICall } = await import('./services/commonAPICall');
      let resp;
      if (quantity < 1) {
        resp = await commonAPICall(`/cart/items/${productId}`, null, 'DELETE');
      } else {
        resp = await commonAPICall(`/cart/items/${productId}`, { quantity }, 'PATCH');
      }
      if (resp.status === 401) {
        logout();
        setError('Session expired. Please login again.');
        return;
      }
      const cartResp = await commonAPICall('/cart');
      const cartItems = cartResp?.data?.data?.items || cartResp?.data?.items || [];
      dispatch({ type: 'SET_CART', payload: cartItems });
    } catch (requestError) { 
      setError(requestError.message); 
    }
  };

  const openProduct = async (product) => {
    setSelectedProduct(product);
    setPanel("product");
    try {
      setSelectedProduct(normalizeProduct(await apiRequest(`/products/${product.id}`)));
    } catch (_) {}
  };

  const createAddress = async (values) => {
    setSubmitting(true);
    try {
      const wasEditing = Boolean(editingAddressId);
      const savedAddress = await apiRequest(wasEditing ? `/addresses/${editingAddressId}` : "/addresses", { 
        method: wasEditing ? "PATCH" : "POST", 
        token, 
        body: JSON.stringify(values) 
      });
      if (!wasEditing && savedAddress?.id) setCheckoutAddressId(String(savedAddress.id));
      setAddressForm({ fullName: "", phone: "", line1: "", line2: "", city: "", state: "", postalCode: "", country: "India", isDefault: true });
      setEditingAddressId(null);
      setShowAddressForm(false);
      await loadCustomerData();
      setNotice(wasEditing ? "Shipping address updated." : "Shipping address saved.");
    } catch (requestError) { 
      setError(requestError.message); 
    } finally { 
      setSubmitting(false); 
    }
  };

  const editAddress = (address) => {
    setEditingAddressId(address.id);
    setAddressForm({ 
      fullName: address.full_name, 
      phone: address.phone, 
      line1: address.line1, 
      line2: address.line2 || "", 
      city: address.city, 
      state: address.state || "", 
      postalCode: address.postal_code, 
      country: address.country, 
      isDefault: address.is_default 
    });
    setShowAddressForm(true);
  };

  const openCheckout = () => {
    setCheckoutAddressId(String(addresses.find((address) => address.is_default)?.id || addresses[0]?.id || ""));
    setEditingAddressId(null);
    setShowAddressForm(false);
    setPanel("checkout");
  };

  const handleImageUpload = (event) => {
    const image = event.target.files?.[0];
    if (!image) return;
    if (!image.type.startsWith("image/")) { 
      setError("Please choose an image file."); 
      return; 
    }
    if (image.size > 3 * 1024 * 1024) { 
      setError("Please choose an image smaller than 3 MB."); 
      return; 
    }
    const reader = new FileReader();
    reader.onload = () => setAdminProductForm((form) => ({ ...form, imageUrl: reader.result }));
    reader.readAsDataURL(image);
  };

  
  const checkout = async (addressId) => {
  if (!addressId) { 
    setError("Add a shipping address before checking out."); 
    return; 
  }
  setSubmitting(true);
  try {
    if (paymentMethodChoice === 'cod') {
      const order = await apiRequest("/orders/checkout", { 
        method: "POST", 
        token, 
        body: JSON.stringify({ addressId: Number(addressId), paymentMethod: "cod" }) 
      });
      await loadCustomerData();
      setPanel("orders");
      setNotice(`Order #${order.id} has been placed successfully.`);
    } else if (paymentMethodChoice === 'razorpay') {
      // Razorpay flow: create order on server, open checkout, verify payment
      const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY;
      if (!razorpayKey) throw new Error('REACT_APP_RAZORPAY_KEY is not configured');
      const createResp = await apiRequest('/payments/create-razorpay-order', { method: 'POST', token, body: JSON.stringify({ addressId: Number(addressId) }) });
      if (!createResp || !createResp.id) throw new Error('Failed to create Razorpay order');
      const razorOrder = createResp; // contains id, amount, currency
      // load Razorpay script
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://checkout.razorpay.com/v1/checkout.js';
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });
      }
      const options = {
        key: razorpayKey,
        amount: razorOrder.amount, // in paise
        currency: razorOrder.currency || 'INR',
        name: 'Store',
        description: 'Order Payment',
        order_id: razorOrder.id,
        handler: async function (response) {
          try {
            const verify = await apiRequest('/payments/verify-razorpay', { method: 'POST', token, body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              addressId: Number(addressId)
            }) });
            await loadCustomerData();
            setPanel('orders');
            setNotice('Payment successful and order placed.');
          } catch (e) {
            setError(e.message);
          }
        },
        prefill: { name: user?.name || '', email: user?.email || '' },
        theme: { color: '#F37254' }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      throw new Error('Unsupported payment method');
    }
  } catch (requestError) { 
    setError(requestError.message); 
  } finally { 
    setSubmitting(false); 
  }
};

  const loadAdminData = async () => {
    try {
      const [productData, orderData, dashboardData] = await Promise.all([
        apiRequest("/admin/products", { token }),
        apiRequest("/admin/orders", { token }),
        apiRequest("/admin/dashboard", { token }),
      ]);
      setAdminProducts(productData.map(normalizeProduct));
      setAdminOrders(orderData);
      setAdminDashboard(dashboardData);
    } catch (requestError) { 
      setError(requestError.message); 
    }
  };

  const openAdmin = async () => {
    if (!isAdmin) {
      setError("Admin access is required.");
      return;
    }
    setAdminSection("overview");
    setPanel("admin");
    await loadAdminData();
  };

  const saveAdminProduct = async (values) => {
    setSubmitting(true);
    try {
      const { id, ...form } = values;
      const payload = { 
        ...form, 
        price: Number(form.price), 
        stock: Number(form.stock), 
        categoryId: form.categoryId ? Number(form.categoryId) : null 
      };
      await apiRequest(id ? `/products/${id}` : "/products", { 
        method: id ? "PATCH" : "POST", 
        token, 
        body: JSON.stringify(payload) 
      });
      setAdminProductForm({ 
        id: null, name: "", slug: "", description: "", 
        price: "", stock: "", categoryId: "", imageUrl: "", isActive: true 
      });
      await Promise.all([
        loadAdminData(), 
        apiRequest("/products?limit=100").then((data) => setCatalogProducts((data.items || []).map(normalizeProduct)))
      ]);
      setNotice(id ? "Product updated." : "Product created.");
    } catch (requestError) { 
      setError(requestError.message); 
    } finally { 
      setSubmitting(false); 
    }
  };

  const updateAdminOrder = async (id, status) => {
    try {
      await apiRequest(`/admin/orders/${id}/status`, { 
        method: "PATCH", 
        token, 
        body: JSON.stringify({ status }) 
      });
      await loadAdminData();
      setNotice("Order status updated.");
    } catch (requestError) { 
      setError(requestError.message); 
    }
  };

  const filteredProducts = catalogProducts.filter((product) => {
    const categoryMatch = activeCategory === "All" ||
      product.category.toLowerCase().replace(/s$/, "") === activeCategory.toLowerCase().replace(/s$/, "");
    const searchMatch = product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const cartCount = cart.reduce((total, item) => total + Number(item.quantity), 0);

  return (
    <div className="home-page">
      <AnnouncementBar />
      
      <Navbar 
        search={search}
        setSearch={setSearch}
        token={token}
        setPanel={setPanel}
        isAdmin={isAdmin}
        wishlist={wishlist}
        cartCount={cartCount}
        requireLogin={requireLogin}
      />

      <Hero 
        activeSlide={activeSlide}
        setActiveSlide={setActiveSlide}
        previousSlide={() => setActiveSlide(prev => prev === 0 ? heroSlides.length - 1 : prev - 1)}
        nextSlide={() => setActiveSlide(prev => prev === heroSlides.length - 1 ? 0 : prev + 1)}
      />

      <Features />
      
      <Categories 
        categories={catalogCategories}
        setActiveCategory={setActiveCategory}
      />

      <Products 
        filteredProducts={filteredProducts}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categories={catalogCategories}
        wishlist={wishlist}
        toggleWishlist={toggleWishlistForUser}
        openProduct={openProduct}
        addToCart={addToCart}
        isAdmin={isAdmin}
        submitting={submitting}
        setSearch={setSearch}
      />

      <Promotion />
      <About />
      <Newsletter setNotice={setNotice} />
      
      <Footer 
        token={token}
        setPanel={setPanel}
        requireLogin={requireLogin}
      />

      {/* Notice/Error Messages */}
      {(notice || error) && (
        <div className={`store-notice ${error ? "store-notice-error" : ""}`} role="status">
          <span>{error || notice}</span>
          <button onClick={() => { setNotice(""); setError(""); }}>×</button>
        </div>
      )}

      {/* Modal */}
      <StoreModal panel={panel} setPanel={setPanel}>
        {panel === "auth" && (
          <AuthModal 
            authMode={authMode}
            setAuthMode={setAuthMode}
            handleAuth={handleAuthAndClose}
            submitting={submitting}
          />
        )}

        {panel === "cart" && (
          <>
            <span className="section-label">YOUR BAG</span>
            <h2>Shopping cart</h2>
            {cart.length ? (
              <div className="store-list">
                {cart.map((item) => (
                  <div className="cart-row" key={item.product_id}>
                    <img src={item.image_url || normalizeProduct(item).image} alt="" />
                    <div>
                      <strong>{item.name}</strong>
                      <small>{formatPrice(item.price)} each</small>
                      <div className="quantity-controls">
                        <button onClick={() => updateCartQuantity(item.product_id, Number(item.quantity) - 1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.product_id, Number(item.quantity) + 1)}>+</button>
                      </div>
                    </div>
                    <strong>{formatPrice(item.line_total)}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className="store-empty">Your cart is ready for something beautiful.</p>
            )}
            {cart.length > 0 && (
              <>
                <div className="store-total">
                  <span>Subtotal</span>
                  <strong>{formatPrice(cart.reduce((total, item) => total + Number(item.line_total), 0))}</strong>
                </div>
                <button className="primary-button" onClick={openCheckout}>Checkout →</button>
              </>
            )}
          </>
        )}

        {panel === "checkout" && (
          <>
            <span className="section-label">CHECKOUT</span>
            <h2>Select a shipping address</h2>
            {addresses.length ? (
              <div className="store-list checkout-addresses">
                {addresses.map((address) => (
                  <label className="checkout-address" key={address.id}>
                    <input 
                      type="radio" 
                      name="shipping-address" 
                      checked={String(address.id) === checkoutAddressId} 
                      onChange={() => setCheckoutAddressId(String(address.id))} 
                    />
                    <span>
                      <strong>{address.full_name}</strong>
                      <small>
                        {address.line1}{address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state} {address.postal_code}
                        <br />
                        {address.phone}
                      </small>
                    </span>
                    <button type="button" onClick={() => editAddress(address)} className="outline-button"   style={{display:"flex",justifyContent:"center",alignItems:"center"}}>Edit</button>
                  </label>
                ))}
              </div>
            ) : (
              <p className="store-empty">Add your first shipping address to continue.</p>
            )}
            
            <button 
              className="outline-button" 
              onClick={() => { 
                setEditingAddressId(null); 
                setAddressForm({ fullName: "", phone: "", line1: "", line2: "", city: "", state: "", postalCode: "", country: "India", isDefault: true }); 
                setShowAddressForm(true); 
              }}
              style={{display:"flex",justifyContent:"center",alignItems:"center"}}
            >
              Add a new address
            </button>

            {showAddressForm && (
              <AddressFormModal 
                addressForm={addressForm}
                createAddress={createAddress}
                submitting={submitting}
                editingAddressId={editingAddressId}
                setShowAddressForm={setShowAddressForm}
              />
            )}

            {cart.length > 0 && (
              <>
                <div className="store-total">
                  <span>Order total</span>
                  <strong>{formatPrice(cart.reduce((total, item) => total + Number(item.line_total), 0))}</strong>
                </div>
                <div style={{marginTop:12}}>
                  <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:8}}>
                    <label style={{display:'flex',alignItems:'center',gap:8}}>
                      <input type="radio" name="payment" value="cod" checked={paymentMethodChoice==='cod'} onChange={() => setPaymentMethodChoice('cod')} />
                      <span>Cash on delivery</span>
                    </label>
                    <label style={{display:'flex',alignItems:'center',gap:8}}>
                      <input type="radio" name="payment" value="razorpay" checked={paymentMethodChoice==='razorpay'} onChange={() => setPaymentMethodChoice('razorpay')} />
                      <span>Card / UPI (Razorpay)</span>
                    </label>
                  </div>

                  <button 
                    className="primary-button" 
                    onClick={() => checkout(checkoutAddressId)} 
                    disabled={submitting || !checkoutAddressId}
                  >
                    {paymentMethodChoice === 'cod' ? 'Place order (Cash on delivery)' : 'Pay with Razorpay'}
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {panel === "account" && (
          <>
            <span className="section-label">ACCOUNT</span>
            <h2>{user?.name || "My account"}</h2>
            <div className="account-actions">
              <button onClick={() => setPanel("orders")}>View my orders</button>
              {isAdmin && <button onClick={openAdmin}>Admin dashboard</button>}
              <button onClick={logoutAndClose}>Sign out</button>
            </div>
            
            <h3 className="store-subheading">Shipping addresses</h3>
            {addresses.map((address) => (
              <div className="address-row" key={address.id}>
                <div>
                  <strong>{address.full_name}</strong>
                  <small>{address.line1}, {address.city}, {address.postal_code}</small>
                </div>
                <button onClick={() => editAddress(address)}>Edit</button>
                <button onClick={async () => { 
                  try { 
                    await apiRequest(`/addresses/${address.id}`, { method: "DELETE", token }); 
                    await loadCustomerData(); 
                  } catch (requestError) { 
                    setError(requestError.message); 
                  } 
                }}>
                  Remove
                </button>
              </div>
            ))}
            
            <button 
              className="outline-button" 
              onClick={() => { 
                setEditingAddressId(null); 
                setAddressForm({ fullName: "", phone: "", line1: "", line2: "", city: "", state: "", postalCode: "", country: "India", isDefault: true }); 
                setShowAddressForm(true); 
              }}
              style={{display:"flex",justifyContent:"center",alignItems:"center"}}
            >
              Add a new address
            </button>

            {showAddressForm && (
              <AddressFormModal 
                addressForm={addressForm}
                createAddress={createAddress}
                submitting={submitting}
                editingAddressId={editingAddressId}
                setShowAddressForm={setShowAddressForm}
              />
            )}

            {cart.length > 0 && (
              <button className="primary-button" onClick={openCheckout} disabled={submitting}>
                Continue to checkout
              </button>
            )}
          </>
        )}

        {panel === "orders" && (
          <>
            <span className="section-label">PURCHASE HISTORY</span>
            <h2>Your orders</h2>
            {orders.length ? (
              <div className="store-list">
                {orders.map((order) => (
                  <div key={order.id}>
                    <div className="order-row" style={{cursor: 'pointer'}} onClick={() => toggleOrderExpand(order.id)}>
                      <div>
                        <strong>Order #{order.id}</strong>
                        <small>{new Date(order.created_at).toLocaleDateString("en-IN")} · {order.item_count || 0} item{Number(order.item_count) === 1 ? "" : "s"} ({order.product_count || 0} product{Number(order.product_count) === 1 ? "" : "s"})</small>
                      </div>
                      <span className="order-status">{order.status}</span>
                      <strong>{formatPrice(order.total_amount)}</strong>
                    </div>

                    {expandedOrders.includes(order.id) && (
                      <div className="order-items" style={{padding: '8px 12px 16px'}}>
                        {orderDetails[order.id] && orderDetails[order.id].length ? (
                          orderDetails[order.id].map((item) => (
                            <div className="cart-row" key={item.product_id} style={{alignItems: 'center'}}>
                              <img src={item.image_url || (item.image) || ''} alt="" style={{width:64,height:64,objectFit:'cover',marginRight:12}} />
                              <div style={{flex:1}}>
                                <strong>{item.name}</strong>
                                <small>{formatPrice(item.unit_price)} each · Quantity: {item.quantity} · Total: {formatPrice(item.line_total)}</small>
                              </div>
                              <strong>{formatPrice(item.line_total)}</strong>
                            </div>
                          ))
                        ) : (
                          <p className="store-empty">No items found for this order.</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="store-empty">No orders yet.</p>
            )}
          </>
        )}

        {panel === "admin" && isAdmin && (
          <>
            <span className="section-label">ADMINISTRATION</span>
            <h2>Store operations</h2>

            <nav className="admin-section-nav" aria-label="Admin sections">
              {["overview", "products", "orders"].map((section) => (
                <button
                  key={section}
                  className={adminSection === section ? "active" : ""}
                  onClick={() => setAdminSection(section)}
                >
                  {section === "overview" ? "Revenue & sales" : section === "products" ? "Add products" : "Customer orders"}
                </button>
              ))}
            </nav>
            
            <div className="admin-metrics">
              <div>
                <small>30-day revenue</small>
                <strong>{formatPrice(adminDashboard.overview.revenue)}</strong>
              </div>
              <div>
                <small>Orders</small>
                <strong>{adminDashboard.overview.order_count || 0}</strong>
              </div>
              <div>
                <small>Pending orders</small>
                <strong>{adminDashboard.overview.pending_orders || 0}</strong>
              </div>
              <div>
                <small>Low-stock items</small>
                <strong>{adminDashboard.inventory.filter((product) => Number(product.stock) <= 5).length}</strong>
              </div>
            </div>

            {adminSection === "overview" && (
              <>
            <h3 className="store-subheading">Daily sales (last 30 days)</h3>
            <div className="store-list admin-list">
              {adminDashboard.dailySales.length ? 
                adminDashboard.dailySales.map((sale) => (
                  <div className="admin-row" key={sale.date}>
                    <div>
                      <strong>{new Date(`${sale.date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</strong>
                      <small>{sale.orders} orders</small>
                    </div>
                    <strong>{formatPrice(sale.revenue)}</strong>
                  </div>
                )) : 
                <p className="store-empty">No sales recorded yet.</p>
              }
            </div>

            <h3 className="store-subheading">Product-wise sales</h3>
            <div className="store-list admin-list">
              {adminDashboard.productSales.map((product) => (
                <div className="admin-row" key={product.id}>
                  <div>
                    <strong>{product.name}</strong>
                    <small>{product.units_sold} sold · Stock: {product.stock}</small>
                  </div>
                  <strong>{formatPrice(product.revenue)}</strong>
                </div>
              ))}
            </div>
              </>
            )}

            {adminSection === "products" && (
              <>
            <h3 className="store-subheading">Add or edit product</h3>
            <AdminProductForm 
              adminProductForm={adminProductForm}
              saveAdminProduct={saveAdminProduct}
              submitting={submitting}
              catalogCategories={catalogCategories}
              setAdminProductForm={setAdminProductForm}
              handleImageUpload={handleImageUpload}
            />

            <h3 className="store-subheading">Inventory management</h3>
            <div className="store-list admin-list">
              {adminProducts.map((product) => (
                <div className="admin-row" key={product.id}>
                  <div>
                    <strong>{product.name}</strong>
                    <small>
                      {product.category} · {formatPrice(product.price)} · Stock: {product.stock} · 
                      {product.is_active ? "Active" : "Archived"}
                    </small>
                  </div>
                  <button onClick={() => setAdminProductForm({ 
                    id: product.id, 
                    name: product.name, 
                    slug: product.slug, 
                    description: product.description || "", 
                    price: product.price, 
                    stock: product.stock, 
                    categoryId: String(product.category_id || ""), 
                    imageUrl: product.image_url || "", 
                    isActive: product.is_active 
                  })}>
                    Edit
                  </button>
                  <button onClick={async () => { 
                    if (!window.confirm(`Archive ${product.name}?`)) return; 
                    try { 
                      await apiRequest(`/products/${product.id}`, { method: "DELETE", token }); 
                      await loadAdminData(); 
                      setNotice("Product archived."); 
                    } catch (requestError) { 
                      setError(requestError.message); 
                    } 
                  }}>
                    Archive
                  </button>
                </div>
              ))}
            </div>
              </>
            )}

            {adminSection === "orders" && (
              <>
            <h3 className="store-subheading">Customer orders</h3>
            <div className="store-list admin-list">
              {adminOrders.map((order) => (
                <div className="admin-row" key={order.id}>
                  <div>
                    <strong>Order #{order.id} · {order.name}</strong>
                    <small>{order.email} · {formatPrice(order.total_amount)}</small>
                  </div>
                  <select value={order.status} onChange={(e) => updateAdminOrder(order.id, e.target.value)}>
                    {["pending", "paid", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
              </>
            )}
          </>
        )}

        {panel === "wishlist" && (
          <>
            <span className="section-label">SAVED FOR LATER</span>
            <h2>Your wishlist</h2>
            {catalogProducts.filter((product) => wishlist.includes(product.id)).length ? (
              <div className="store-list">
                {catalogProducts.filter((product) => wishlist.includes(product.id)).map((product) => (
                  <div className="cart-row" key={product.id}>
                    <img src={product.image} alt="" />
                    <div>
                      <strong>{product.name}</strong>
                      <small>{formatPrice(product.price)}</small>
                    </div>
                    <button className="btn btn-warning" onClick={() => addToCart(product)}>
                      Add to cart
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="store-empty">Save products by tapping the heart icon.</p>
            )}
          </>
        )}

        {panel === "product" && selectedProduct && (
          <>
            <img className="quick-view-image" src={selectedProduct.image} alt={selectedProduct.name} />
            <span className="section-label">{selectedProduct.category}</span>
            <h2>{selectedProduct.name}</h2>
            <p className="quick-view-copy">
              {selectedProduct.description || "A carefully selected piece made for a comfortable, beautiful home."}
            </p>
            <strong className="quick-view-price">{formatPrice(selectedProduct.price)}</strong>
            {!isAdmin && (
              <button 
                className="primary-button" 
                onClick={() => addToCart(selectedProduct)} 
                disabled={submitting || selectedProduct.stock === 0}
              >
                {selectedProduct.stock === 0 ? "Out of stock" : "Add to cart"}
              </button>
            )}
          </>
        )}
      </StoreModal>
    </div>
  );
}

export default App;
import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Medicines from './pages/Medicines';
import Doctors from './pages/Doctors';
import LabTests from './pages/LabTests';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import MedicineDetails from './pages/MedicineDetails';
import MobileNavbar from './components/MobileNavbar';
import WhatsAppButton from './components/WhatsAppButton';
import CustomerNotification from './components/CustomerNotification';
import TokenStatus from './pages/TokenStatus';
import CartDrawer from './components/medicines/CartDrawer';
import FloatingCartBar from './components/FloatingCartBar';
import { useApp } from './context/AppContext';

import SurgicalProducts from './pages/SurgicalProducts';
import Physiotherapy from './pages/Physiotherapy';

import UserLogin from './pages/UserLogin';

function App() {
  const {
    cart, totalItems, cartTotal, addToCart, removeFromCart, deleteFromCart, clearCart, addOrder,
    isCartOpen, setIsCartOpen, user
  } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname === '/signin' || location.pathname === '/login';
  const isAdminPage = location.pathname.startsWith('/admin');
  const shouldHideCart = isAuthPage || isAdminPage;

  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const [orderComplete, setOrderComplete] = React.useState(false);
  const [showOrderAnim, setShowOrderAnim] = React.useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = React.useState(false);
  const [customerDetails, setCustomerDetails] = React.useState({
    name: '', phone: '', whatsapp: '', address: '', pincode: '', email: '', payment_method: 'COD'
  });
  const [finalOrderSummary, setFinalOrderSummary] = React.useState(null);

  React.useEffect(() => {
    if (isCartOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [isCartOpen]);

  // Load user-specific delivery details when user changes
  React.useEffect(() => {
    if (user) {
       const userKey = `guardian_delivery_details_${user.phone || user.email}`;
       const saved = localStorage.getItem(userKey);
       if (saved) {
         const parsed = JSON.parse(saved);
         // Migration: handles old key name
         if (parsed.paymentMethod) { parsed.payment_method = parsed.paymentMethod; delete parsed.paymentMethod; }
         setCustomerDetails(parsed);
       } else {
         // Fallback to basic user info if no saved delivery details yet
         setCustomerDetails({
           name: user.name || '',
           phone: user.phone && user.phone !== 'N/A' ? user.phone : '',
           email: user.email || '',
           whatsapp: user.phone && user.phone !== 'N/A' ? user.phone : '',
           address: '',
           pincode: '',
           payment_method: 'COD'
         });
       }
    } else {
       // Check for global guest details
       const savedGuest = localStorage.getItem('guardian_delivery_details_guest');
       if (savedGuest) {
         const parsed = JSON.parse(savedGuest);
         if (parsed.paymentMethod) { parsed.payment_method = parsed.paymentMethod; delete parsed.paymentMethod; }
         setCustomerDetails(parsed);
       } else {
         setCustomerDetails({ name: '', phone: '', whatsapp: '', address: '', pincode: '', email: '', payment_method: 'COD' });
       }
    }
  }, [user]);

  // LIVE STORAGE: Save details whenever they change
  React.useEffect(() => {
    const userKeySuffix = user ? (user.phone || user.email) : 'guest';
    const userKey = `guardian_delivery_details_${userKeySuffix}`;
    
    // Only save if some details are entered to avoid overwriting with blanks initially
    if (customerDetails.name || customerDetails.address || customerDetails.phone) {
      localStorage.setItem(userKey, JSON.stringify(customerDetails));
    }
  }, [customerDetails, user]);

  const handleProceedToCheckout = () => {
    if (!user) {
      setIsCartOpen(false);
      navigate('/signin', { state: { from: '/medicines' } });
      return;
    }
    setShowCheckoutForm(true);
  };
  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsCheckingOut(true);
    const orderDetails = {
      customer_name: customerDetails.name,
      phone: customerDetails.phone,
      whatsapp: customerDetails.whatsapp,
      address: customerDetails.address,
      pincode: customerDetails.pincode,
      email: customerDetails.email || null,
      items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity, selectedSize: item.selectedSize, image: item.images?.[0] || item.image_base64 })),
      total_amount: cartTotal + (cartTotal >= 500 ? 0 : 40),
      payment_method: String(customerDetails.payment_method || 'COD')
    };
    console.log('Placing order with details:', orderDetails);
    const success = await addOrder(orderDetails);
    setIsCheckingOut(false);
    if (success) {
      // Store delivery details SPECIFICALLY for this user
      const userKeySuffix = user ? (user.phone || user.email) : 'guest';
      
      if (user) {
        const userKey = `guardian_delivery_details_${userKeySuffix}`;
        localStorage.setItem(userKey, JSON.stringify(customerDetails));
      }
      
      // Also track order completion per-user
      const historyKey = `my_guardian_orders_${userKeySuffix}`;
      const myOrders = JSON.parse(localStorage.getItem(historyKey) || '[]');
      // Using an ID or generating one if data[0] is not available here
      // AppContext's addOrder returns success and handles internal storage, 
      // but we can track the IDs here too for UI convenience.
      
      
      setFinalOrderSummary({
        total: cartTotal,
        paymentMethod: customerDetails.payment_method || 'COD',
        name: customerDetails.name
      });

      clearCart();
      setShowCheckoutForm(false);
      setIsCartOpen(false);
      // Play success sound
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.log("Audio play deferred:", e));

      // Step 1: show the delivery box animation
      setShowOrderAnim(true);
      // Step 2: after 2.6s transition to the confirmation panel
      setTimeout(() => {
        setShowOrderAnim(false);
        setOrderComplete(true);
      }, 2600);
      setTimeout(() => setOrderComplete(false), 13000);
    }
  };

  return (
    <>
      <ScrollToTop />
      <div className="page-layout">

        {!isAdminPage && <Navbar />}
        {!isAdminPage && <CustomerNotification />}
        <main className={isAdminPage ? "" : "main-content"}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/medicines" element={<Medicines />} />
            <Route path="/medicine/:id" element={<MedicineDetails />} />
            <Route path="/lab-tests" element={<LabTests />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/categories" element={<SurgicalProducts />} />
            <Route path="/physiotherapy" element={<Physiotherapy />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<UserLogin />} />
            <Route path="/tokens" element={<TokenStatus />} />
          </Routes>
        </main>
        {!isAdminPage && <Footer />}
        {!isAdminPage && <MobileNavbar />}
        {!isAdminPage && <WhatsAppButton />}

        {!shouldHideCart && (
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => { setIsCartOpen(false); setShowCheckoutForm(false); }}
            cart={cart}
            totalItems={totalItems}
            cartTotal={cartTotal}
            onAdd={addToCart}
            onRemove={removeFromCart}
            onDelete={deleteFromCart}
            onCheckout={handleProceedToCheckout}
            showCheckoutForm={showCheckoutForm}
            customerDetails={customerDetails}
            setCustomerDetails={setCustomerDetails}
            onHandleCheckout={handleCheckout}
            isCheckingOut={isCheckingOut}
            onBack={() => setShowCheckoutForm(false)}
          />
        )}
        {!isCartOpen && !shouldHideCart && <FloatingCartBar onOpenCart={() => setIsCartOpen(true)} />}

        {/* ── Step 1: Delivery-box animation ── */}
        <AnimatePresence>
          {showOrderAnim && (
            <motion.div
              key="order-anim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              style={{
                position: 'fixed', inset: 0, zIndex: 10001,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(22px)',
                background: 'rgba(255,255,255,0.18)'
              }}
            >
              <motion.div
                initial={{ scale: 0.4, opacity: 0, y: 60 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.6, opacity: 0, y: -40 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}
              >
                {/* Yellow glow circle */}
                <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <motion.div
                    style={{
                      position: 'absolute', width: 180, height: 180,
                      borderRadius: '50%', background: '#fef9c3'
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 220, damping: 14 }}
                  />
                  {/* Box SVG */}
                  <motion.svg
                    viewBox="0 0 100 80" width="140" height="112"
                    style={{ position: 'relative', zIndex: 1 }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 18 }}
                  >
                    {/* Shadow */}
                    <ellipse cx="50" cy="76" rx="28" ry="4" fill="#d1c4a8" />
                    {/* Box body */}
                    <rect x="14" y="32" width="72" height="42" rx="3" fill="#c8913a" />
                    {/* Box top */}
                    <rect x="14" y="24" width="72" height="12" rx="3" fill="#d4a355" />
                    {/* Tape stripe */}
                    <rect x="46" y="24" width="8" height="50" rx="2" fill="#b07a2a" opacity="0.6" />
                    {/* Lid flap left */}
                    <path d="M14 24 Q18 14 32 18 L32 24 Z" fill="#d4a355" />
                    {/* Lid flap right */}
                    <path d="M86 24 Q82 14 68 18 L68 24 Z" fill="#d4a355" />
                    {/* Arrow up */}
                    <path d="M50 48 L44 56 h4 v12 h4 V56 h4 Z" fill="#7a5218" opacity="0.7" />
                    {/* Speed lines */}
                    <line x1="20" y1="44" x2="32" y2="44" stroke="#7a5218" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
                    <line x1="20" y1="52" x2="28" y2="52" stroke="#7a5218" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
                  </motion.svg>
                  {/* Green checkmark badge */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 420, damping: 12 }}
                    style={{
                      position: 'absolute', top: 4, right: 8,
                      width: 52, height: 52, borderRadius: '50%',
                      background: '#22c55e',
                      border: '4px solid #fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 16px rgba(34,197,94,0.45)',
                      zIndex: 2
                    }}
                  >
                    <motion.svg viewBox="0 0 24 24" width="26" height="26" fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.75, duration: 0.5, ease: 'easeOut' }}
                    >
                      <motion.path
                        d="M5 12.5l5 5 9-9"
                        stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.75, duration: 0.5, ease: 'easeOut' }}
                      />
                    </motion.svg>
                    {/* Ripple */}
                    <motion.div
                      style={{
                        position: 'absolute', inset: -6,
                        borderRadius: '50%', border: '3px solid #22c55e'
                      }}
                      initial={{ scale: 1, opacity: 0.7 }}
                      animate={{ scale: 1.8, opacity: 0 }}
                      transition={{ delay: 0.9, duration: 0.8, repeat: 2 }}
                    />
                  </motion.div>
                </div>
                {/* Text below box */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  style={{ textAlign: 'center' }}
                >
                  <p style={{
                    fontSize: '1.5rem', fontWeight: 800, color: '#16a34a',
                    margin: 0, letterSpacing: '-0.02em'
                  }}>Order Placed! 🎉</p>
                  <p style={{ fontSize: '0.95rem', color: '#64748b', marginTop: '0.3rem', fontWeight: 500 }}>
                    Preparing your confirmation…
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Step 2: Confirmation panel ── */}
        <AnimatePresence>
          {orderComplete && (
            <motion.div
              key="order-confirm"
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ zIndex: 10001, backdropFilter: 'blur(20px)' }}
            >
              <motion.div
                className="confirm-modal glass-panel text-center"
                initial={{ scale: 0.5, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
                style={{
                  width: '90%',
                  maxWidth: '450px',
                  padding: '2.5rem 1.5rem',
                  borderRadius: '32px',
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1.2, rotate: 0 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 10 }}
                  style={{ color: '#10b981', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}
                >
                  <div style={{ position: 'relative' }}>
                    <CheckCircle size={80} fill="#10b981" color="white" />
                    <motion.div
                      style={{ position: 'absolute', inset: -10, border: '4px solid #10b981', borderRadius: '50%' }}
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
                <h2 className="confirm-title">
                  Order Confirmed!
                </h2>
                <p className="confirm-text">
                  {(finalOrderSummary?.paymentMethod === 'ONLINE') 
                    ? "Thank you for your order! Our team will contact you on WhatsApp shortly to provide the payment link/QR code."
                    : "Thank you for your order! Our team will contact you shortly to confirm your delivery details."}
                  <br /><br />
                  <div className="order-summary-box">
                    <div className="summary-row">
                      <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Items Total:</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569' }}>₹{(finalOrderSummary?.total || 0).toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Delivery Fee:</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 600, color: (finalOrderSummary?.total || 0) >= 500 ? '#10b981' : '#475569' }}>
                        {(finalOrderSummary?.total || 0) >= 500 ? 'FREE' : '₹40.00'}
                      </span>
                    </div>
                    <div className="summary-total-row">
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Total Paid:</span>
                      <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>
                        ₹{((finalOrderSummary?.total || 0) + ((finalOrderSummary?.total || 0) >= 500 ? 0 : 40)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <span style={{ color: '#0d9488', fontWeight: 700 }}>Enjoy your purchase! 🛍️✨</span>
                </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginTop: '0.5rem' }}>
                    {finalOrderSummary?.paymentMethod === 'ONLINE' && (
                      <button 
                        className="btn btn-whatsapp-pay" 
                        onClick={() => {
                          const message = encodeURIComponent(`Hello! I just placed an order (Online Payment). My name is ${finalOrderSummary?.name}. Please provide the payment QR code/link.`);
                          window.open(`https://wa.me/919487469098?text=${message}`, '_blank');
                        }}
                      >
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        Click to Pay on WhatsApp
                      </button>
                    )}
                    <button 
                      className="btn btn-confirm-done" 
                      onClick={() => setOrderComplete(false)}
                    >
                      Done
                    </button>
                  </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;

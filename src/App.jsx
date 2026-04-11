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
  const [showCheckoutForm, setShowCheckoutForm] = React.useState(false);
  const [customerDetails, setCustomerDetails] = React.useState({
    name: '', phone: '', whatsapp: '', address: '', pincode: '', email: ''
  });

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
         setCustomerDetails(JSON.parse(saved));
       } else {
         // Fallback to basic user info if no saved delivery details yet
         setCustomerDetails({
           name: user.name || '',
           phone: user.phone && user.phone !== 'N/A' ? user.phone : '',
           email: user.email || '',
           whatsapp: user.phone && user.phone !== 'N/A' ? user.phone : '',
           address: '',
           pincode: ''
         });
       }
    } else {
       // Check for global guest details
       const savedGuest = localStorage.getItem('guardian_delivery_details_guest');
       if (savedGuest) {
         setCustomerDetails(JSON.parse(savedGuest));
       } else {
         setCustomerDetails({ name: '', phone: '', whatsapp: '', address: '', pincode: '', email: '' });
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
      items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity, image: item.images?.[0] || item.image_base64 })),
      total_amount: cartTotal
    };
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
      
      clearCart();
      setOrderComplete(true);
      setShowCheckoutForm(false);
      setTimeout(() => setOrderComplete(false), 3000);
      setIsCartOpen(false);
    }
  };

  return (
    <>
      <ScrollToTop />
      <div className="page-layout">

        <Navbar />
        <CustomerNotification />
        <main className="main-content">
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
        <Footer />
        <MobileNavbar />
        <WhatsAppButton />

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

        {/* Success Modal */}
        <AnimatePresence>
          {orderComplete && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ zIndex: 10001, backdropFilter: 'blur(20px)' }}
            >
              <motion.div
                className="confirm-modal glass-panel text-center"
                initial={{ scale: 0.2, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                style={{
                  maxWidth: '400px',
                  padding: '3rem',
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
                <h2 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.75rem', color: '#10b981', letterSpacing: '-0.02em' }}>
                  Order Confirmed!
                </h2>
                <p style={{ fontSize: '1.15rem', color: '#64748b', fontWeight: 500, lineHeight: 1.5 }}>
                  Thank you for your order. Our team will contact you shortly to confirm delivery.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;

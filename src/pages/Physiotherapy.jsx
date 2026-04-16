import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, CheckCircle, Heart, Thermometer, Shield, AlertCircle, Pill, Hand } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Medicines.css'; // Reuse existing styles
import physioBanner from '../assets/physiotherapy.png';

// Import modular components for consistency
import ProductCard from '../components/medicines/ProductCard';
import FloatingCartBar from '../components/FloatingCartBar';
import CartDrawer from '../components/medicines/CartDrawer';


function Physiotherapy() {
    const navigate = useNavigate();
    const { medicines, cart, addToCart, removeFromCart, clearCart, addOrder } = useApp();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showCheckoutForm, setShowCheckoutForm] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [customerDetails, setCustomerDetails] = useState({
        name: '', phone: '', whatsapp: '', address: '', pincode: '', email: ''
    });

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    const filteredMedicines = medicines.filter(med => med.category === 'Physiotherapy' || med.category === 'Ortho');

    const handleHandleCheckout = async (e) => {
        e.preventDefault();
        setIsCheckingOut(true);
        const orderData = {
            ...customerDetails,
            customer_name: customerDetails.name,
            items: cart,
            total_amount: cartTotal
        };

        const success = await addOrder(orderData);
        if (success) {
            setOrderComplete(true);
            setTimeout(() => {
                setOrderComplete(false);
                clearCart();
                setIsCartOpen(false);
                setShowCheckoutForm(false);
            }, 3000);
        }
        setIsCheckingOut(false);
    };

    const handleProceedToCheckout = () => {
        setShowCheckoutForm(true);
    };

    const handleBackClick = () => {
        setShowCheckoutForm(false);
    };


    return (
        <motion.div
            className="medicines-page"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <section className="med-header section-padding" style={{ background: '#f0fdfa' }}>
                <div className="container">
                    <div className="med-header-flex">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <h1 className="title">Physiotherapy</h1>
                            <p className="subtitle">Premium equipment and tools for physiotherapy and recovery at home.</p>
                        </motion.div>
                    </div>

                    {/* Quick Action: Home Appointment */}
                    <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
                        <a href="tel:9487469098" className="action-banner-item" style={{
                            background: 'white', border: '1px solid #0d9488', borderRadius: '24px',
                            padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px',
                            cursor: 'pointer', boxShadow: '0 4px 15px rgba(13, 148, 136, 0.1)',
                            flex: '1', maxWidth: '450px', textDecoration: 'none', color: 'inherit'
                        }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Book Your Home Appointment</h3>
                                <p style={{ fontSize: '0.85rem', color: '#0d9488', margin: '4px 0 0 0', fontWeight: 600 }}>Professional Physiotherapy at Your Doorstep</p>
                            </div>
                            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#0d9488', background: '#f0fdfa', padding: '8px 12px', borderRadius: '16px' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.5px' }}>TAP TO BOOK</span>
                                <motion.div
                                    animate={{ x: [0, 4, 0] }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                                >
                                    <Hand size={18} fill="currentColor" fillOpacity={0.1} />
                                </motion.div>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            <section className="med-products">
                <div className="container">
                    {filteredMedicines.length === 0 ? (
                        <div className="empty-state">
                            <h3>No physiotherapy products found</h3>
                            <p>We are currently updating our physiotherapy inventory. Please check back soon.</p>
                        </div>
                    ) : (
                        <div className="products-grid">
                            <AnimatePresence>
                                {filteredMedicines.map((medicine) => (
                                    <ProductCard
                                        key={medicine.id}
                                        medicine={medicine}
                                        cart={cart}
                                        onAddToCart={addToCart}
                                        onRemoveFromCart={removeFromCart}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </section>

            {/* Slide-over Cart */}
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => { setIsCartOpen(false); setShowCheckoutForm(false); }}
                cart={cart}
                totalItems={totalItems}
                cartTotal={cartTotal}
                onAdd={addToCart}
                onRemove={removeFromCart}
                onCheckout={handleProceedToCheckout}
                showCheckoutForm={showCheckoutForm}
                customerDetails={customerDetails}
                setCustomerDetails={setCustomerDetails}
                onHandleCheckout={handleHandleCheckout}
                isCheckingOut={isCheckingOut}
                onBack={handleBackClick}
            />

            <AnimatePresence>
                {orderComplete && (
                    <div className="modal-overlay" style={{ zIndex: 1000 }}>
                        <motion.div 
                            className="modal-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOrderComplete(false)}
                        />
                        <motion.div 
                            className="modal-content success-modal"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            style={{ maxWidth: '450px', padding: '3rem 2rem', textAlign: 'center' }}
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: -15 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                                style={{ 
                                    width: '100px', 
                                    height: '100px', 
                                    background: '#f0fdf4', 
                                    borderRadius: '50%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    margin: '0 auto 2rem',
                                    border: '5px solid #ccfbf1'
                                }}
                            >
                                <CheckCircle size={60} color="#10b981" fill="#10b981" fillOpacity={0.1} />
                            </motion.div>

                            <h2 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.75rem', color: '#10b981', letterSpacing: '-0.02em' }}>
                                Order Confirmed!
                            </h2>
                            <p style={{ fontSize: '1.15rem', color: '#64748b', fontWeight: 500, lineHeight: 1.5, marginBottom: '2.4rem' }}>
                                Thank you for your order! Our team will contact you shortly to confirm your delivery details.
                                <br /><br />
                                <span style={{ color: '#0d9488', fontWeight: 700 }}>Enjoy your purchase! 🛍️✨</span>
                            </p>

                            <button 
                                className="btn btn-primary btn-block" 
                                onClick={() => setOrderComplete(false)}
                                style={{ borderRadius: '15px', padding: '16px', fontWeight: 800 }}
                            >
                                Continue Shopping
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>



            {/* Floating Cart Bar (for mobile parity) */}
            {!isCartOpen && <FloatingCartBar onOpenCart={() => setIsCartOpen(true)} />}
        </motion.div>
    );
}

export default Physiotherapy;

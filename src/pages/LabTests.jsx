import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Plus, Minus, X, CheckCircle, Activity, Heart, Thermometer, Shield, TestTube, Phone, AlertCircle, Droplet, Sun, Users, UserPlus, Receipt, User, Bug, Wind, ShieldAlert, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Medicines.css'; // Reusing Medicines CSS since the design language is very similar

const playCartSound = (action) => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        if (action === 'add') {
            osc.frequency.setValueAtTime(300, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
        } else {
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
        }
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
        console.error(e);
    }
};



function LabTests() {
    const { labTests, cart, addToCart, removeFromCart, clearCart, addOrder, uploadPrescription } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('All');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [showCheckoutForm, setShowCheckoutForm] = useState(false);

    const handlePrescriptionUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result;
            const success = await uploadPrescription(base64);
            if (success) {
                alert('Prescription uploaded successfully! Our team will review it and contact you soon.');
            } else {
                alert('Upload failed. Please try again or call us directly.');
            }
        };
        reader.readAsDataURL(file);
    };
    const [addedToCart, setAddedToCart] = useState(false);
    const [showProceedConfirm, setShowProceedConfirm] = useState(false);
    const [showBackConfirm, setShowBackConfirm] = useState(false);
    const [customerDetails, setCustomerDetails] = useState({
        name: '', phone: '', whatsapp: '', address: '', pincode: '', email: ''
    });

    const handleAddToCartItem = (item) => {
        addToCart(item);
        playCartSound('add');
    };

    const handleRemoveFromCartItem = (id) => {
        removeFromCart(id);
        playCartSound('remove');
    };

    const filteredTests = labTests.filter(test => {
        const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            test.category.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesCondition = true;
        if (selectedCondition !== 'All') {
            if (selectedCondition === 'General' && test.condition === 'General') matchesCondition = true;
            else if (selectedCondition === 'Diabetes' && test.condition === 'Diabetes') matchesCondition = true;
            else if (selectedCondition === 'Thyroid' && test.condition === 'Thyroid') matchesCondition = true;
            else if (selectedCondition === 'Immunity' && test.condition === 'Immunity') matchesCondition = true;
            else if (selectedCondition === 'Blood Studies' && test.category === 'Blood Studies') matchesCondition = true;
            else if (selectedCondition === 'Heart' && test.condition === 'Heart') matchesCondition = true;
            else if (selectedCondition === 'Kidney' && test.condition === 'Kidney') matchesCondition = true;
            else if (selectedCondition === 'Liver' && test.condition === 'Liver') matchesCondition = true;
            else matchesCondition = false;
        }

        return matchesSearch && matchesCondition;
    });

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    const handleProceedToCheckout = () => {
        setShowProceedConfirm(true);
    };

    const confirmProceed = () => {
        setShowProceedConfirm(false);
        setShowCheckoutForm(true);
    };

    const handleBackClick = () => {
        setShowBackConfirm(true);
    };

    const confirmBack = () => {
        setShowBackConfirm(false);
        setShowCheckoutForm(false);
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
            items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity, image: (Array.isArray(item.images) && item.images.length > 0) ? item.images[0] : (item.image_base64 || null) })),
            total_amount: cartTotal
        };

        const success = await addOrder(orderDetails);
        setIsCheckingOut(false);

        if (success) {
            clearCart();
            setOrderComplete(true);
            setShowCheckoutForm(false);
            setCustomerDetails({ name: '', phone: '', whatsapp: '', address: '', pincode: '', email: '' });
            setTimeout(() => setOrderComplete(false), 3000);
            setIsCartOpen(false);
        } else {
            alert("Failed to place order. Please try again.");
        }
    };

    return (
        <motion.div
            className="medicines-page"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {/* Header and Search */}
            <section className="med-header section-padding">
                <div className="container">
                    <motion.div
                        className="med-header-flex"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <div>
                            <h1 className="title">Lab Tests &amp; <span className="gradient-text">Diagnostics</span></h1>
                            <p className="subtitle">Book professional lab tests from the comfort of your home.</p>
                        </div>

                    </motion.div>

                    <div className="quick-action-banners" style={{
                        marginTop: '2.5rem',
                        display: 'flex',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}>
                        <a href="tel:9487469098" className="action-banner-item" style={{
                            background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px',
                            padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px',
                            cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', flex: '1', minWidth: '260px',
                            maxWidth: '100%', textDecoration: 'none', color: 'inherit'
                        }}>
                            <div style={{ background: '#f0f9ff', padding: '10px', borderRadius: '50%', color: '#0ea5e9', flexShrink: 0 }}>
                                <Phone size={20} />
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, whiteSpace: 'nowrap' }}>Book on Call</h3>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0 0' }}>94874 69098</p>
                            </div>
                        </a>

                        <div className="action-banner-item" style={{
                            background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px',
                            padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px',
                            cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', flex: '1', minWidth: '260px',
                            maxWidth: '100%'
                        }} onClick={() => document.getElementById('prescription-upload').click()}>
                            <input
                                type="file"
                                id="prescription-upload"
                                hidden
                                accept="image/*"
                                onChange={handlePrescriptionUpload}
                            />
                            <div style={{ background: '#fdf2f8', padding: '10px', borderRadius: '50%', color: '#ec4899', flexShrink: 0 }}>
                                <Receipt size={20} />
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, whiteSpace: 'nowrap' }}>Upload Prescription</h3>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0 0' }}>JPG, PNG or PDF</p>
                            </div>
                        </div>
                    </div>
                </div>


            </section>

            {/* Products Grid */}


            {/* Slide-over Cart */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div
                            className="cart-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                        />
                        <motion.div
                            className="cart-drawer"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        >
                            <div className="cart-header">
                                <h2>{showCheckoutForm ? 'Delivery Details' : `Your Cart (${totalItems})`}</h2>
                                <button className="close-btn" onClick={() => { setIsCartOpen(false); setShowCheckoutForm(false); }}>
                                    <X size={24} />
                                </button>
                            </div>

                            {!showCheckoutForm ? (
                                <>
                                    <div className="cart-items">
                                        {cart.length === 0 ? (
                                            <motion.div className="empty-cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                <ShoppingCart size={48} className="text-muted" />
                                                <p>Your cart is empty.</p>
                                            </motion.div>
                                        ) : (
                                            <AnimatePresence>
                                                {cart.map(item => (
                                                    <motion.div
                                                        key={item.id}
                                                        className="cart-item"
                                                        layout
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8, x: -50 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <div className="item-details">
                                                            <h4>{item.name}</h4>
                                                            <p className="text-muted">₹{Number(item.price).toFixed(2)}</p>
                                                        </div>
                                                        <div className="item-actions">
                                                            <motion.button whileTap={{ scale: 0.8 }} className="qty-btn" onClick={() => handleRemoveFromCartItem(item.id)}>
                                                                <Minus size={16} />
                                                            </motion.button>
                                                            <span className="quantity">{item.quantity}</span>
                                                            <motion.button whileTap={{ scale: 0.8 }} className="qty-btn qty-btn-plus" onClick={() => handleAddToCartItem(item)}>
                                                                <Plus size={16} />
                                                            </motion.button>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        )}
                                    </div>

                                    {cart.length > 0 && (
                                        <div className="cart-footer">
                                            <div className="cart-summary">
                                                <span>Total:</span>
                                                <span className="cart-total">₹{cartTotal.toFixed(2)}</span>
                                            </div>
                                            <button
                                                className="btn btn-primary btn-block checkout-btn"
                                                onClick={handleProceedToCheckout}
                                            >
                                                Proceed to Checkout
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <form onSubmit={handleCheckout} className="checkout-form">
                                    <div className="cart-items" style={{ gap: '0.75rem' }}>
                                        <div className="checkout-form-group">
                                            <label className="input-label">Full Name *</label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Enter your full name"
                                                required
                                                value={customerDetails.name}
                                                onChange={e => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="checkout-form-group">
                                            <label className="input-label">Phone Number *</label>
                                            <input
                                                type="tel"
                                                className="input-field"
                                                placeholder="Enter your phone number"
                                                required
                                                value={customerDetails.phone}
                                                onChange={e => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="checkout-form-group">
                                            <label className="input-label">WhatsApp Number *</label>
                                            <input
                                                type="tel"
                                                className="input-field"
                                                placeholder="Enter your WhatsApp number"
                                                required
                                                value={customerDetails.whatsapp}
                                                onChange={e => setCustomerDetails({ ...customerDetails, whatsapp: e.target.value })}
                                            />
                                        </div>
                                        <div className="checkout-form-group">
                                            <label className="input-label">Delivery Address *</label>
                                            <textarea
                                                className="input-field"
                                                placeholder="Enter your full delivery address"
                                                required
                                                rows="3"
                                                value={customerDetails.address}
                                                onChange={e => setCustomerDetails({ ...customerDetails, address: e.target.value })}
                                            ></textarea>
                                        </div>
                                        <div className="checkout-form-group">
                                            <label className="input-label">Pincode *</label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Enter your pincode"
                                                required
                                                maxLength="6"
                                                value={customerDetails.pincode}
                                                onChange={e => setCustomerDetails({ ...customerDetails, pincode: e.target.value })}
                                            />
                                        </div>
                                        <div className="checkout-form-group">
                                            <label className="input-label">Email <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span></label>
                                            <input
                                                type="email"
                                                className="input-field"
                                                placeholder="Enter your email (optional)"
                                                value={customerDetails.email}
                                                onChange={e => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="cart-footer">
                                        <div className="cart-summary">
                                            <span>Total:</span>
                                            <span className="cart-total">₹{cartTotal.toFixed(2)}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            <button
                                                type="button"
                                                className="btn btn-outline"
                                                style={{ flex: 1 }}
                                                onClick={handleBackClick}
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-primary checkout-btn"
                                                style={{ flex: 2 }}
                                                disabled={isCheckingOut}
                                            >
                                                {isCheckingOut ? 'Processing...' : 'Place Order'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Proceed to Checkout Confirmation Modal */}
            <AnimatePresence>
                {showProceedConfirm && (
                    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="confirm-modal glass-panel" initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}>
                            <div className="modal-icon-wrapper text-primary">
                                <ShoppingCart size={40} />
                            </div>
                            <h3>Ready to Checkout?</h3>
                            <p>You have {totalItems} items in your cart totaling ₹{cartTotal.toFixed(2)}.</p>
                            <div className="modal-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowProceedConfirm(false)}>Cancel</button>
                                <button className="btn btn-primary" style={{ flex: 1 }} onClick={confirmProceed}>Confirm</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Back Confirmation Modal */}
            <AnimatePresence>
                {showBackConfirm && (
                    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="confirm-modal glass-panel" initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}>
                            <div className="modal-icon-wrapper text-muted">
                                <AlertCircle size={40} />
                            </div>
                            <h3>Why are you going back?</h3>
                            <p>You haven't placed your order yet! Are you sure you want to go back to the cart?</p>
                            <div className="modal-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowBackConfirm(false)}>Stay Here</button>
                                <button className="btn btn-primary" style={{ flex: 1, backgroundColor: 'var(--text-muted)' }} onClick={confirmBack}>Yes, Go Back</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success Toast -> Prominent Order Confirmed Modal */}
            <AnimatePresence>
                {orderComplete && (
                    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="confirm-modal glass-panel text-center" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ type: "spring", bounce: 0.5 }}>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                style={{ color: 'var(--success-color, #28a745)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}
                            >
                                <CheckCircle size={64} fill="currentColor" color="white" />
                            </motion.div>
                            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--success-color, #28a745)' }}>Order Confirmed!</h2>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Thank you for your order. We'll be in touch soon.</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Engaging Added to Cart Popup */}
            <AnimatePresence>
                {addedToCart && (
                    <motion.div
                        className="toast success-toast toast-top engaging-toast"
                        initial={{ opacity: 0, y: -50, scale: 0.5, rotate: -10 }}
                        animate={{ opacity: 1, y: 20, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, y: -50, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        style={{
                            position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
                            padding: '12px 24px', fontSize: '1.1rem', backgroundColor: 'var(--primary)',
                            color: 'white', borderRadius: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                            display: 'flex', alignItems: 'center', gap: '8px', zIndex: 9999
                        }}
                    >
                        <ShoppingCart size={24} />
                        <span style={{ fontWeight: '600' }}>Item added to your cart! 🎉</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Promotional Call to Action specific to Lab Tests */}
            <section className="section-padding" style={{ paddingBottom: '4rem' }}>
                <div className="container">
                    <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', borderRadius: 'var(--border-radius-lg)', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Need assistance booking a test?</h2>
                            <p style={{ opacity: 0.9 }}>Our health advisors are available 24/7 to help you choose the right tests.</p>
                        </div>
                        <a href="tel:9487469098" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'white', color: 'var(--primary)', padding: '1rem 2rem', borderRadius: 'var(--border-radius-full)', fontWeight: 700, textDecoration: 'none', boxShadow: 'var(--shadow-md)' }}>
                            <Phone size={20} /> CALL TO BOOK 9487469098
                        </a>
                    </div>
                </div>
            </section>
        </motion.div>
    );
}

export default LabTests;

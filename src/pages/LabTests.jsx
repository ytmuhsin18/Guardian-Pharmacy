import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Plus, Minus, X, CheckCircle, Activity, Heart, Thermometer, Shield, TestTube, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Medicines.css'; // Reusing Medicines CSS since the design language is very similar

const conditionFilters = [
    { label: 'All', value: 'All', icon: <Activity size={18} /> },
    { label: 'Full Body Checkup', value: 'General', icon: <Activity size={18} /> },
    { label: 'Diabetes', value: 'Diabetes', icon: <Activity size={18} /> },
    { label: 'Women\'s Health', value: 'Women', icon: <Activity size={18} /> },
    { label: 'Thyroid', value: 'Thyroid', icon: <Activity size={18} /> },
    { label: 'Vitamin', value: 'Immunity', icon: <Activity size={18} /> },
    { label: 'Blood Studies', value: 'Blood Studies', icon: <Activity size={18} /> },
    { label: 'Heart', value: 'Heart', icon: <Heart size={18} /> },
    { label: 'Kidney', value: 'Kidney', icon: <Activity size={18} /> },
    { label: 'Liver', value: 'Liver', icon: <Activity size={18} /> },
];

function LabTests() {
    const { labTests, cart, addToCart, removeFromCart, clearCart, addOrder } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('All');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [showCheckoutForm, setShowCheckoutForm] = useState(false);
    const [customerDetails, setCustomerDetails] = useState({
        name: '', phone: '', whatsapp: '', address: '', pincode: '', email: ''
    });

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
            items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
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
        <div className="medicines-page">
            {/* Header and Search */}
            <section className="med-header section-padding">
                <div className="container">
                    <div className="med-header-flex">
                        <div>
                            <h1 className="title">Doctor Created <span className="gradient-text">Health Checks</span></h1>
                            <p className="subtitle">Book lab tests from the comfort of your home.</p>
                        </div>

                        <div className="search-bar-container">
                            <div className="search-input-wrapper">
                                <Search className="search-icon text-muted" size={20} />
                                <input
                                    type="text"
                                    className="input-field search-input"
                                    placeholder="Search tests or checkups..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button
                                className="cart-btn"
                                onClick={() => setIsCartOpen(true)}
                            >
                                <ShoppingCart size={24} className="text-primary" />
                                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                            </button>
                        </div>
                    </div>

                    {/* Condition Filters */}
                    <div className="condition-filters" style={{ marginTop: '20px', display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                        {conditionFilters.map(filter => (
                            <button
                                key={filter.value}
                                className={`pill-btn ${selectedCondition === filter.value ? 'active' : ''}`}
                                onClick={() => setSelectedCondition(filter.value)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '8px 16px', borderRadius: 'var(--border-radius-full)',
                                    border: '1px solid var(--border-color)',
                                    backgroundColor: selectedCondition === filter.value ? 'var(--primary)' : 'var(--surface-color)',
                                    color: selectedCondition === filter.value ? 'white' : 'var(--text-main)',
                                    cursor: 'pointer', whiteSpace: 'nowrap', transition: 'var(--transition)',
                                    boxShadow: 'var(--shadow-sm)'
                                }}
                            >
                                {filter.icon}
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="med-products">
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2>Top Booked Tests ({filteredTests.length})</h2>
                    </div>
                    <motion.div
                        className="products-grid"
                        layout
                    >
                        <AnimatePresence>
                            {filteredTests.map((test) => (
                                <motion.div
                                    key={test.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="product-card glass-panel"
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                                        <div style={{ background: 'var(--surface-dark)', padding: '1rem', borderRadius: 'var(--border-radius-md)' }}>
                                            <TestTube size={32} className="text-secondary" />
                                        </div>
                                        <div>
                                            <h3 className="product-title" style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{test.name}</h3>
                                            <p className="product-desc" style={{ fontSize: '0.9rem', margin: 0 }}>{test.testsIncluded} Tests Included</p>
                                        </div>
                                    </div>

                                    <div className="product-footer" style={{ marginTop: 'auto', alignItems: 'center' }}>
                                        <div className="product-price">
                                            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>₹{Number(test.price).toFixed(2)}</span>
                                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through', margin: '0 8px' }}>₹{Number(test.originalPrice).toFixed(2)}</span>
                                            <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 600 }}>{test.discount} off</span>
                                        </div>

                                        <button
                                            className="btn btn-primary add-btn"
                                            onClick={() => {
                                                addToCart(test);
                                                setAddedToCart(true);
                                                setTimeout(() => setAddedToCart(false), 1500);
                                            }}
                                            style={{ padding: '0.5rem 1.5rem', borderRadius: 'var(--border-radius-md)' }}
                                        >
                                            Add
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filteredTests.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon"><Search size={48} className="text-muted" /></div>
                            <h3>No lab tests found</h3>
                            <p>We couldn't find any lab tests matching your criteria.</p>
                        </div>
                    )}
                </div>
            </section>

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
                                            <div className="empty-cart">
                                                <ShoppingCart size={48} className="text-muted" />
                                                <p>Your cart is empty.</p>
                                            </div>
                                        ) : (
                                            cart.map(item => (
                                                <div key={item.id} className="cart-item">
                                                    <div className="item-details">
                                                        <h4>{item.name}</h4>
                                                        <p className="text-muted">₹{Number(item.price).toFixed(2)}</p>
                                                    </div>
                                                    <div className="item-actions">
                                                        <button className="qty-btn" onClick={() => removeFromCart(item.id)}>
                                                            <Minus size={16} />
                                                        </button>
                                                        <span className="quantity">{item.quantity}</span>
                                                        <button className="qty-btn qty-btn-plus" onClick={() => addToCart(item)}>
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
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
                                                onClick={() => setShowCheckoutForm(false)}
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

            {/* Success Toast */}
            <AnimatePresence>
                {orderComplete && (
                    <motion.div
                        className="toast success-toast"
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 50, x: '-50%' }}
                    >
                        <CheckCircle size={24} />
                        Tests booked successfully!
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Added to Cart Toast */}
            <AnimatePresence>
                {addedToCart && (
                    <motion.div
                        className="toast success-toast toast-top"
                        initial={{ opacity: 0, y: -50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -50, x: '-50%' }}
                    >
                        <CheckCircle size={24} />
                        Added to cart!
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
        </div>
    );
}

export default LabTests;

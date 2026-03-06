import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Plus, Minus, X, CheckCircle, Activity, Heart, Thermometer, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Medicines.css';

const conditionFilters = [
    { label: 'All', value: 'All', icon: <Activity size={18} /> },
    { label: 'Fever', value: 'Fever', icon: <Thermometer size={18} /> },
    { label: 'Heart', value: 'Heart', icon: <Heart size={18} /> },
    { label: 'Immunity', value: 'Immunity', icon: <Shield size={18} /> },
    { label: 'Allergy', value: 'Allergy', icon: <Activity size={18} /> },
    { label: 'Diabetes', value: 'Diabetes', icon: <Activity size={18} /> },
    { label: 'Thyroid', value: 'Thyroid', icon: <Activity size={18} /> }
];

function Medicines() {
    const { medicines, cart, addToCart, removeFromCart, clearCart } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('All');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);

    const filteredMedicines = medicines.filter(med => {
        const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            med.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCondition = selectedCondition === 'All' || med.condition === selectedCondition;
        return matchesSearch && matchesCondition;
    });

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    const handleCheckout = (e) => {
        e.preventDefault();
        setIsCheckingOut(true);
        // Simulate API call
        setTimeout(() => {
            clearCart();
            setIsCheckingOut(false);
            setOrderComplete(true);
            setTimeout(() => setOrderComplete(false), 3000);
            setIsCartOpen(false);
        }, 1500);
    };

    return (
        <div className="medicines-page">
            {/* Header and Search */}
            <section className="med-header section-padding">
                <div className="container">
                    <div className="med-header-flex">
                        <div>
                            <h1 className="title">Pharmacy <span className="gradient-text">Store</span></h1>
                            <p className="subtitle">Order authentic medicines for immediate delivery.</p>
                        </div>

                        <div className="search-bar-container">
                            <div className="search-input-wrapper">
                                <Search className="search-icon text-muted" size={20} />
                                <input
                                    type="text"
                                    className="input-field search-input"
                                    placeholder="Search medicines or categories..."
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
                                    cursor: 'pointer', whiteSpace: 'nowrap', transition: 'var(--transition)'
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
                    <motion.div
                        className="products-grid"
                        layout
                    >
                        <AnimatePresence>
                            {filteredMedicines.map((medicine) => (
                                <motion.div
                                    key={medicine.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="product-card glass-panel"
                                >
                                    <div className="product-category badge">{medicine.category}</div>
                                    <h3 className="product-title">{medicine.name}</h3>
                                    <p className="product-desc">{medicine.description}</p>

                                    <div className="product-footer">
                                        <div className="product-price">
                                            ${Number(medicine.price).toFixed(2)}
                                        </div>

                                        {medicine.inStock ? (
                                            <button
                                                className="btn btn-primary add-btn"
                                                onClick={() => addToCart(medicine)}
                                            >
                                                <Plus size={16} /> Add
                                            </button>
                                        ) : (
                                            <span className="out-of-stock badge">Out of Stock</span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filteredMedicines.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon"><Search size={48} className="text-muted" /></div>
                            <h3>No medicines found</h3>
                            <p>We couldn't find any medicines matching "{searchTerm}"</p>
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
                                <h2>Your Cart ({totalItems})</h2>
                                <button className="close-btn" onClick={() => setIsCartOpen(false)}>
                                    <X size={24} />
                                </button>
                            </div>

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
                                                <p className="text-muted">${Number(item.price).toFixed(2)}</p>
                                            </div>
                                            <div className="item-actions">
                                                <span className="quantity">x{item.quantity}</span>
                                                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                                                    <Minus size={16} />
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
                                        <span className="cart-total">${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <button
                                        className="btn btn-primary btn-block checkout-btn"
                                        onClick={handleCheckout}
                                        disabled={isCheckingOut}
                                    >
                                        {isCheckingOut ? 'Processing...' : 'Checkout & Order'}
                                    </button>
                                </div>
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
                        Order placed successfully!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Medicines;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Plus, Minus, X, CheckCircle, Activity, Heart, Thermometer, Shield, AlertCircle, Pill } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Medicines.css';

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

const conditionFilters = [
    { label: 'All', value: 'All' },
    { label: 'Fever', value: 'Fever' },
    { label: 'Heart', value: 'Heart' },
    { label: 'Immunity', value: 'Immunity' },
    { label: 'Allergy', value: 'Allergy' },
    { label: 'Diabetes', value: 'Diabetes' },
    { label: 'Thyroid', value: 'Thyroid' }
];

const pharmacyCategories = [
    { id: 1, label: 'Baby Care', value: 'Baby Care', image: 'https://images.unsplash.com/photo-1515488442478-d069dc52331b?q=80&w=200&auto=format&fit=crop', color: '#fef2f2' },
    { id: 2, label: 'Pharma & Wellness', value: 'Pharmacy', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=200&auto=format&fit=crop', color: '#eefcfd' },
    { id: 3, label: 'Skin Care', value: 'Skin Care', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=200&auto=format&fit=crop', color: '#f0f9ff' },
    { id: 4, label: 'Vitamins', value: 'Vitamins', image: 'https://images.unsplash.com/photo-1471864190281-ad599f73bc24?q=80&w=200&auto=format&fit=crop', color: '#fdfaea' },
    { id: 5, label: 'Personal Care', value: 'Personal Care', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=200&auto=format&fit=crop', color: '#f5f3ff' },
    { id: 6, label: 'Ayurvedic', value: 'Ayurvedic', image: 'https://images.unsplash.com/photo-1540348563406-ed430266472b?q=80&w=200&auto=format&fit=crop', color: '#f0fdf4' },
    { id: 7, label: 'Pain Relief', value: 'Pain Relief', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=200&auto=format&fit=crop', color: '#fff7ed' },
    { id: 8, label: 'First Aid', value: 'First Aid', image: 'https://images.unsplash.com/photo-1603398938378-e54eab446fec?q=80&w=200&auto=format&fit=crop', color: '#fefce8' },
    { id: 9, label: 'Devices', value: 'Healthcare Devices', image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=200&auto=format&fit=crop', color: '#ecfeff' },
    { id: 10, label: 'Home Care', value: 'Home Care', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=200&auto=format&fit=crop', color: '#fdf4ff' },
    { id: 11, label: 'Sexual Wellness', value: 'Sexual Wellness', image: 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?q=80&w=200&auto=format&fit=crop', color: '#fff1f2' },
    { id: 12, label: 'Maternity', value: 'Maternity Care', image: 'https://images.unsplash.com/photo-1515488442478-d069dc52331b?q=80&w=200&auto=format&fit=crop', color: '#fdf2f8' },
];

function Medicines() {
    const navigate = useNavigate();
    const { medicines, cart, addToCart, removeFromCart, clearCart, addOrder } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedCondition, setSelectedCondition] = useState('All');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [addedToCart, setAddedToCart] = useState(null); // stores the product just added
    const [selectedMedicine, setSelectedMedicine] = useState(null); // for quick view detail modal
    const [activeModalImageIndex, setActiveModalImageIndex] = useState(0);
    const [showCheckoutForm, setShowCheckoutForm] = useState(false);
    const [showProceedConfirm, setShowProceedConfirm] = useState(false);
    const [showBackConfirm, setShowBackConfirm] = useState(false);
    const [customerDetails, setCustomerDetails] = useState({
        name: '', phone: '', whatsapp: '', address: '', pincode: '', email: ''
    });

    // Prevent body scrolling when a modal or drawer is open
    useEffect(() => {
        if (isCartOpen || showProceedConfirm || showBackConfirm || addedToCart || selectedMedicine || orderComplete) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => document.body.classList.remove('modal-open');
    }, [isCartOpen, showProceedConfirm, showBackConfirm, addedToCart, selectedMedicine, orderComplete]);

    const scrollToProducts = () => {
        const prodSection = document.getElementById('products-listing-start');
        if (prodSection) {
            prodSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleCategoryClick = (catValue) => {
        const newValue = catValue === selectedCategory ? 'All' : catValue;
        setSelectedCategory(newValue);
        if (newValue !== 'All') {
            setTimeout(scrollToProducts, 100);
        }
    };

    const handleAddToCartItem = (item) => {
        addToCart(item);
        playCartSound('add');
    };

    const handleRemoveFromCartItem = (id) => {
        removeFromCart(id);
        playCartSound('remove');
    };

    const filteredMedicines = medicines.filter(med => {
        const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            med.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCondition = selectedCondition === 'All' || med.condition === selectedCondition;
        const matchesCategory = selectedCategory === 'All' || med.category.toLowerCase().includes(selectedCategory.toLowerCase());
        return matchesSearch && matchesCondition && matchesCategory;
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

                    {/* Categories Grid Section - "This Model" */}
                    <div className="categories-section">
                        <h2 className="section-title" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 700 }}>Shop by Category</h2>
                        <div className="category-grid">
                            {pharmacyCategories.map(cat => (
                                <motion.div
                                    key={cat.id}
                                    className={`category-item ${selectedCategory === cat.value ? 'active' : ''}`}
                                    onClick={() => handleCategoryClick(cat.value)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="category-image-wrapper" style={{ backgroundColor: cat.color }}>
                                        <img src={cat.image} alt={cat.label} className="category-img" />
                                    </div>
                                    <span className="category-label">{cat.label}</span>
                                </motion.div>
                            ))}
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
                                    display: 'inline-block',
                                    padding: '8px 16px', borderRadius: 'var(--border-radius-full)',
                                    border: '1px solid var(--border-color)',
                                    backgroundColor: selectedCondition === filter.value ? 'var(--primary)' : 'var(--surface-color)',
                                    color: selectedCondition === filter.value ? 'white' : 'var(--text-main)',
                                    cursor: 'pointer', whiteSpace: 'nowrap', transition: 'var(--transition)'
                                }}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="med-products" id="products-listing-start">
                <div className="container">
                    {medicines.length === 0 ? (
                        <div className="text-center py-8">Loading Medicines...</div>
                    ) : (
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
                                        className="product-card"
                                    >
                                        {(() => {
                                            const cartItem = cart.find(item => item.id === medicine.id);
                                            const quantity = cartItem ? cartItem.quantity : 0;

                                            return (
                                                <div className="product-image-section">
                                                    {/* Bestseller Badge */}
                                                    {(medicine.price > 100 || medicine.discount > 5) && (
                                                        <div className="bestseller-badge">Bestseller</div>
                                                    )}

                                                    <div
                                                        className="product-image-container"
                                                        onClick={() => { setSelectedMedicine(medicine); setActiveModalImageIndex(0); }}
                                                    >
                                                        {(Array.isArray(medicine.images) && medicine.images.length > 0) ? (
                                                            <img src={medicine.images[0]} alt={medicine.name} className="product-img" />
                                                        ) : medicine.image_base64 ? (
                                                            <img src={medicine.image_base64} alt={medicine.name} className="product-img" />
                                                        ) : (
                                                            <div className="product-placeholder">
                                                                <Pill size={40} className="text-muted" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Floating Add/Quantity Button */}
                                                    {medicine.inStock ? (
                                                        quantity > 0 ? (
                                                            <div className="qty-selector-floating" onClick={e => e.stopPropagation()}>
                                                                <button className="qty-op-btn" onClick={() => removeFromCart(medicine.id)}>
                                                                    <Minus size={14} strokeWidth={3} />
                                                                </button>
                                                                <span className="qty-amount">{quantity}</span>
                                                                <button className="qty-op-btn" onClick={() => addToCart(medicine)}>
                                                                    <Plus size={14} strokeWidth={3} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                className="add-btn"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    addToCart(medicine);
                                                                    playCartSound('add');
                                                                }}
                                                            >
                                                                <Plus size={20} strokeWidth={3} />
                                                            </button>
                                                        )
                                                    ) : (
                                                        <div className="out-of-stock-label">Out of Stock</div>
                                                    )}
                                                </div>
                                            );
                                        })()}

                                        <div className="product-info-section" onClick={() => { setSelectedMedicine(medicine); setActiveModalImageIndex(0); }}>
                                            <div className="product-price-row">
                                                <span className="price-pill">₹{Number(medicine.price).toFixed(0)}</span>
                                                {medicine.discount > 0 && (
                                                    <span className="mrp-old">₹{(medicine.price / (1 - medicine.discount / 100)).toFixed(0)}</span>
                                                )}
                                            </div>

                                            {medicine.discount > 0 && (
                                                <div className="savings-label">₹{(medicine.price * medicine.discount / 100).toFixed(0)} OFF</div>
                                            )}

                                            <h3 className="product-name-new">{medicine.name}</h3>

                                            <div className="product-meta-new">
                                                <span className="pack-size">1 pack ({medicine.combination?.split('+')[0] || '10 tabs'})</span>
                                                <div className="product-tag-pill">{medicine.category}</div>
                                            </div>

                                            <div className="product-footer-new">
                                                <div className="rating-row">
                                                    <div className="star-icon">★</div>
                                                    <span className="rating-val">4.8</span>
                                                    <span className="rating-count">(100+)</span>
                                                </div>
                                                <div className="no-fee">No Convenience Fee</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}

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
                            onClick={() => { setIsCartOpen(false); setShowCheckoutForm(false); }}
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

            {/* Add to Cart Modal */}
            <AnimatePresence>
                {addedToCart && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setAddedToCart(null)}
                    >
                        <motion.div
                            className="atc-modal glass-panel"
                            initial={{ scale: 0.85, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.85, opacity: 0, y: 40 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                className="atc-close-btn"
                                onClick={() => setAddedToCart(null)}
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>

                            {/* Success Badge */}
                            <div className="atc-success-badge">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
                                >
                                    <CheckCircle size={40} />
                                </motion.div>
                                <span>Item Added to Cart Successfully!</span>
                            </div>

                            {/* Product Info */}
                            <div className="atc-product">
                                {(Array.isArray(addedToCart.images) && addedToCart.images.length > 0) ? (
                                    <img
                                        src={addedToCart.images[0]}
                                        alt={addedToCart.name}
                                        className="atc-product-img"
                                    />
                                ) : addedToCart.image_base64 ? (
                                    <img
                                        src={addedToCart.image_base64}
                                        alt={addedToCart.name}
                                        className="atc-product-img"
                                    />
                                ) : (
                                    <div className="atc-product-img atc-no-img">
                                        <ShoppingCart size={32} className="text-muted" />
                                    </div>
                                )}
                                <div className="atc-product-details">
                                    <span className="badge" style={{ marginBottom: '4px', display: 'inline-block' }}>{addedToCart.category}</span>
                                    <h3 className="atc-product-name">{addedToCart.name}</h3>
                                    {addedToCart.combination && (
                                        <p className="atc-combination text-muted">{addedToCart.combination}</p>
                                    )}
                                    <p className="atc-price">
                                        ₹{Number(addedToCart.price).toFixed(2)}
                                        {addedToCart.discount > 0 && (
                                            <span className="atc-discount">-{addedToCart.discount}% OFF</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="atc-actions">
                                <button
                                    className="btn btn-outline"
                                    onClick={() => setAddedToCart(null)}
                                >
                                    Continue Shopping
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => { setAddedToCart(null); setIsCartOpen(true); }}
                                >
                                    <ShoppingCart size={18} />
                                    View Cart ({totalItems})
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Medicine Detail Modal */}
            <AnimatePresence>
                {selectedMedicine && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedMedicine(null)}
                    >
                        <motion.div
                            className="med-detail-modal glass-panel"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className="atc-close-btn" onClick={() => setSelectedMedicine(null)}>
                                <X size={20} />
                            </button>

                            <div className="detail-grid">
                                <div className="detail-image-sec">
                                    {(Array.isArray(selectedMedicine.images) && selectedMedicine.images.length > 0) ? (
                                        <div className="modal-gallery-layout">
                                            <div className="modal-main-image-wrapper">
                                                <img src={selectedMedicine.images[activeModalImageIndex]} alt={selectedMedicine.name} className="detail-main-img" />
                                            </div>
                                            {selectedMedicine.images.length > 1 && (
                                                <div className="modal-thumbnails-wrapper">
                                                    {selectedMedicine.images.map((img, idx) => (
                                                        <button
                                                            key={idx}
                                                            className={`modal-thumbnail-btn ${activeModalImageIndex === idx ? 'active' : ''}`}
                                                            onClick={(e) => { e.stopPropagation(); setActiveModalImageIndex(idx); }}
                                                        >
                                                            <img src={img} alt={`${selectedMedicine.name} thumb ${idx}`} />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : selectedMedicine.image_base64 ? (
                                        <img src={selectedMedicine.image_base64} alt={selectedMedicine.name} className="detail-main-img" />
                                    ) : (
                                        <div className="detail-no-img">
                                            <Pill size={64} className="text-muted" />
                                        </div>
                                    )}
                                </div>

                                <div className="detail-info-sec">
                                    <div className="detail-header">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <span className="badge">{selectedMedicine.category}</span>
                                            {selectedMedicine.discount > 0 && (
                                                <span className="atc-discount" style={{ fontSize: '0.85rem' }}>{selectedMedicine.discount}% OFF</span>
                                            )}
                                        </div>
                                        <h2 className="detail-title">{selectedMedicine.name}</h2>
                                        {selectedMedicine.combination && (
                                            <p className="detail-combination text-muted">{selectedMedicine.combination}</p>
                                        )}
                                    </div>

                                    <div className="detail-price-row">
                                        <div className="price-item">
                                            <span className="detail-price">₹{Number(selectedMedicine.price).toFixed(2)}</span>
                                            {selectedMedicine.discount > 0 && (
                                                <span className="mrp-strikethrough">MRP <del>₹{(selectedMedicine.price / (1 - selectedMedicine.discount / 100)).toFixed(2)}</del></span>
                                            )}
                                        </div>
                                        <div className="rating-badge">
                                            <Activity size={14} /> 4.9 (34.0k)
                                        </div>
                                    </div>

                                    <div className="detail-body">
                                        <div className="section-divider"></div>
                                        <h4>Product Details</h4>
                                        <p className="product-modal-desc">{selectedMedicine.description || 'Highly effective healthcare product sourced from authorized distributors and stored in climate-controlled environments.'}</p>

                                        <div className="detail-highlights">
                                            <div className="highlight-item">
                                                <Shield size={18} className="text-primary" />
                                                <span>100% Genuine</span>
                                            </div>
                                            <div className="highlight-item">
                                                <Thermometer size={18} className="text-primary" />
                                                <span>Cold-Chain Maintained</span>
                                            </div>
                                            <div className="highlight-item">
                                                <AlertCircle size={18} className="text-primary" />
                                                <span>Doctor Consult Advised</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="detail-actions-footer">
                                        {selectedMedicine.inStock ? (
                                            (() => {
                                                const cartItem = cart.find(item => item.id === selectedMedicine.id);
                                                const quantity = cartItem ? cartItem.quantity : 0;

                                                return quantity > 0 ? (
                                                    <div className="detail-qty-row">
                                                        <div className="qty-control-large">
                                                            <button className="qty-btn-lg" onClick={() => removeFromCart(selectedMedicine.id)}>
                                                                <Minus size={20} />
                                                            </button>
                                                            <span className="qty-val-lg">{quantity} in Cart</span>
                                                            <button className="qty-btn-lg" onClick={() => addToCart(selectedMedicine)}>
                                                                <Plus size={20} />
                                                            </button>
                                                        </div>
                                                        <button
                                                            className="btn btn-primary"
                                                            style={{ flex: 1 }}
                                                            onClick={() => { setSelectedMedicine(null); setIsCartOpen(true); }}
                                                        >
                                                            Checkout
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="btn btn-primary btn-lg btn-block"
                                                        onClick={() => {
                                                            addToCart(selectedMedicine);
                                                            playCartSound('add');
                                                            // Optional: don't close so they can see the qty change
                                                            // setSelectedMedicine(null);
                                                        }}
                                                    >
                                                        <ShoppingCart size={20} /> Add to Cart
                                                    </button>
                                                );
                                            })()
                                        ) : (
                                            <button className="btn btn-block btn-lg" disabled style={{ background: '#f1f5f9', color: '#94a3b8' }}>
                                                Out of Stock
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Medicines;

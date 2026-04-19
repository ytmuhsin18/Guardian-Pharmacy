import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, ShoppingCart, Plus, Minus, X, CheckCircle,
    Activity, Heart, Thermometer, Shield, AlertCircle, Pill,
    Baby, User, Zap, Sparkles, ShieldPlus, Smile, Accessibility, Home as HomeIcon, ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Medicines.css'; // Reuse existing styles
import surgicalBanner from '../assets/surgical-products.png';
import painReliefIcon from '../assets/physiotherapy.png';
import emptyCartImg from '../assets/empty-cart-3d.png';
import dentalCareIcon from '../assets/dental-care.png';
import dermaCareIcon from '../assets/derma-care.png';
import quitSmokingIcon from '../assets/quit-smoking.png';
import homeDevicesIcon from '../assets/home-devices.png';
import motherCareIcon from '../assets/mother-care.png';
import allCategoriesIcon from '../assets/all-categories.png';
import medicinesIcon from '../assets/medicines-3d.png';
import babyCareIcon from '../assets/baby-care-3d.png';
import orthoIcon from '../assets/surgical-3d.png';
import adultCareIcon from '../assets/adult-care-new.png';
import sexualWellnessIcon from '../assets/sexual-wellness-v2.jpg';

const CAT_TABS = [
    { id: 'all', label: 'All', image: allCategoriesIcon, dbCats: [] },
    { id: 'medicines', label: 'Medicines', image: medicinesIcon, dbCats: ['Fever & Pain', 'Antibiotics', 'Allergy', 'Supplements', 'Digestion', 'Pharmacy', 'Vitamins', 'Ayurvedic'] },
    { id: 'baby', label: 'Baby Care', image: babyCareIcon, dbCats: ['Baby Care'] },
    { id: 'skin', label: 'Derma care', image: dermaCareIcon, dbCats: ['Skin Care', 'Derma care'] },
    { id: 'pain', label: 'Pain Relief', image: painReliefIcon, dbCats: ['Pain Relief'] },
    { id: 'surgical', label: 'Ortho & Surgical', image: orthoIcon, dbCats: ['Surgical Products', 'Ortho'] },
    { id: 'adult', label: 'Adult Care', image: adultCareIcon, dbCats: ['Adult Care', 'Personal Care'] },
    { id: 'sexual', label: 'Sexual Wellness', image: sexualWellnessIcon, dbCats: ['Sexual Wellness'] },
    { id: 'mother', label: 'Mother Care', image: motherCareIcon, dbCats: ['Maternity Care'] },
    { id: 'teeth', label: 'Dental care', image: dentalCareIcon, dbCats: ['Teeth Care', 'Dental care'] },
    { id: 'smoking', label: 'Quit smoking', image: quitSmokingIcon, dbCats: ['Smoking Cessation'] },
    { id: 'home', label: 'Home & Devices', image: homeDevicesIcon, dbCats: ['Home Care', 'Healthcare Devices'] },
];

function SurgicalProducts() {
    const navigate = useNavigate();
    const { medicines, cart, addToCart, removeFromCart, clearCart, addOrder } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [addedToCart, setAddedToCart] = useState(null);
    const [showCheckoutForm, setShowCheckoutForm] = useState(false);
    const [customerDetails, setCustomerDetails] = useState({
        name: '', phone: '', whatsapp: '', address: '', pincode: '', email: ''
    });

    const filteredMedicines = medicines.filter(med => {
        const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (med.combination && med.combination.toLowerCase().includes(searchTerm.toLowerCase()));

        if (activeTab === 'all') return matchesSearch;

        const currentTabConfig = CAT_TABS.find(t => t.id === activeTab);
        const matchesCategory = currentTabConfig.dbCats.includes(med.category);

        return matchesCategory && matchesSearch;
    });

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    const handleCheckout = async (e) => {
        e.preventDefault();
        setIsCheckingOut(true);
        const success = await addOrder({
            ...customerDetails,
            items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
            total_amount: cartTotal
        });
        setIsCheckingOut(false);
        if (success) {
            clearCart();
            setOrderComplete(true);
            setTimeout(() => setOrderComplete(false), 3000);
            setIsCartOpen(false);
        }
    };

    return (
        <div className="medicines-page">
            <section className="med-header section-padding" style={{ background: '#f8fafc', paddingBottom: '1rem' }}>
                <div className="container">
                    <div className="med-header-flex">
                        <div className="header-info-group">
                            <img src={surgicalBanner} alt="Categories" className="header-banner-img" />
                            <div>
                                <h1 className="title">Store <span className="gradient-text">Categories</span></h1>
                                <p className="subtitle">Quality healthcare products across all essential categories.</p>
                            </div>
                        </div>

                        <div className="search-bar-container">
                            <div className="search-input-wrapper">
                                <Search className="search-icon text-muted" size={20} />
                                <input
                                    type="text"
                                    className="input-field search-input"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
                                <ShoppingCart size={24} className="text-primary" />
                                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                            </button>
                        </div>
                    </div>

                    {/* Horizontal Categories Bar */}
                    <div className="category-tabs-container" style={{ marginTop: '2.5rem', overflowX: 'auto', paddingBottom: '10px', display: 'flex', gap: '20px', scrollbarWidth: 'none' }}>
                        {CAT_TABS.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        minWidth: '85px',
                                        flexShrink: 0,
                                        transform: isActive ? 'scale(1.05)' : 'scale(1)'
                                    }}
                                >
                                    <div style={{
                                        width: '74px',
                                        height: '74px',
                                        borderRadius: '50%',
                                        background: isActive ? 'var(--primary-light, #e0f2fe)' : '#f8fafc',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '0',
                                        border: isActive ? '2.5px solid var(--primary)' : '1px solid #e2e8f0',
                                        boxShadow: isActive ? '0 8px 20px rgba(2, 132, 199, 0.2)' : '0 2px 4px rgba(0,0,0,0.02)',
                                        transition: 'all 0.3s ease',
                                        overflow: 'hidden'
                                    }}>
                                        <img
                                            src={tab.image}
                                            alt={tab.label}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                filter: isActive ? 'none' : 'grayscale(0.2)'
                                            }}
                                        />
                                    </div>
                                    <span style={{
                                        fontSize: '0.82rem',
                                        fontWeight: isActive ? 800 : 600,
                                        color: isActive ? 'var(--primary)' : '#475569',
                                        whiteSpace: 'nowrap',
                                        textAlign: 'center'
                                    }}>
                                        {tab.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="med-products">
                <div className="container">
                    {filteredMedicines.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon"><AlertCircle size={48} className="text-muted" /></div>
                            <h3>No products found in this category</h3>
                            <p>We are currently updating our inventory. Please check back soon.</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', color: '#64748b' }}>
                                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{CAT_TABS.find(t => t.id === activeTab).label}</span>
                                <ChevronRight size={14} />
                                <span style={{ fontSize: '0.9rem' }}>Showing {filteredMedicines.length} items</span>
                            </div>
                            <div className="products-grid">
                                <AnimatePresence>
                                    {filteredMedicines.map((medicine) => (
                                        <motion.div
                                            key={medicine.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="product-card"
                                            onClick={() => navigate(`/medicine/${medicine.id}`)}
                                        >
                                            <div className="product-image-section">
                                                <div className="product-image-container">
                                                    {(Array.isArray(medicine.images) && medicine.images.length > 0) ? (
                                                        <img src={medicine.images[0]} alt={medicine.name} className="product-img" />
                                                    ) : medicine.image_base64 ? (
                                                        <img src={medicine.image_base64} alt={medicine.name} className="product-img" />
                                                    ) : (
                                                        <div className="product-placeholder"><Pill size={40} className="text-muted" /></div>
                                                    )}
                                                </div>
                                                {medicine.inStock ? (
                                                    <button className="add-btn" onClick={(e) => { e.stopPropagation(); addToCart(medicine); setAddedToCart(medicine); }}>
                                                        <Plus size={20} strokeWidth={3} />
                                                    </button>
                                                ) : (
                                                    <div className="out-of-stock-label">Out of Stock</div>
                                                )}
                                            </div>

                                            <div className="product-info-section">
                                                <div className="product-price-row">
                                                    <span className="price-pill">₹{Number(medicine.price).toFixed(0)}</span>
                                                </div>
                                                <h3 className="product-name-new">{medicine.name}</h3>
                                                <div className="product-tag-pill">{medicine.category}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </>
                    )}
                </div>
            </section>

            <AnimatePresence>
                {isCartOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="cart-overlay" onClick={() => setIsCartOpen(false)}>
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="cart-drawer" onClick={e => e.stopPropagation()}>
                            <div className="cart-header">
                                <h2>Your Cart ({totalItems})</h2>
                                <button className="close-btn" onClick={() => setIsCartOpen(false)}><X size={24} /></button>
                            </div>
                            <div className="cart-items">
                                {cart.length === 0 ? (
                                    <motion.div className="empty-cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '2rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                                            <img src={emptyCartImg} alt="Empty Cart" style={{ width: '180px', height: '180px', objectFit: 'contain' }} />
                                        </div>
                                    </motion.div>
                                ) : (
                                    cart.map(item => (
                                        <div key={`${item.id}-${item.selectedSize}`} className="cart-item">
                                            <div>
                                                <h4>{item.name}</h4>
                                                {item.selectedSize && <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Size: {item.selectedSize}</span>}
                                                <p>₹{item.price}</p>
                                            </div>
                                            <div className="item-actions">
                                                <button className="qty-btn" onClick={() => removeFromCart(item.id, item.selectedSize)}><Minus size={16} /></button>
                                                <span className="quantity">{item.quantity}</span>
                                                <button className="qty-btn qty-btn-plus" onClick={() => addToCart(item, item.selectedSize)}><Plus size={16} /></button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            {cart.length > 0 && (
                                <div className="cart-footer">
                                    <div className="cart-summary"><span>Total:</span><span>₹{cartTotal.toFixed(2)}</span></div>
                                    <button className="btn btn-primary btn-block" onClick={() => setShowCheckoutForm(true)}>Checkout</button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
        </div>
    );
}

export default SurgicalProducts;

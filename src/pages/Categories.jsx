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
import painReliefIcon from '../assets/pain-relief-model.png';
import emptyCartImg from '../assets/empty-cart-3d.png';

const CAT_TABS = [
    { id: 'all', label: 'All', image: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png', dbCats: [] },
    { id: 'medicines', label: 'Medicines', image: 'https://cdn-icons-png.flaticon.com/512/4320/4320337.png', dbCats: ['Fever & Pain', 'Antibiotics', 'Allergy', 'Supplements', 'Digestion', 'Pharmacy', 'Vitamins', 'Ayurvedic'] },
    { id: 'baby', label: 'Baby Care', image: 'https://cdn-icons-png.flaticon.com/512/2717/2717387.png', dbCats: ['Baby Care'] },
    { id: 'skin', label: 'Skin & Hair', image: 'https://cdn-icons-png.flaticon.com/512/4392/4392451.png', dbCats: ['Skin Care'] },
    { id: 'pain', label: 'Pain Relief', image: painReliefIcon, dbCats: ['Pain Relief'] },
    { id: 'surgical', label: 'Ortho & Surgical', image: 'https://cdn-icons-png.flaticon.com/512/10189/10189173.png', dbCats: ['Surgical Products'] },
    { id: 'adult', label: 'Adult Care', image: 'https://cdn-icons-png.flaticon.com/512/3028/3028514.png', dbCats: ['Sexual Wellness', 'Personal Care'] },
    { id: 'mother', label: 'Mother Care', image: 'https://cdn-icons-png.flaticon.com/512/3663/3663363.png', dbCats: ['Maternity Care'] },
    { id: 'teeth', label: 'Teeth Care', image: 'https://cdn-icons-png.flaticon.com/512/3461/3461654.png', dbCats: ['Teeth Care'] },
    { id: 'home', label: 'Home & Devices', image: 'https://cdn-icons-png.flaticon.com/512/3004/3004458.png', dbCats: ['Home Care', 'Healthcare Devices'] },
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
                                        padding: '12px',
                                        border: isActive ? '2.5px solid var(--primary)' : '1px solid #e2e8f0',
                                        boxShadow: isActive ? '0 8px 20px rgba(2, 132, 199, 0.2)' : '0 2px 4px rgba(0,0,0,0.02)',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        {tab.id === 'skin' ? (
                                            <div style={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: 'linear-gradient(45deg, #ec4899, #3b82f6)',
                                                WebkitMaskImage: 'url("https://cdn-icons-png.flaticon.com/512/833/833472.png")',
                                                WebkitMaskSize: 'contain',
                                                WebkitMaskRepeat: 'no-repeat',
                                                WebkitMaskPosition: 'center',
                                                maskImage: 'url("https://cdn-icons-png.flaticon.com/512/833/833472.png")',
                                                maskSize: 'contain',
                                                maskRepeat: 'no-repeat',
                                                maskPosition: 'center'
                                            }} />
                                        ) : (
                                            <img
                                                src={tab.image}
                                                alt={tab.label}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    filter: isActive ? 'none' : 'grayscale(0.2)'
                                                }}
                                            />
                                        )}
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
                                        <div key={item.id} className="cart-item">
                                            <div><h4>{item.name}</h4><p>₹{item.price}</p></div>
                                            <div className="item-actions">
                                                <button className="qty-btn" onClick={() => removeFromCart(item.id)}><Minus size={16} /></button>
                                                <span className="quantity">{item.quantity}</span>
                                                <button className="qty-btn qty-btn-plus" onClick={() => addToCart(item)}><Plus size={16} /></button>
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

            {orderComplete && (
                <div className="toast success-toast floating-toast">
                    <CheckCircle size={20} />
                    <span>Order placed successfully!</span>
                </div>
            )}
        </div>
    );
}

export default SurgicalProducts;

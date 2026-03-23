import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Plus, Minus, X, CheckCircle, Heart, Thermometer, Shield, AlertCircle, Pill, Hand } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Medicines.css'; // Reuse existing styles
import physioBanner from '../assets/physiotherapy.png';

function Physiotherapy() {
    const navigate = useNavigate();
    const { medicines, cart, addToCart, removeFromCart, clearCart, addOrder } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [totalItems, setTotalItems] = useState(0);

    // Filter medicines by category "Physiotherapy"
    const filteredMedicines = medicines.filter(med => {
        const isPhysio = med.category === 'Physiotherapy';
        const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (med.combination && med.combination.toLowerCase().includes(searchTerm.toLowerCase()));
        return isPhysio && matchesSearch;
    });

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <motion.div 
            className="medicines-page"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <section className="med-header section-padding" style={{ background: '#f0fdfa' }}>
                <div className="container">
                    <motion.div 
                        className="med-header-flex"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <div className="header-info-group">
                            <img src={physioBanner} alt="Physiotherapy" className="header-banner-img" />
                            <div>
                                <h1 className="title">Physiotherapy <span className="gradient-text">Studio</span></h1>
                                <p className="subtitle">Premium equipment and tools for physiotherapy and recovery at home.</p>
                            </div>
                        </div>

                            <div className="search-bar-container">
                                <div className="search-input-wrapper">
                                    <Search className="search-icon text-muted" size={20} />
                                    <input
                                        type="text"
                                        className="input-field search-input"
                                        placeholder="Search physiotherapy products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
                                    <ShoppingCart size={24} className="text-primary" />
                                    {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                                </button>
                            </div>
                    </motion.div>

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
                                    <motion.div
                                        key={medicine.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="product-card"
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
                                                <button className="add-btn" onClick={() => { addToCart(medicine); }}>
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
                    )}
                </div>
            </section>
        </motion.div>
    );
}

export default Physiotherapy;

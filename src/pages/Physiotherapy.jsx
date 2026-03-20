import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Plus, Minus, X, CheckCircle, Activity, Heart, Thermometer, Shield, AlertCircle, Pill } from 'lucide-react';
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
        <div className="medicines-page">
            <section className="med-header section-padding" style={{ background: '#f0fdfa' }}>
                <div className="container">
                    <div className="med-header-flex">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <img src={physioBanner} alt="Physiotherapy" style={{ width: '120px', height: '120px', borderRadius: '20px', objectFit: 'cover', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
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
                    </div>
                </div>
            </section>

            <section className="med-products">
                <div className="container">
                    {filteredMedicines.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon"><Activity size={48} className="text-muted" /></div>
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
        </div>
    );
}

export default Physiotherapy;

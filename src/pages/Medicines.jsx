import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Plus, Minus, X, CheckCircle, Activity, Heart, Thermometer, Shield, AlertCircle, Pill, Phone, Receipt, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Medicines.css';

import ProductCard from '../components/medicines/ProductCard';
import SearchInput from '../components/medicines/SearchInput';

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

function Medicines() {
    const navigate = useNavigate();
    const { medicines, cart, addToCart, removeFromCart, setIsCartOpen, loading } = useApp();
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddToCartItem = React.useCallback((item) => {
        addToCart(item);
        // setIsCartOpen(true); Removed auto-open per user request
        playCartSound('add');
    }, [addToCart]);

    const handleRemoveFromCartItem = React.useCallback((id) => {
        removeFromCart(id);
        playCartSound('remove');
    }, [removeFromCart]);

    const filteredMedicines = React.useMemo(() => {
        return medicines.filter(med => {
            const name = med.name || '';
            const category = med.category || '';
            return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                category.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [medicines, searchTerm]);

    return (
        <div className="medicines-page">
            {/* Header and Search */}
            <section className="med-header section-padding">
                <div className="container">
                    <div className="med-header-flex">
                        <div>
                            <h1 className="title">Pharmacy <span className="gradient-text">Store</span></h1>
                        </div>

                        <div className="search-bar-container">
                            <motion.div
                                className="search-input-wrapper"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileFocus={{ scale: 1.08, y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                style={{ position: 'relative', flexGrow: 1 }}
                            >
                                <Search
                                    className="search-icon text-muted"
                                    size={20}
                                />
                                <SearchInput
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    placeholders={[
                                        "Search Paracetamol...", "Search Baby Care...", "Search Pampers...",
                                        "Search Adult Diapers...", "Search Horlicks...", "Search Diabetes Care...",
                                        "Search First Aid...", "Search Skin Care...", "Search for medicines..."
                                    ]}
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        style={{
                                            position: 'absolute', right: '1rem', top: '50%',
                                            transform: 'translateY(-50%)', background: 'none',
                                            border: 'none', color: '#64748b', cursor: 'pointer',
                                            zIndex: 20, display: 'flex', alignItems: 'center'
                                        }}
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </motion.div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {!searchTerm && (
                            <motion.div
                                className="quick-action-banners"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{
                                    marginTop: '2.5rem',
                                    display: 'flex',
                                    gap: '1rem',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                    overflow: 'hidden'
                                }}
                            >
                                <motion.a
                                    href="tel:9487469098"
                                    className="action-banner-item"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <motion.div
                                        className="action-icon-wrapper call-icon"
                                        animate={{
                                            boxShadow: ['0 0 0 0 rgba(14, 165, 233, 0.4)', '0 0 0 10px rgba(14, 165, 233, 0)'],
                                            scale: [1, 1.05, 1]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <Phone className="action-icon" size={24} />
                                    </motion.div>
                                    <div className="action-text-wrapper">
                                        <h3>Order on Call</h3>
                                        <p>94874 69098</p>
                                    </div>
                                </motion.a>

                                <motion.a
                                    href="https://wa.me/919487469098?text=Hello,%20I%20would%20like%20to%20upload%20my%20prescription%20to%20order%20medicines."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="action-banner-item"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <motion.div
                                        className="action-icon-wrapper wa-icon"
                                        animate={{
                                            boxShadow: ['0 0 0 0 rgba(236, 72, 153, 0.4)', '0 0 0 10px rgba(236, 72, 153, 0)'],
                                            scale: [1, 1.05, 1]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                    >
                                        <Receipt className="action-icon" size={24} />
                                    </motion.div>
                                    <div className="action-text-wrapper">
                                        <h3>Upload Prescription</h3>
                                        <p>Send on WhatsApp</p>
                                    </div>
                                </motion.a>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Products Grid */}
            <section className="med-products" id="products-listing-start">
                <div className="container">
                    {loading && medicines.length === 0 ? (
                        <div className="text-center py-8">Loading Medicines...</div>
                    ) : medicines.length === 0 ? (
                        <div className="text-center py-8">No medicines available in the store.</div>
                    ) : (
                        <motion.div
                            className="products-grid"
                            layout
                        >
                            <AnimatePresence>
                                {filteredMedicines.map((medicine) => (
                                    <ProductCard
                                        key={medicine.id}
                                        medicine={medicine}
                                        cart={cart}
                                        onAddToCart={handleAddToCartItem}
                                        onRemoveFromCart={handleRemoveFromCartItem}
                                    />
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


        </div>
    );
}

export default Medicines;

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
import surgicalBanner from '../assets/categories-banner.png';
import painReliefIcon from '../assets/pain-relief-model.png';
import dentalCareIcon from '../assets/dental-care.png';
import dermaCareIcon from '../assets/derma-care.png';
import quitSmokingIcon from '../assets/quit-smoking.png';
import homeDevicesIcon from '../assets/home-devices.png';
import motherCareIcon from '../assets/mother-care.png';
import adultCareIcon from '../assets/adult-care-new.png';
import sexualWellnessIcon from '../assets/sexual-wellness-v2.jpg';
import allCategoriesIcon from '../assets/all-categories.png';
import medicinesIcon from '../assets/medicines-3d.png';
import babyCareIcon from '../assets/baby-care-3d.png';
import orthoIcon from '../assets/surgical-3d.png';

// Import modular components for consistency
import ProductCard from '../components/medicines/ProductCard';
import FloatingCartBar from '../components/FloatingCartBar';
import CartDrawer from '../components/medicines/CartDrawer';
import SearchInput from '../components/medicines/SearchInput';

const CAT_TABS = [
    { id: 'all', label: 'All', image: allCategoriesIcon, dbCats: [] },
    { id: 'medicines', label: 'Medicines', image: medicinesIcon, dbCats: ['Fever & Pain', 'Antibiotics', 'Allergy', 'Supplements', 'Digestion', 'Pharmacy', 'Vitamins', 'Ayurvedic'] },
    { id: 'baby', label: 'Baby Care', image: babyCareIcon, dbCats: ['Baby Care'] },
    { id: 'skin', label: 'Derma Care', image: dermaCareIcon, dbCats: ['Skin Care', 'Derma care'] },
    { id: 'pain', label: 'Pain Relief', image: painReliefIcon, dbCats: ['Pain Relief'] },
    { id: 'surgical', label: 'Ortho & Surgical', image: orthoIcon, dbCats: ['Surgical Products', 'Ortho'] },
    { id: 'mother', label: 'Mother Care', image: motherCareIcon, dbCats: ['Maternity Care', 'Mother Care', 'Maternal Health', 'Maternity'] },
    { id: 'teeth', label: 'Dental Care', image: dentalCareIcon, dbCats: ['Teeth Care', 'Dental care'] },
    { id: 'smoking', label: 'Quit Smoking', image: quitSmokingIcon, dbCats: ['Smoking Cessation'] },
    { id: 'adult', label: 'Adult Care', image: adultCareIcon, dbCats: ['Adult Care', 'Personal Care'] },
    { id: 'sexual', label: 'Sexual Wellness', image: sexualWellnessIcon, dbCats: ['Sexual Wellness'] },
    { id: 'home', label: 'Home & Devices', image: homeDevicesIcon, dbCats: ['Home Care', 'Healthcare Devices'] },
];

function SurgicalProducts() {
    const navigate = useNavigate();
    const { medicines, cart, addToCart, removeFromCart, setIsCartOpen } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [orderComplete, setOrderComplete] = useState(false);
    const [addedToCart, setAddedToCart] = useState(null);

    const filteredMedicines = medicines.filter(med => {
        const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (med.combination && med.combination.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (med.category && med.category.toLowerCase().includes(searchTerm.toLowerCase()));

        // If there's a search term, show results globally across all categories
        if (searchTerm.trim().length > 0) {
            return matchesSearch;
        }

        // If no search term, use category filtering
        if (activeTab === 'all') return true;

        const currentTabConfig = CAT_TABS.find(t => t.id === activeTab);
        return currentTabConfig.dbCats.includes(med.category);
    });

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);



    return (
        <div className="medicines-page">
            <section className="med-header section-padding" style={{ background: '#f8fafc', paddingBottom: '1rem' }}>
                <div className="container">
                    <div className="med-header-flex">
                        <div className="header-info-group">
                            <div>
                                <h1 className="title"><span className="gradient-text">Categories</span></h1>
                                <p className="subtitle">Quality healthcare products across all essential categories.</p>
                            </div>
                        </div>

                        <div className="search-bar-container">
                            <motion.div
                                className="search-input-wrapper"
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileFocus={{ scale: 1.02, y: -2, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                style={{ position: 'relative', flexGrow: 1 }}
                            >
                                <SearchInput
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    placeholders={[
                                        "Search for Categories...", "Search Wheelchairs...", "Search Walkers...",
                                        "Search for Surgical...", "Search Adult Diapers...", "Search Health Devices...",
                                        "Search Mother Care...", "Search Dental Care...", "Search personal care..."
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

                    {/* Horizontal Categories Bar */}
                    <div className="category-tabs-container" style={{ marginTop: '2.5rem', overflowX: 'auto', paddingBottom: '10px', display: 'flex', gap: '20px', scrollbarWidth: 'none' }}>
                        {CAT_TABS.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        if (tab.id === 'physio') navigate('/physiotherapy');
                                        else setActiveTab(tab.id);
                                    }}
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
                                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                    {searchTerm.trim() ? 'Search Results' : CAT_TABS.find(t => t.id === activeTab).label}
                                </span>
                                <ChevronRight size={14} />
                                <span style={{ fontSize: '0.9rem' }}>Showing {filteredMedicines.length} items</span>
                            </div>
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
                        </>
                    )}
                </div>
            </section>

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

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

// Import modular components for consistency
import ProductCard from '../components/medicines/ProductCard';
import FloatingCartBar from '../components/FloatingCartBar';
import CartDrawer from '../components/medicines/CartDrawer';
import SearchInput from '../components/medicines/SearchInput';

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

    const handleHandleCheckout = async (e) => {
        e.preventDefault();
        setIsCheckingOut(true);
        const orderData = {
            ...customerDetails,
            customer_name: customerDetails.name,
            items: cart,
            total_amount: cartTotal
        };

        const success = await addOrder(orderData);
        if (success) {
            setOrderComplete(true);
            setTimeout(() => {
                setOrderComplete(false);
                clearCart();
                setIsCartOpen(false);
                setShowCheckoutForm(false);
            }, 3000);
        }
        setIsCheckingOut(false);
    };

    const handleProceedToCheckout = () => {
        setShowCheckoutForm(true);
    };

    const handleBackClick = () => {
        setShowCheckoutForm(false);
    };

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
                                whileFocus={{ scale: 1.04, y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                style={{ position: 'relative', flexGrow: 1 }}
                            >
                                <Search className="search-icon text-muted" size={20} />
                                <SearchInput
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    placeholders={["Search Wheelchairs...", "Search Walkers...", "Search Syringes...", "Search Adult Diapers...", "Search Health Devices..."]}
                                />
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

            {/* Slide-over Cart */}
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => { setIsCartOpen(false); setShowCheckoutForm(false); }}
                cart={cart}
                totalItems={totalItems}
                cartTotal={cartTotal}
                onAdd={addToCart}
                onRemove={removeFromCart}
                onCheckout={handleProceedToCheckout}
                showCheckoutForm={showCheckoutForm}
                customerDetails={customerDetails}
                setCustomerDetails={setCustomerDetails}
                onHandleCheckout={handleHandleCheckout}
                isCheckingOut={isCheckingOut}
                onBack={handleBackClick}
            />

            {orderComplete && (
                <div className="toast success-toast floating-toast">
                    <CheckCircle size={20} />
                    <span>Order placed successfully!</span>
                </div>
            )}



            {/* Floating Cart Bar (for mobile parity) */}
            {!isCartOpen && <FloatingCartBar onOpenCart={() => setIsCartOpen(true)} />}
        </div>
    );
}

export default SurgicalProducts;

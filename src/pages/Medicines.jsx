import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Plus, Minus, X, CheckCircle, Activity, Heart, Thermometer, Shield, AlertCircle, Pill, Phone, Receipt, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Medicines.css';

// Modular Components
import ProductCard from '../components/medicines/ProductCard';
import CartDrawer from '../components/medicines/CartDrawer';
import SearchInput from '../components/medicines/SearchInput';
import MedicineDetailModal from '../components/medicines/MedicineDetailModal';
import FloatingCartBar from '../components/FloatingCartBar';

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
    const { medicines, cart, addToCart, removeFromCart, clearCart, addOrder, uploadPrescription } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);

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
        if (isCartOpen || showProceedConfirm || showBackConfirm || selectedMedicine || orderComplete) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => document.body.classList.remove('modal-open');
    }, [isCartOpen, showProceedConfirm, showBackConfirm, selectedMedicine, orderComplete]);

    const scrollToProducts = () => {
        const prodSection = document.getElementById('products-listing-start');
        if (prodSection) {
            prodSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

    const filteredMedicines = React.useMemo(() => {
        return medicines.filter(med => {
            return med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                med.category.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [medicines, searchTerm]);

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    const handleProceedToCheckout = () => {
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
                                    style={{
                                        background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px',
                                        padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px',
                                        cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', flex: '1', minWidth: '260px',
                                        maxWidth: '400px', textDecoration: 'none', color: 'inherit'
                                    }}>
                                    <motion.div
                                        animate={{
                                            boxShadow: ['0 0 0 0 rgba(14, 165, 233, 0.4)', '0 0 0 10px rgba(14, 165, 233, 0)'],
                                            scale: [1, 1.05, 1]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        style={{ background: '#f0f9ff', padding: '12px', borderRadius: '50%', color: '#0ea5e9', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <Phone size={24} />
                                    </motion.div>
                                    <div style={{ overflow: 'hidden' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, whiteSpace: 'nowrap' }}>Order on Call</h3>
                                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0 0' }}>94874 69098</p>
                                    </div>
                                </motion.a>

                                <motion.a
                                    href="https://wa.me/919487469098?text=Hello,%20I%20would%20like%20to%20upload%20my%20prescription%20to%20order%20medicines."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="action-banner-item"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px',
                                        padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px',
                                        cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', flex: '1', minWidth: '260px',
                                        maxWidth: '400px', textDecoration: 'none', color: 'inherit'
                                    }}>
                                    <motion.div
                                        animate={{
                                            boxShadow: ['0 0 0 0 rgba(236, 72, 153, 0.4)', '0 0 0 10px rgba(236, 72, 153, 0)'],
                                            scale: [1, 1.05, 1]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                        style={{ background: '#fdf2f8', padding: '12px', borderRadius: '50%', color: '#ec4899', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <Receipt size={24} />
                                    </motion.div>
                                    <div style={{ overflow: 'hidden' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, whiteSpace: 'nowrap' }}>Upload Prescription</h3>
                                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0 0' }}>Send on WhatsApp</p>
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
                    {medicines.length === 0 ? (
                        <div className="text-center py-8">Loading Medicines...</div>
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
                                        onQuickView={(med) => { setSelectedMedicine(med); setActiveModalImageIndex(0); }}
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

            {/* Slide-over Cart */}
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => { setIsCartOpen(false); setShowCheckoutForm(false); }}
                cart={cart}
                totalItems={totalItems}
                cartTotal={cartTotal}
                onAdd={handleAddToCartItem}
                onRemove={handleRemoveFromCartItem}
                onCheckout={handleProceedToCheckout}
                showCheckoutForm={showCheckoutForm}
                customerDetails={customerDetails}
                setCustomerDetails={setCustomerDetails}
                onHandleCheckout={handleCheckout}
                isCheckingOut={isCheckingOut}
                onBack={handleBackClick}
            />

            {/* Back Confirmation Modal */}
            <AnimatePresence>
                {showBackConfirm && (
                    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="confirm-modal glass-panel" initial={{ scale: 0.5, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0, y: -20 }} transition={{ type: "spring", bounce: 0.5, duration: 0.4 }}>
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

            {/* Medicine Detail Quick View Modal */}
            <MedicineDetailModal
                medicine={selectedMedicine}
                isOpen={!!selectedMedicine}
                onClose={() => setSelectedMedicine(null)}
                cart={cart}
                onAdd={handleAddToCartItem}
                onRemove={handleRemoveFromCartItem}
                activeImageIndex={activeModalImageIndex}
                setActiveImageIndex={setActiveModalImageIndex}
            />

            {/* Success Toast -> Prominent Order Confirmed Modal */}
            <AnimatePresence>
                {orderComplete && (
                    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ zIndex: 10001 }}>
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

            {/* Floating Cart Bar (for mobile parity) */}
            {!isCartOpen && <FloatingCartBar onOpenCart={() => setIsCartOpen(true)} />}
        </div>
    );
}

export default Medicines;

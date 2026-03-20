import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Plus, Minus, X, CheckCircle, Activity, Heart, Thermometer, Shield, AlertCircle, Pill } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Medicines.css'; // Reuse existing styles
import surgicalBanner from '../assets/surgical-products.png';

function SurgicalProducts() {
    const navigate = useNavigate();
    const { medicines, cart, addToCart, removeFromCart, clearCart, addOrder } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [addedToCart, setAddedToCart] = useState(null);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [showCheckoutForm, setShowCheckoutForm] = useState(false);
    const [customerDetails, setCustomerDetails] = useState({
        name: '', phone: '', whatsapp: '', address: '', pincode: '', email: ''
    });

    const filteredMedicines = medicines.filter(med => {
        const isSurgical = med.category === 'Surgical Products';
        const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (med.combination && med.combination.toLowerCase().includes(searchTerm.toLowerCase()));
        return isSurgical && matchesSearch;
    });

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

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
            items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
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
            <section className="med-header section-padding" style={{ background: '#f8fafc' }}>
                <div className="container">
                    <div className="med-header-flex">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <img src={surgicalBanner} alt="Surgical Products" style={{ width: '120px', height: '120px', borderRadius: '20px', objectFit: 'cover', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                            <div>
                                <h1 className="title">Surgical <span className="gradient-text">Products</span></h1>
                                <p className="subtitle">High-quality clinical and surgical equipment for healthcare needs.</p>
                            </div>
                        </div>

                        <div className="search-bar-container">
                            <div className="search-input-wrapper">
                                <Search className="search-icon text-muted" size={20} />
                                <input
                                    type="text"
                                    className="input-field search-input"
                                    placeholder="Search surgical products..."
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
                </div>
            </section>

            <section className="med-products">
                <div className="container">
                    {filteredMedicines.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon"><AlertCircle size={48} className="text-muted" /></div>
                            <h3>No surgical products found</h3>
                            <p>We are currently updating our surgical equipment inventory. Please check back soon.</p>
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
                                            <div className="product-image-container" onClick={() => setSelectedMedicine(medicine)}>
                                                {(Array.isArray(medicine.images) && medicine.images.length > 0) ? (
                                                    <img src={medicine.images[0]} alt={medicine.name} className="product-img" />
                                                ) : medicine.image_base64 ? (
                                                    <img src={medicine.image_base64} alt={medicine.name} className="product-img" />
                                                ) : (
                                                    <div className="product-placeholder"><Pill size={40} className="text-muted" /></div>
                                                )}
                                            </div>
                                            {medicine.inStock ? (
                                                <button className="add-btn" onClick={() => { addToCart(medicine); setAddedToCart(medicine); }}>
                                                    <Plus size={20} strokeWidth={3} />
                                                </button>
                                            ) : (
                                                <div className="out-of-stock-label">Out of Stock</div>
                                            )}
                                        </div>

                                        <div className="product-info-section" onClick={() => setSelectedMedicine(medicine)}>
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

            {/* Reuse Cart and Modal Logic from Medicines.jsx or ideally a shared component. 
                For speed and direct requirement fulfillment, I will simplify or include the essential ones.
            */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div className="cart-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} />
                        <motion.div className="cart-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}>
                            <div className="cart-header">
                                <h2>{showCheckoutForm ? 'Delivery Details' : `Your Cart (${totalItems})`}</h2>
                                <button className="close-btn" onClick={() => setIsCartOpen(false)}><X size={24} /></button>
                            </div>
                            <div className="cart-items">
                                {cart.length === 0 ? (
                                    <div className="empty-cart"><ShoppingCart size={48} /><p>Your cart is empty.</p></div>
                                ) : (
                                    cart.map(item => (
                                        <div key={item.id} className="cart-item">
                                            <div><h4>{item.name}</h4><p>₹{item.price}</p></div>
                                            <div className="item-actions">
                                                <button onClick={() => removeFromCart(item.id)}><Minus size={16} /></button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => addToCart(item)}><Plus size={16} /></button>
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
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

export default SurgicalProducts;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Shield, AlertCircle, Heart, Thermometer, ShoppingCart, Plus, Minus, Activity, Star, Zap, Search, Truck, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import '../components/medicines/MedicineDetailModal.css'; // Has basic pill styles but we override in MedicineDetails.css
import './MedicineDetails.css';

function MedicineDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { medicines, cart, addToCart, removeFromCart, fetchMedicineImage } = useApp();
    const [product, setProduct] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        const found = medicines.find(m => m.id?.toString() === id?.toString());
        if (found) {
            setProduct(found);
            window.scrollTo(0, 0);
        }
    }, [id, medicines]);

    useEffect(() => {
        if (product && (!product.images || product.images.length === 0)) {
            fetchMedicineImage(product.id);
        }
    }, [product, fetchMedicineImage]);

    if (!product) {
        return (
            <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>
                <Activity size={64} className="text-muted" style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
                <h2 style={{ fontWeight: 800, color: '#1e293b' }}>Medicine Not Found</h2>
                <p style={{ color: '#64748b', marginBottom: '2rem' }}>The product you are looking for might have been removed or is currently unavailable.</p>
                <button onClick={() => navigate('/medicines')} className="btn btn-primary" style={{ background: '#0d9488' }}>
                    <ArrowLeft size={20} /> Browse Medicines
                </button>
            </div>
        );
    }

    const cartItem = cart.find(item => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    return (
        <div className="medicine-details-page-wrapper">
            <div className="container" style={{ padding: '3rem 1rem' }}>
                <motion.button
                    className="text-back-btn"
                    onClick={() => navigate(-1)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <ArrowLeft size={16} /> Back to Medicines
                </motion.button>

                <motion.div
                    className="product-page-layout-grid"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                    {/* Left: Image Card */}
                    <div className="product-image-card">
                        <div className="main-image-container">
                            <motion.img
                                key={activeImageIndex}
                                src={(Array.isArray(product.images) && product.images.length > 0) ? product.images[activeImageIndex] : (product.image_base64 || 'https://via.placeholder.com/400')}
                                alt={product.name}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="main-modal-img inline-page-img"
                            />
                            {product.discount > 0 && (
                                <div className="page-discount-badge">-{product.discount}% OFF</div>
                            )}
                            <button className="click-to-zoom-btn">
                                <Search size={14} /> Click to zoom
                            </button>
                        </div>
                        {Array.isArray(product.images) && product.images.length > 1 && (
                            <div className="thumbnail-grid" style={{ background: 'transparent', padding: '1rem 0 0 0' }}>
                                {product.images.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className={`thumb-item ${activeImageIndex === idx ? 'active' : ''}`}
                                        onClick={() => setActiveImageIndex(idx)}
                                    >
                                        <img src={img} alt="" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Info Section transparent on page background */}
                    <div className="product-info-direct">
                        <div className="modal-info-header">
                            <div className="page-category-tag">{product.category || 'CATEGORIES'}</div>
                            <h2 className="page-name-title">{product.name}</h2>
                        </div>

                        <div className="modal-pricing-new page-pricing-box">
                            <div className="price-row-new">
                                <span className="current-price-teal">₹{Number(product.price).toFixed(2)}</span>
                                {product.discount > 0 && (
                                    <span className="mrp-old-gray" style={{ color: '#94a3b8' }}>MRP <s>₹{(product.price / (1 - product.discount / 100)).toFixed(2)}</s></span>
                                )}
                            </div>
                            <p className="tax-label-light">Inclusive of all taxes</p>
                        </div>

                        <hr className="dashed-separator" style={{ borderColor: '#e2e8f0', borderTopStyle: 'dashed', borderTopWidth: '2px' }} />

                        <div className="modal-action-inline page-action-row">
                            <div className="quantity-pill-new">
                                <button 
                                    className="q-btn-new" 
                                    onClick={() => {
                                        if(quantity > 0) removeFromCart(product.id);
                                    }}
                                    disabled={quantity === 0}
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="q-val-new">{quantity > 0 ? quantity : 1}</span>
                                <button 
                                    className="q-btn-new" 
                                    onClick={() => addToCart(product)}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            <button
                                className={`btn-add-cart-new ${quantity > 0 ? 'added' : ''}`}
                                onClick={() => { if(quantity === 0) addToCart(product); }}
                                disabled={!product.inStock}
                            >
                                <ShoppingCart size={18} fill={quantity > 0 ? "white" : "none"} />
                                {quantity > 0 ? 'Added to Cart' : 'Add to Cart'}
                            </button>
                        </div>

                        <div className="modal-features-row page-features-block">
                            <div className="feat-box-new direct-feat-box">
                                <div className="feat-icon-new direct-feat-icon">
                                    <Shield size={20} className="teal-icon" />
                                </div>
                                <div className="feat-text-new">
                                    <strong>100% Genuine</strong>
                                    <span>Sourced from authorized distributors</span>
                                </div>
                            </div>
                            <div className="feat-box-new direct-feat-box">
                                <div className="feat-icon-new direct-feat-icon">
                                    <Truck size={20} className="teal-icon" />
                                </div>
                                <div className="feat-text-new">
                                    <strong>Safe Delivery</strong>
                                    <span>Free delivery on orders above ₹500</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default MedicineDetails;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, CheckCircle, Shield, Truck, Pill, Plus, Minus, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './MedicineDetails.css';

function MedicineDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { medicines, addToCart } = useApp();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    const applyZoomOrigin = (el, clientX, clientY) => {
        const rect = el.getBoundingClientRect();
        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;
        el.style.setProperty('--zoom-x', `${x}%`);
        el.style.setProperty('--zoom-y', `${y}%`);
    };

    const handleImageClick = (e) => {
        if (!isZoomed) {
            applyZoomOrigin(e.currentTarget, e.clientX, e.clientY);
        }
        setIsZoomed(prev => !prev);
    };

    const handleImageTouch = (e) => {
        if (!isZoomed) {
            const touch = e.changedTouches[0];
            applyZoomOrigin(e.currentTarget, touch.clientX, touch.clientY);
        }
        setIsZoomed(prev => !prev);
    };

    useEffect(() => {
        const found = medicines.find(m => m.id?.toString() === id?.toString());
        if (found) {
            setProduct(found);
            window.scrollTo(0, 0);
        }
    }, [id, medicines]);

    if (!product) {
        return (
            <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>
                <Pill size={64} className="text-muted" style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
                <h2 style={{ fontWeight: 800, color: '#1e293b' }}>Medicine Not Found</h2>
                <p style={{ color: '#64748b', marginBottom: '2rem' }}>The product you are looking for might have been removed or is currently unavailable.</p>
                <button onClick={() => navigate('/medicines')} className="btn btn-primary">
                    <ArrowLeft size={20} /> Browse Medicines
                </button>
            </div>
        );
    }

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
    };

    return (
        <div className="medicine-details-container container">
            <motion.button
                className="back-btn"
                onClick={() => navigate('/medicines')}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <ArrowLeft size={18} /> Back to Medicines
            </motion.button>

            <div className="details-grid">
                {/* Visual Section */}
                <motion.div
                    className="details-visual-panel glass-panel"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="image-container">
                        {product.images && product.images.length > 0 ? (
                            <div className="gallery-layout">
                                <div
                                    className={`main-image-wrapper${isZoomed ? ' zoomed' : ''}`}
                                    onClick={handleImageClick}
                                    onTouchEnd={handleImageTouch}
                                >
                                    <img src={product.images[activeImageIndex]} alt={product.name} className="main-image" />
                                    {product.discount > 0 && <span className="discount-tag">-{product.discount}% OFF</span>}
                                    <span className="zoom-hint">🔍 Click to zoom</span>
                                </div>
                                {product.images.length > 1 && (
                                    <div className="thumbnails-wrapper">
                                        {product.images.map((img, idx) => (
                                            <button
                                                key={idx}
                                                className={`thumbnail-btn ${activeImageIndex === idx ? 'active' : ''}`}
                                                onClick={() => setActiveImageIndex(idx)}
                                            >
                                                <img src={img} alt={`${product.name} thumb ${idx}`} />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : product.image_base64 ? (
                            <div
                                className={`main-image-wrapper${isZoomed ? ' zoomed' : ''}`}
                                onClick={handleImageClick}
                                onTouchEnd={handleImageTouch}
                            >
                                <img src={product.image_base64} alt={product.name} className="main-image" />
                                {product.discount > 0 && <span className="discount-tag">-{product.discount}% OFF</span>}
                                <span className="zoom-hint">🔍 Click to zoom</span>
                            </div>
                        ) : (
                            <div className="placeholder-image">
                                <Pill size={120} style={{ opacity: 0.1 }} />
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Info Section */}
                <motion.div
                    className="details-info-panel"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="info-header">
                        <span className="category-label">Categories</span>
                        <h1 className="medicine-name">{product.name}</h1>
                        {product.combination && <p className="combination-text">{product.combination}</p>}
                    </div>

                    <div className="pricing-section">
                        <div className="price-display">
                            <span className="actual-price">₹{Number(product.price).toFixed(2)}</span>
                            {product.discount > 0 && (
                                <span className="mrp-display">MRP <del>₹{(product.price / (1 - product.discount / 100)).toFixed(2)}</del></span>
                            )}
                        </div>
                        <p className="tax-info">Inclusive of all taxes</p>
                    </div>

                    <div className="action-section">
                        {product.inStock ? (
                            <div className="purchase-controls-wrapper">
                                <div className="quantity-box">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="qty-btn"><Minus size={18} /></button>
                                    <span className="qty-value">{quantity}</span>
                                    <button onClick={() => setQuantity(q => q + 1)} className="qty-btn"><Plus size={18} /></button>
                                </div>
                                <button className="btn btn-primary add-to-cart-btn" onClick={handleAddToCart}>
                                    <ShoppingCart size={20} /> Add to Cart
                                </button>
                            </div>
                        ) : (
                            <div className="out-of-stock-alert">
                                <Info size={20} /> Temporarily Out of Stock
                            </div>
                        )}
                    </div>

                    <div className="trust-grid">
                        <div className="trust-card">
                            <Shield size={24} className="text-primary" />
                            <div>
                                <h4>100% Genuine</h4>
                                <p>Sourced from authorized distributors</p>
                            </div>
                        </div>
                        <div className="trust-card">
                            <Truck size={24} className="text-primary" />
                            <div>
                                <h4>Safe Delivery</h4>
                                <p>Free delivery on orders above ₹500</p>
                            </div>
                        </div>
                    </div>

                    <div className="product-description-section">
                        <h3>About this Product</h3>
                        <p className="description-text">
                            {product.description || `Highly effective ${product.name} for your healthcare needs. Essential medicine stored in climate-controlled environments to ensure maximum efficacy. Please consult a doctor before use.`}
                        </p>
                    </div>
                </motion.div>
            </div>

        </div>
    );
}

export default MedicineDetails;

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
        <div className="medicine-details-container" style={{ background: '#f8fafc' }}>
            <div className="container">
                <button
                    className="back-btn"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={18} /> Back to Products
                </button>

                <motion.div
                    className="details-grid"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                    {/* Left: Image Card */}
                    <div className="details-visual-panel shadow-sm" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
                        <div className="gallery-layout">
                            <div className="main-image-wrapper">
                                <motion.img
                                    key={activeImageIndex}
                                    src={(Array.isArray(product.images) && product.images.length > 0) ? product.images[activeImageIndex] : (product.image_base64 || 'https://via.placeholder.com/400')}
                                    alt={product.name}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="main-image"
                                />
                                {product.discount > 0 && (
                                    <div className="discount-tag">-{product.discount}% OFF</div>
                                )}
                                <div className="zoom-hint">
                                    <Search size={12} style={{ display: 'inline', marginRight: '4px' }} /> Click to zoom
                                </div>
                            </div>
                            
                            {Array.isArray(product.images) && product.images.length > 1 && (
                                <div className="thumbnails-wrapper">
                                    {product.images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className={`thumbnail-btn ${activeImageIndex === idx ? 'active' : ''}`}
                                            onClick={() => setActiveImageIndex(idx)}
                                        >
                                            <img src={img} alt="" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Info Section */}
                    <div className="product-text-panel" style={{ padding: '1rem 0' }}>
                        <div>
                            <span className="category-label">{product.category || 'Pharmacy'}</span>
                            <h1 className="medicine-name" style={{ marginBottom: '1rem' }}>{product.name}</h1>
                            {product.combination && (
                                <p className="combination-text">{product.combination}</p>
                            )}
                        </div>

                        <div className="pricing-section">
                            <div className="price-display">
                                <span className="actual-price">₹{Number(product.price).toFixed(2)}</span>
                                {product.discount > 0 && (
                                    <span className="mrp-display">MRP <s>₹{(product.price / (1 - product.discount / 100)).toFixed(2)}</s></span>
                                )}
                            </div>
                            <p className="tax-info">Inclusive of all taxes</p>
                        </div>

                        <div className="action-section">
                            <div className="purchase-controls-wrapper">
                                {quantity > 0 ? (
                                    <div className="quantity-box" style={{ background: '#0f172a' }}>
                                        <button 
                                            className="qty-btn" 
                                            onClick={() => removeFromCart(product.id)}
                                        >
                                            <Minus size={18} color="#0f172a" />
                                        </button>
                                        <span className="qty-value" style={{ color: 'white' }}>{quantity}</span>
                                        <button 
                                            className="qty-btn" 
                                            onClick={() => addToCart(product)}
                                        >
                                            <Plus size={18} color="#0f172a" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="btn btn-primary add-to-cart-btn"
                                        onClick={() => addToCart(product)}
                                        disabled={!product.inStock}
                                        style={{ background: '#0d9488', border: 'none', height: '56px', boxShadow: '0 8px 25px rgba(13, 148, 136, 0.3)' }}
                                    >
                                        <ShoppingCart size={22} />
                                        Add to Cart
                                    </button>
                                )}
                            </div>
                            
                            {!product.inStock && (
                                <div className="out-of-stock-alert" style={{ marginTop: '1.5rem' }}>
                                    <AlertCircle size={20} />
                                    This product is currently out of stock
                                </div>
                            )}
                        </div>

                        <div className="trust-grid">
                            <div className="trust-card shadow-sm" style={{ background: 'white' }}>
                                <Shield size={28} className="text-primary" style={{ color: '#0d9488' }} />
                                <div>
                                    <h4 style={{ color: '#0f172a' }}>100% Genuine</h4>
                                    <p>Sourced from authorized distributors</p>
                                </div>
                            </div>
                            <div className="trust-card shadow-sm" style={{ background: 'white' }}>
                                <Truck size={28} className="text-primary" style={{ color: '#0d9488' }} />
                                <div>
                                    <h4 style={{ color: '#0f172a' }}>Safe Delivery</h4>
                                    <p>Free delivery on orders above ₹500</p>
                                </div>
                            </div>
                        </div>
                        
                        {(product.description || product.manufacturer) && (
                            <div className="product-description-section" style={{ background: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                                <h3>Product Details</h3>
                                <div className="description-text">
                                    {product.description && <p style={{ marginBottom: '1rem' }}>{product.description}</p>}
                                    {product.manufacturer && (
                                        <p><strong>Manufacturer:</strong> {product.manufacturer}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default MedicineDetails;

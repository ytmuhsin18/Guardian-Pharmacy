import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Shield, AlertCircle, Heart, Thermometer, ShoppingCart, Plus, Minus } from 'lucide-react';

const MedicineDetailModal = ({ 
    medicine, isOpen, onClose, cart, onAdd, onRemove, 
    activeImageIndex, setActiveImageIndex 
}) => {
    if (!medicine) return null;
    
    const cartItem = cart.find(item => item.id === medicine.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    style={{ zIndex: 1000 }}
                >
                    <motion.div
                        className="med-detail-modal"
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 50 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button className="modal-close" onClick={onClose}>
                            <X size={24} />
                        </button>

                        <div className="modal-grid">
                            {/* Image Section */}
                            <div className="modal-image-gallery">
                                <div className="main-image-container">
                                    <motion.img
                                        key={activeImageIndex}
                                        src={(Array.isArray(medicine.images) && medicine.images.length > 0) ? medicine.images[activeImageIndex] : (medicine.image_base64 || 'https://via.placeholder.com/400')}
                                        alt={medicine.name}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="main-modal-img"
                                    />
                                    {medicine.discount > 0 && (
                                        <div className="discount-badge-large">{medicine.discount}% OFF</div>
                                    )}
                                </div>
                                {Array.isArray(medicine.images) && medicine.images.length > 1 && (
                                    <div className="thumbnail-grid">
                                        {medicine.images.map((img, idx) => (
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

                            {/* Info Section */}
                            <div className="modal-info-scroll">
                                <div className="modal-info-header">
                                    <div className="brand-tag">{medicine.manufacturer || 'Guardian Pharma'}</div>
                                    <h2 className="modal-name">{medicine.name}</h2>
                                    <div className="modal-meta-chips">
                                        <span className="chip"><Activity size={14} /> {medicine.combination || 'Active Component'}</span>
                                        <span className="chip"><Shield size={14} /> {medicine.category}</span>
                                    </div>
                                </div>

                                <div className="modal-pricing-section">
                                    <div className="price-row-main">
                                        <span className="current-price">₹{Number(medicine.price).toFixed(2)}</span>
                                        {medicine.discount > 0 && (
                                            <span className="mrp-old-large">MRP ₹{(medicine.price / (1 - medicine.discount / 100)).toFixed(2)}</span>
                                        )}
                                    </div>
                                    <p className="tax-label">Inclusive of all taxes</p>
                                </div>

                                <div className="modal-action-row">
                                    {quantity > 0 ? (
                                        <div className="quantity-control-large">
                                            <button className="q-btn" onClick={() => onRemove(medicine.id)}><Minus size={20} /></button>
                                            <span className="q-val font-bold text-xl px-6">{quantity}</span>
                                            <button className="q-btn" onClick={() => onAdd(medicine)}><Plus size={20} /></button>
                                        </div>
                                    ) : (
                                        <button
                                            className="btn btn-primary btn-lg add-to-cart-big"
                                            onClick={() => onAdd(medicine)}
                                            disabled={!medicine.inStock}
                                        >
                                            <ShoppingCart size={20} />
                                            {medicine.inStock ? 'Add to Cart' : 'Out of Stock'}
                                        </button>
                                    )}
                                </div>

                                <div className="modal-features-grid">
                                    <div className="feat-item">
                                        <div className="feat-icon"><CheckCircle size={18} /></div>
                                        <span>100% Genuine</span>
                                    </div>
                                    <div className="feat-item">
                                        <div className="feat-icon"><Heart size={18} /></div>
                                        <span>Safe & Secure</span>
                                    </div>
                                    <div className="feat-item">
                                        <div className="feat-icon"><Thermometer size={18} /></div>
                                        <span>Cold Chain Storage</span>
                                    </div>
                                </div>

                                <div className="modal-description-section">
                                    <h3>Product Highlights</h3>
                                    <ul className="highlight-list">
                                        <li>Premium quality pharmaceuticals</li>
                                        <li>Verified and tested combination</li>
                                        <li>Quick and safe delivery in 24-48 hours</li>
                                        <li>Manufacturer: {medicine.manufacturer || 'Guardian Pharma'}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default React.memo(MedicineDetailModal);

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Pill } from 'lucide-react';

const ProductCard = React.memo(({ medicine, cart, onAddToCart, onRemoveFromCart, onQuickView }) => {
    const cartItem = cart.find(item => item.id === medicine.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="product-card"
        >
            <div className="product-image-section">
                <div
                    className="product-image-container"
                    onClick={() => onQuickView(medicine)}
                >
                    {(Array.isArray(medicine.images) && medicine.images.length > 0) ? (
                        <img src={medicine.images[0]} alt={medicine.name} className="product-img" loading="lazy" />
                    ) : medicine.image_base64 ? (
                        <img src={medicine.image_base64} alt={medicine.name} className="product-img" loading="lazy" />
                    ) : (
                        <div className="product-placeholder">
                            <Pill size={40} className="text-muted" />
                        </div>
                    )}
                </div>

                {medicine.inStock ? (
                    quantity > 0 ? (
                        <div className="qty-selector-floating" onClick={e => e.stopPropagation()}>
                            <button className="qty-op-btn" onClick={() => onRemoveFromCart(medicine.id)}>
                                <Minus size={14} strokeWidth={3} />
                            </button>
                            <span className="qty-amount">{quantity}</span>
                            <button className="qty-op-btn" onClick={() => onAddToCart(medicine)}>
                                <Plus size={14} strokeWidth={3} />
                            </button>
                        </div>
                    ) : (
                        <button
                            className="add-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart(medicine);
                            }}
                        >
                            <Plus size={20} strokeWidth={3} />
                        </button>
                    )
                ) : (
                    <div className="out-of-stock-label">Out of Stock</div>
                )}
            </div>

            <div className="product-info-section" onClick={() => onQuickView(medicine)}>
                <div className="product-price-row">
                    <span className="price-pill">₹{Number(medicine.price).toFixed(0)}</span>
                    {medicine.discount > 0 && (
                        <span className="mrp-old">₹{(medicine.price / (1 - medicine.discount / 100)).toFixed(0)}</span>
                    )}
                </div>

                {medicine.discount > 0 && (
                    <div className="savings-label">₹{(medicine.price * medicine.discount / 100).toFixed(0)} OFF</div>
                )}

                <h3 className="product-name-new">{medicine.name}</h3>

                <div className="product-meta-new">
                    <span className="pack-size">1 pack ({medicine.combination?.split('+')[0] || '10 tabs'})</span>
                    <div className="product-tag-pill">{medicine.category}</div>
                </div>

                <div className="product-footer-new">
                    <div className="rating-row">
                        <div className="star-icon">★</div>
                        <span className="rating-val">4.8</span>
                        <span className="rating-count">(100+)</span>
                    </div>
                    <div className="no-fee">No Convenience Fee</div>
                </div>
            </div>
        </motion.div>
    );
});

export default ProductCard;

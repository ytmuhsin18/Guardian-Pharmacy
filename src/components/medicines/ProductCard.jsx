import React, { useEffect, useState, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Minus, Pill } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ProductCard = memo(({ medicine, cart, onAddToCart, onRemoveFromCart, onQuickView }) => {
    const navigate = useNavigate();
    const cartItem = cart.find(item => item.id === medicine.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const [isVisible, setIsVisible] = useState(false);
    const [localImage, setLocalImage] = useState(null);
    const cardRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (cardRef.current) observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    const resolvedImage = localImage || medicine.image_base64 || (medicine.images && medicine.images[0]) || null;

    useEffect(() => {
        if (isVisible && !resolvedImage) {
            const fetchLocalImage = async () => {
                try {
                    const { data, error } = await supabase
                        .from('medicines')
                        .select('image_base64')
                        .eq('id', medicine.id)
                        .single();

                    if (!error && data?.image_base64) {
                        let img = data.image_base64;
                        if (img.startsWith('[')) {
                            try { const parsed = JSON.parse(img); img = parsed[0]; } catch (e) { }
                        }
                        if (typeof img === 'string') {
                            const cleaned = img.trim();
                            if (cleaned !== 'null' && cleaned !== 'undefined' && cleaned !== '' && cleaned !== '[]') {
                                setLocalImage(
                                    (cleaned.startsWith('data:image/') || cleaned.startsWith('http') || cleaned.startsWith('blob:'))
                                        ? cleaned
                                        : `data:image/png;base64,${cleaned}`
                                );
                            }
                        }
                    }
                } catch (e) {
                    console.error("Local image fetch failed:", e);
                }
            };
            fetchLocalImage();
        }
    }, [isVisible, resolvedImage, medicine.id]);

    const handleCardClick = () => {
        if (onQuickView) {
            onQuickView(medicine);
        } else {
            navigate(`/medicine/${medicine.id}`);
        }
    };

    return (
        <motion.div
            ref={cardRef}
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
                    onClick={handleCardClick}
                    style={{ cursor: 'pointer' }}
                >
                    {resolvedImage ? (
                        <img src={resolvedImage} alt={medicine.name} className="product-img" loading="lazy" />
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

            <div className="product-info-section" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
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

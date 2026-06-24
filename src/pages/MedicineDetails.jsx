import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Shield, AlertCircle, Thermometer, ShoppingCart, Plus, Minus, Activity, Star, Zap, Search, Truck, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/medicines/ProductCard';
import '../components/medicines/MedicineDetailModal.css';
import './MedicineDetails.css';

function MedicineDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { medicines, cart, addToCart, removeFromCart, fetchMedicineImage } = useApp();
    const [product, setProduct] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [selectedSize, setSelectedSize] = useState('M');
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
    const [lastTap, setLastTap] = useState(0);

    const defaultOrthoSizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'UNI'];
    const ORTHO_SIZES = (product?.availableSizes && product.availableSizes.length > 0)
        ? product.availableSizes.map(s => typeof s === 'object' ? s.size : s)
        : defaultOrthoSizes;
    const isOrtho = product?.category === 'Ortho';

    useEffect(() => {
        if (isOrtho && ORTHO_SIZES.length > 0 && !ORTHO_SIZES.includes(selectedSize)) {
            setSelectedSize(ORTHO_SIZES[0]);
        }
    }, [product, isOrtho, ORTHO_SIZES]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const found = medicines.find(m => m.id?.toString() === id?.toString());
        if (found) {
            setProduct(found);
            window.scrollTo(0, 0);
            setActiveImageIndex(0);
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

    const cartItem = cart.find(item => item.id === product.id && item.selectedSize === (isOrtho ? selectedSize : null));
    const quantity = cartItem ? cartItem.quantity : 0;

    const getPriceData = () => {
        // Fallback to base product price if sizes aren't defined or selected size doesn't have a price
        const basePrice = Number(product.price) || 0;
        const baseMrp = basePrice / (1 - (Number(product.discount) || 0) / 100);
        const baseDiscount = Number(product.discount) || 0;

        if (!isOrtho || !product.availableSizes || product.availableSizes.length === 0) {
            return { price: basePrice, mrp: baseMrp, discount: baseDiscount };
        }

        const sizeData = product.availableSizes.find(s => s.size === selectedSize);
        if (!sizeData || (!sizeData.price && !sizeData.mrp)) {
            return { price: basePrice, mrp: baseMrp, discount: baseDiscount };
        }

        const sPrice = Number(sizeData.price) || basePrice;
        const sMrp = Number(sizeData.mrp) || (sPrice / (1 - baseDiscount / 100));
        const sDiscount = sMrp > 0 ? Math.round(((sMrp - sPrice) / sMrp) * 100) : baseDiscount;

        return { price: sPrice, mrp: sMrp, discount: sDiscount };
    };

    const { price: currentPrice, mrp: oldPrice, discount: currentDiscount } = getPriceData();

    const handleAdd = () => {
        const productWithCorrectPrice = { ...product, price: currentPrice, discount: currentDiscount };
        addToCart(productWithCorrectPrice, isOrtho ? selectedSize : null);
    };

    return (
        <div className="medicine-details-container" style={{ background: '#f8fafc' }}>
            {/* Mobile-Friendly Header */}
            <div className={`mobile-details-header ${isScrolled ? 'scrolled' : ''}`}>
                <div className="header-content">
                    <button className="icon-btn back-circle" onClick={() => navigate(-1)}>
                        <ArrowLeft size={22} />
                    </button>
                    {!isScrolled ? (
                        <h2 className="header-brand-name">Guardian <span style={{ color: '#0d9488' }}>Pharmacy</span></h2>
                    ) : (
                        <motion.h2
                            className="header-product-name"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {product.name}
                        </motion.h2>
                    )}
                    <div className="header-actions">
                        {/* Hidden as requested */}
                    </div>
                </div>
            </div>

            <div className="container main-content-area">
                <button
                    className="desktop-back-btn"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={18} /> Back to Products
                </button>

                <motion.div
                    className="details-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Left: Image Card */}
                    <div className="details-visual-panel shadow-sm" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
                        <div className="gallery-layout">
                            <div className="main-image-wrapper">
                                <div className="carousel-container">
                                    <motion.div
                                        className="carousel-track"
                                        animate={{ x: `-${activeImageIndex * 100}%` }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 260,
                                            damping: 32,
                                            mass: 1,
                                            restDelta: 0.01
                                        }}
                                        drag="x"
                                        dragConstraints={{ left: 0, right: 0 }}
                                        dragElastic={0.2}
                                        onDragEnd={(e, { offset, velocity }) => {
                                            const swipeThreshold = 50;
                                            const velocityThreshold = 500;
                                            if (Array.isArray(product.images) && product.images.length > 1) {
                                                const swipe = offset.x;
                                                const speed = velocity.x;

                                                if ((swipe > swipeThreshold || speed > velocityThreshold) && activeImageIndex > 0) {
                                                    setActiveImageIndex(activeImageIndex - 1);
                                                } else if ((swipe < -swipeThreshold || speed < -velocityThreshold) && activeImageIndex < product.images.length - 1) {
                                                    setActiveImageIndex(activeImageIndex + 1);
                                                }
                                            }
                                        }}
                                        style={{ display: 'flex', width: '100%', height: '100%', cursor: 'grab' }}
                                    >
                                        {(Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.image_base64 || 'https://via.placeholder.com/400']).map((img, i) => (
                                            <div
                                                key={i}
                                                className="carousel-slide"
                                                onMouseEnter={() => {
                                                    if (window.innerWidth > 768) setIsZoomed(true);
                                                }}
                                                onMouseLeave={() => {
                                                    if (window.innerWidth > 768) setIsZoomed(false);
                                                }}
                                                onMouseMove={(e) => {
                                                    if (window.innerWidth > 768) {
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                                                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                                                        setZoomOrigin({ x, y });
                                                    }
                                                }}
                                                onClick={(e) => {
                                                    const now = Date.now();
                                                    if (now - lastTap < 300) {
                                                        // Double tap detected
                                                        setIsZoomed(!isZoomed);
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                                                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                                                        setZoomOrigin({ x, y });
                                                    } else {
                                                        // Single tap - keep original next/prev logic
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const x = e.clientX - rect.left;
                                                        if (x > rect.width / 2) {
                                                            if (activeImageIndex < (product.images?.length || 1) - 1) {
                                                                setActiveImageIndex(activeImageIndex + 1);
                                                            }
                                                        } else {
                                                            if (activeImageIndex > 0) {
                                                                setActiveImageIndex(activeImageIndex - 1);
                                                            }
                                                        }
                                                    }
                                                    setLastTap(now);
                                                }}
                                                style={{
                                                    cursor: isZoomed ? 'zoom-out' : 'zoom-in',
                                                    position: 'relative',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`${product.name} ${i + 1}`}
                                                    className="main-image"
                                                    style={{
                                                        transform: (isZoomed && window.innerWidth <= 768) ? 'scale(2.5)' : 'scale(1)',
                                                        transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`
                                                    }}
                                                />
                                                {isZoomed && window.innerWidth > 768 && (
                                                    <div
                                                        className="zoom-lens"
                                                        style={{
                                                            left: `${zoomOrigin.x}%`,
                                                            top: `${zoomOrigin.y}%`
                                                        }}
                                                    />
                                                )}
                                                {!isZoomed && <div className="zoom-hint">Hover to Zoom</div>}
                                            </div>
                                        ))}
                                    </motion.div>
                                </div>

                                {Array.isArray(product.images) && product.images.length > 1 && (
                                    <>
                                        <button
                                            className="gallery-nav-btn prev"
                                            onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => Math.max(0, prev - 1)); }}
                                            style={{ display: activeImageIndex === 0 ? 'none' : 'flex' }}
                                        >
                                            <ChevronLeft size={24} />
                                        </button>
                                        <button
                                            className="gallery-nav-btn next"
                                            onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => Math.min((product.images.length - 1), prev + 1)); }}
                                            style={{ display: activeImageIndex === product.images.length - 1 ? 'none' : 'flex' }}
                                        >
                                            <ChevronRight size={24} />
                                        </button>
                                    </>
                                )}

                                {product.discount > 0 && (
                                    <div className="discount-tag">-{Math.round(product.discount)}% OFF</div>
                                )}

                                {/* Side Zoom Panel for Desktop */}
                                {isZoomed && window.innerWidth > 768 && (
                                    <div className="side-zoom-view shadow-lg">
                                        <div className="side-zoom-header">Zoom Preview</div>
                                        <img
                                            src={(Array.isArray(product.images) && product.images.length > 0 ? product.images[activeImageIndex] : (product.image_base64 || ''))}
                                            alt="Zoomed view"
                                            style={{
                                                transform: 'scale(2.5)',
                                                transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Pagination Dots for Mobile */}
                                {Array.isArray(product.images) && product.images.length > 1 && (
                                    <div className="mobile-pagination-dots">
                                        {product.images.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`dot ${activeImageIndex === idx ? 'active' : ''}`}
                                                onClick={() => setActiveImageIndex(idx)}
                                            />
                                        ))}
                                    </div>
                                )}
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
                                <span className="actual-price">₹{currentPrice.toFixed(2)}</span>
                                {currentDiscount > 0 && (
                                    <span className="mrp-display">MRP <s>₹{oldPrice.toFixed(2)}</s></span>
                                )}
                            </div>
                            <p className="tax-info">Inclusive of all taxes</p>
                        </div>

                        {isOrtho && (
                            <div className="size-selection-section" style={{ marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#475569' }}>Select Size</h4>
                                    <span style={{ fontSize: '0.85rem', color: '#0d9488', fontWeight: 600, cursor: 'pointer' }}>Size Chart</span>
                                </div>
                                <div className="size-buttons-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {ORTHO_SIZES.map((size, idx) => {
                                        const isSelected = selectedSize === size;
                                        const sizeData = product.availableSizes?.find(s => (s.size === size || s === size));

                                        // Calculate specific price for this button
                                        const sBasePrice = Number(product.price) || 0;
                                        const sPrice = (sizeData && typeof sizeData === 'object') ? Number(sizeData.price) || sBasePrice : sBasePrice;
                                        const sMrp = (sizeData && typeof sizeData === 'object') ? Number(sizeData.mrp) || (sPrice / (1 - (Number(product.discount) || 0) / 100)) : (sPrice / (1 - (Number(product.discount) || 0) / 100));
                                        const sDiscount = sMrp > 0 ? Math.round(((sMrp - sPrice) / sMrp) * 100) : (Number(product.discount) || 0);

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedSize(size)}
                                                className={`size-btn ${isSelected ? 'active' : ''}`}
                                                style={{
                                                    minWidth: '70px',
                                                    height: 'auto',
                                                    padding: '8px 12px',
                                                    borderRadius: '12px',
                                                    border: isSelected ? '2px solid #0d9488' : '1px solid #e2e8f0',
                                                    background: isSelected ? '#f0fdfa' : 'white',
                                                    color: isSelected ? '#0d9488' : '#64748b',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    boxShadow: isSelected ? '0 4px 12px rgba(13, 148, 136, 0.15)' : 'none',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '2px'
                                                }}
                                            >
                                                <span style={{ fontWeight: 800, fontSize: '1rem' }}>{size}</span>
                                                <span style={{ fontWeight: 700, fontSize: '0.8rem', color: isSelected ? '#0d9488' : '#1e293b' }}>₹{sPrice.toFixed(0)}</span>
                                                {sDiscount > 0 && (
                                                    <span style={{ fontWeight: 800, fontSize: '0.65rem', color: '#10b981' }}>{sDiscount}% OFF</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="action-section">
                            <div className="purchase-controls-wrapper">
                                {quantity > 0 ? (
                                    <div className="quantity-box" style={{ background: '#0f172a' }}>
                                        <button
                                            className="qty-btn"
                                            onClick={() => removeFromCart(product.id, isOrtho ? selectedSize : null)}
                                        >
                                            <Minus size={18} color="#0f172a" />
                                        </button>
                                        <span className="qty-value" style={{ color: 'white' }}>{quantity}</span>
                                        <button
                                            className="qty-btn"
                                            onClick={() => addToCart({ ...product, price: currentPrice, discount: currentDiscount }, isOrtho ? selectedSize : null)}
                                            style={{ opacity: quantity >= 10 ? 0.5 : 1, cursor: quantity >= 10 ? 'not-allowed' : 'pointer' }}
                                            disabled={quantity >= 10}
                                        >
                                            <Plus size={18} color="#0f172a" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="btn btn-primary add-to-cart-btn"
                                        onClick={handleAdd}
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
                            <div className="trust-card shadow-sm" style={{ background: 'white' }}>
                                <AlertCircle size={28} className="text-primary" style={{ color: '#f59e0b' }} />
                                <div>
                                    <h4 style={{ color: '#0f172a' }}>Return Policy</h4>
                                    <p>This item is non-returnable</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </motion.div>

                {(product.description || product.manufacturer) && (
                    <div className="product-description-section full-width-details" style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', boxShadow: '0 4px 30px rgba(0,0,0,0.03)', marginTop: '3rem' }}>
                        <div className="section-header" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '4px', height: '32px', background: '#0d9488', borderRadius: '4px' }}></div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Product Details</h2>
                        </div>
                        <div className="description-text">
                            {product.description && (
                                <ul className="desc-bullet-list">
                                    {product.description
                                        .split('*')
                                        .map(s => s.trim())
                                        .filter(s => s.length > 0)
                                        .map((point, i) => (
                                            <li key={i}>{point}</li>
                                        ))
                                    }
                                </ul>
                            )}
                            {product.manufacturer && (
                                <div style={{
                                    marginTop: '2.5rem',
                                    padding: '1.5rem',
                                    background: '#f8fafc',
                                    borderRadius: '16px',
                                    border: '1px solid #e2e8f0',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    <div style={{ padding: '8px', background: 'white', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                                        <Shield size={20} color="#0d9488" />
                                    </div>
                                    <span style={{ fontSize: '1rem', color: '#475569' }}><strong>Manufacturer:</strong> {product.manufacturer}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Related Products Section */}
                {(() => {
                    const related = medicines
                        .filter(m => m.id !== product.id)
                        .map(m => {
                            let score = 0;
                            if (product.combination && m.combination === product.combination) score += 10;
                            if (m.category === product.category) score += 5;
                            return { ...m, score };
                        })
                        .filter(m => m.score > 0)
                        .sort((a, b) => b.score - a.score)
                        .slice(0, 8);

                    if (related.length === 0) return null;

                    return (
                        <div className="related-products-section" style={{ marginTop: '5rem', marginBottom: '4rem' }}>
                            <div className="section-header" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '4px', height: '32px', background: '#0d9488', borderRadius: '4px' }}></div>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Similar Products</h2>
                            </div>
                            <div className="products-grid">
                                {related.map(med => (
                                    <ProductCard
                                        key={med.id}
                                        medicine={med}
                                        cart={cart}
                                        onAddToCart={addToCart}
                                        onRemoveFromCart={removeFromCart}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })()}
            </div>

            {/* Mobile Sticky Bottom Bar */}
            <div className="mobile-action-bar">
                <div className="mobile-action-content">
                    <div className="mobile-price-preview">
                        <span className="mb-label">Total Price</span>
                        <span className="mb-price">₹{currentPrice.toFixed(2)}</span>
                    </div>
                    <div className="mobile-action-btns">
                        {quantity > 0 ? (
                            <div className="mobile-qty-control">
                                <button className="m-qty-btn" onClick={() => removeFromCart(product.id, isOrtho ? selectedSize : null)}>
                                    <Minus size={18} />
                                </button>
                                <span className="m-qty-val">{quantity}</span>
                                <button
                                    className="m-qty-btn"
                                    onClick={() => addToCart({ ...product, price: currentPrice, discount: currentDiscount }, isOrtho ? selectedSize : null)}
                                    disabled={quantity >= 10}
                                    style={{ opacity: quantity >= 10 ? 0.5 : 1 }}
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        ) : (
                            <button
                                className="mobile-add-btn"
                                onClick={handleAdd}
                                disabled={!product.inStock}
                            >
                                <ShoppingCart size={20} />
                                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MedicineDetails;

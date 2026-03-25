import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Minus, Plus, X, Trash2, ChevronLeft, CreditCard, Truck, ShieldCheck, Ticket, Lock, Unlock, Sparkles } from 'lucide-react';

const FREE_DELIVERY_THRESHOLD = 500;

const CartDrawer = ({ 
    isOpen, onClose, cart, totalItems, cartTotal, 
    onAdd, onRemove, onCheckout, showCheckoutForm, 
    customerDetails, setCustomerDetails, onHandleCheckout, 
    isCheckingOut, onBack
}) => {
    const remainingForFree = Math.max(0, FREE_DELIVERY_THRESHOLD - cartTotal);
    const deliveryProgress = Math.min(100, (cartTotal / FREE_DELIVERY_THRESHOLD) * 100);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="cart-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="cart-drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        <div className="cart-header">
                            <h2>{showCheckoutForm ? 'Delivery Details' : `Your Cart (${totalItems})`}</h2>
                            <button className="close-btn" onClick={onClose}>
                                <X size={24} />
                            </button>
                        </div>

                        {!showCheckoutForm ? (
                            <>
                                <div className="cart-items-scroll">
                                    {cart.length > 0 && (
                                        <motion.div 
                                            className="free-delivery-card"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <div className="delivery-status-text">
                                                {remainingForFree > 0 ? (
                                                    <span>Add <strong>₹{remainingForFree}</strong> more to get <span className="free-text-glow">FREE Delivery</span></span>
                                                ) : (
                                                    <span className="free-unlocked-text">
                                                        <Sparkles size={16} className="sparkle-anim" /> 
                                                        FREE Delivery Unlocked! 
                                                        <Sparkles size={16} className="sparkle-anim" />
                                                    </span>
                                                )}
                                            </div>
                                            <div className="delivery-progress-track">
                                                <motion.div 
                                                    className="delivery-progress-fill"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${deliveryProgress}%` }}
                                                    transition={{ duration: 1.2, ease: "circOut" }}
                                                />
                                                <div className={`delivery-lock-icon ${deliveryProgress >= 100 ? 'unlocked' : ''}`}>
                                                    {deliveryProgress >= 100 ? (
                                                        <motion.div 
                                                            initial={{ scale: 0 }} 
                                                            animate={{ scale: [1, 1.2, 1] }}
                                                            transition={{ repeat: Infinity, duration: 2 }}
                                                        >
                                                            <Unlock size={14} />
                                                        </motion.div>
                                                    ) : <Lock size={14} />}
                                                </div>
                                            </div>
                                            <div className="free-delivery-label-premium">
                                                FREE DELIVERY
                                            </div>
                                        </motion.div>
                                    )}

                                    {cart.length === 0 ? (
                                        <motion.div 
                                            className="empty-cart-container" 
                                            initial={{ opacity: 0, y: 20 }} 
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <div className="empty-cart-visual">
                                                <ShoppingCart size={80} strokeWidth={1} className="empty-icon" />
                                                <motion.div 
                                                    className="empty-ring"
                                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                                                    transition={{ duration: 3, repeat: Infinity }}
                                                />
                                            </div>
                                            <h3>Your cart is empty</h3>
                                            <p>Looks like you haven't added anything yet. Explore our categories to get started!</p>
                                            <button className="btn btn-primary shop-now-btn" onClick={onClose}>Start Shopping</button>
                                        </motion.div>
                                    ) : (
                                        <div className="cart-items-list">
                                            <AnimatePresence mode="popLayout">
                                                {cart.map(item => (
                                                    <motion.div
                                                        key={item.id}
                                                        className="premium-cart-item"
                                                        layout
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                    >
                                                        <div className="item-image-wrapper">
                                                            <img src={(Array.isArray(item.images) && item.images.length > 0) ? item.images[0] : (item.image_base64 || 'https://via.placeholder.com/80')} alt={item.name} />
                                                        </div>
                                                        <div className="item-main-info">
                                                            <div className="item-header-row">
                                                                <h4 className="item-title">{item.name}</h4>
                                                                <button className="delete-item-btn" onClick={() => onRemove(item.id)}><Trash2 size={16} /></button>
                                                            </div>
                                                            <p className="item-subtitle text-muted">{item.category}</p>
                                                            <div className="item-footer-row">
                                                                <div className="item-price-group">
                                                                    <span className="item-price">₹{Number(item.price).toFixed(0)}</span>
                                                                    {item.discount > 0 && <span className="item-old-price">₹{(item.price / (1 - item.discount/100)).toFixed(0)}</span>}
                                                                </div>
                                                                <div className="premium-qty-control">
                                                                    <button className="p-qty-btn" onClick={() => onRemove(item.id)}><Minus size={14} /></button>
                                                                    <span className="p-qty-val">{item.quantity}</span>
                                                                    <button className="p-qty-btn plus" onClick={() => onAdd(item)}><Plus size={14} /></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </div>

                                {cart.length > 0 && (
                                    <div className="premium-cart-footer">
                                        {(() => {
                                            const totalDiscountAmount = cart.reduce((total, item) => {
                                                const hasDiscount = item.discount && item.discount > 0 && item.discount < 100;
                                                const originalPrice = hasDiscount ? (item.price / (1 - item.discount / 100)) : item.price;
                                                return total + (originalPrice - item.price) * item.quantity;
                                            }, 0);
                                            const rawItemTotal = cartTotal + totalDiscountAmount;

                                            return (
                                                <div className="bill-summary-card">
                                                    <h3 className="summary-title">Bill Summary</h3>
                                                    <div className="summary-row">
                                                        <span className="label">Item Total (MRP)</span>
                                                        <span className="value">₹{rawItemTotal.toFixed(2)}</span>
                                                    </div>
                                                    <div className="summary-row">
                                                        <span className="label">Delivery Fee</span>
                                                        <span className="value success-text">FREE</span>
                                                    </div>
                                                    <div className="summary-row promo-row" style={{ opacity: totalDiscountAmount > 0 ? 1 : 0.6 }}>
                                                        <div className="label-with-icon">
                                                            <Ticket size={14} />
                                                            <span>Platform Discount</span>
                                                        </div>
                                                        <span className="value success-text">- ₹{totalDiscountAmount.toFixed(2)}</span>
                                                    </div>
                                                    <div className="summary-total-row">
                                                        <span className="label">Total Amount</span>
                                                        <span className="value">₹{cartTotal.toFixed(2)}</span>
                                                    </div>
                                                    {totalDiscountAmount > 0 && (
                                                        <motion.div 
                                                            className="savings-badge"
                                                            initial={{ scale: 0.9, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                        >
                                                            <ShieldCheck size={14} />
                                                            <span>You are saving ₹{totalDiscountAmount.toFixed(0)} on this order</span>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                        
                                        <button
                                            className="btn-checkout-premium"
                                            onClick={onCheckout}
                                        >
                                            <div className="btn-content">
                                                <div className="btn-left">
                                                    <span className="btn-total">₹{cartTotal.toFixed(2)}</span>
                                                    <span className="btn-label">TOTAL AMOUNT</span>
                                                </div>
                                                <div className="btn-right">
                                                    <span>Proceed</span>
                                                    <ChevronLeft size={20} className="rotate-180" style={{ transform: 'rotate(180deg)' }} />
                                                </div>
                                            </div>
                                        </button>
                                        
                                        <div className="safety-guarantee">
                                            <Truck size={14} />
                                            <span>Guaranteed safe and contactless delivery within 24-48 hours</span>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <form onSubmit={onHandleCheckout} className="checkout-form">
                                <div className="cart-items-scroll" style={{ gap: '0.75rem', display: 'flex', flexDirection: 'column' }}>
                                    <div className="checkout-form-group">
                                        <label className="input-label">Full Name *</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="Enter your full name"
                                            required
                                            value={customerDetails.name}
                                            onChange={e => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="checkout-form-group">
                                        <label className="input-label">Phone Number *</label>
                                        <input
                                            type="tel"
                                            className="input-field"
                                            placeholder="Enter your phone number"
                                            required
                                            value={customerDetails.phone}
                                            onChange={e => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="checkout-form-group">
                                        <label className="input-label">WhatsApp Number *</label>
                                        <input
                                            type="tel"
                                            className="input-field"
                                            placeholder="Enter your WhatsApp number"
                                            required
                                            value={customerDetails.whatsapp}
                                            onChange={e => setCustomerDetails({ ...customerDetails, whatsapp: e.target.value })}
                                        />
                                    </div>
                                    <div className="checkout-form-group">
                                        <label className="input-label">Delivery Address *</label>
                                        <textarea
                                            className="input-field"
                                            placeholder="Enter your full delivery address"
                                            required
                                            rows="3"
                                            value={customerDetails.address}
                                            onChange={e => setCustomerDetails({ ...customerDetails, address: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <div className="checkout-form-group">
                                        <label className="input-label">Pincode *</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="Enter your pincode"
                                            required
                                            maxLength="6"
                                            value={customerDetails.pincode}
                                            onChange={e => setCustomerDetails({ ...customerDetails, pincode: e.target.value })}
                                        />
                                    </div>
                                    <div className="checkout-form-group">
                                        <label className="input-label">Email <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span></label>
                                        <input
                                            type="email"
                                            className="input-field"
                                            placeholder="Enter your email (optional)"
                                            value={customerDetails.email}
                                            onChange={e => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="premium-cart-footer shadow-lg" style={{ marginTop: 'auto' }}>
                                    <div className="summary-total-row" style={{ marginBottom: '1rem', borderTop: 'none', paddingTop: 0 }}>
                                        <span className="label">Amount Payable:</span>
                                        <span className="value">₹{cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <button
                                            type="button"
                                            className="btn btn-outline"
                                            style={{ flex: 1, borderRadius: '12px', height: '54px' }}
                                            onClick={onBack}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn-checkout-premium"
                                            style={{ flex: 2, height: '54px' }}
                                            disabled={isCheckingOut}
                                        >
                                            <div className="btn-content" style={{ justifyContent: 'center' }}>
                                                <span className="btn-total" style={{ fontSize: '1rem' }}>
                                                    {isCheckingOut ? 'Processing...' : 'Place Order Now'}
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default React.memo(CartDrawer);

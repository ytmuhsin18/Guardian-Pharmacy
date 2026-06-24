import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Minus, Plus, X, Trash2, ChevronLeft, CreditCard, Truck, ShieldCheck, Ticket, Lock, Unlock, Sparkles, Hand } from 'lucide-react';

const FREE_DELIVERY_THRESHOLD = 500;

const CartDrawer = ({
    isOpen, onClose, cart, totalItems, cartTotal,
    onAdd, onRemove, onDelete, onCheckout, showCheckoutForm,
    customerDetails, setCustomerDetails, onHandleCheckout,
    isCheckingOut, onBack
}) => {
    const remainingForFree = Math.max(0, FREE_DELIVERY_THRESHOLD - cartTotal);
    const deliveryProgress = Math.min(100, (cartTotal / FREE_DELIVERY_THRESHOLD) * 100);
    const qrSectionRef = React.useRef(null);

    // Auto-scroll to QR when Online Payment is selected
    const [timeLeft, setTimeLeft] = React.useState(300); // 5 minutes in seconds

    React.useEffect(() => {
        if (customerDetails.payment_method === 'ONLINE' && isOpen) {
            setTimeLeft(300);
            const timer = setInterval(() => {
                setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [customerDetails.payment_method, isOpen]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    React.useEffect(() => {
        if (customerDetails.payment_method === 'ONLINE' && qrSectionRef.current) {
            setTimeout(() => {
                qrSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }
    }, [customerDetails.payment_method]);

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
                                                <img src="/empty-cart.png" alt="Empty Cart" className="empty-cart-img" />
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
                                                        className="model-cart-item"
                                                        layout
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                    >
                                                        <div className="model-img-sec">
                                                            <img src={(Array.isArray(item.images) && item.images.length > 0) ? item.images[0] : (item.image_base64 || 'https://via.placeholder.com/80')} alt={item.name} />
                                                        </div>
                                                        <div className="model-details-sec">
                                                            <div className="model-header-row">
                                                                <h4 className="model-name">{item.name}</h4>
                                                                <button className="model-delete-btn" onClick={() => onDelete(item.id, item.selectedSize)}><Trash2 size={18} /></button>
                                                            </div>
                                                            {item.selectedSize && (
                                                                <div className="model-size-badge" style={{
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    padding: '2px 8px',
                                                                    background: '#f1f5f9',
                                                                    borderRadius: '6px',
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: 700,
                                                                    color: '#475569',
                                                                    marginBottom: '6px',
                                                                    border: '1px solid #e2e8f0'
                                                                }}>
                                                                    Size: {item.selectedSize}
                                                                </div>
                                                            )}
                                                            {/* Categories have been removed for a cleaner look as requested */}
                                                            <div className="model-bottom-row">
                                                                <div className="model-price-group">
                                                                    <span className="model-price-current">₹{Number(item.price).toFixed(0)}</span>
                                                                    {item.discount > 0 && <span className="model-price-old">₹{(item.price / (1 - item.discount / 100)).toFixed(0)}</span>}
                                                                </div>
                                                                <div className="model-qty-box">
                                                                    <button className="model-qty-btn-minus" onClick={() => onRemove(item.id, item.selectedSize)}><Minus size={14} /></button>
                                                                    <span className="model-qty-val">{item.quantity}</span>
                                                                    <button
                                                                        className="model-qty-btn-plus"
                                                                        onClick={() => onAdd(item, item.selectedSize)}
                                                                        disabled={item.quantity >= 10}
                                                                        style={{ opacity: item.quantity >= 10 ? 0.4 : 1, cursor: item.quantity >= 10 ? 'not-allowed' : 'pointer' }}
                                                                    >
                                                                        <Plus size={14} />
                                                                    </button>
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
                                                        <span className={`value ${cartTotal >= 500 ? 'success-text' : ''}`}>
                                                            {cartTotal >= 500 ? 'FREE' : '₹40.00'}
                                                        </span>
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
                                                        <span className="value">₹{(cartTotal + (cartTotal >= 500 ? 0 : 40)).toFixed(2)}</span>
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
                                                    <span className="btn-total">₹{(cartTotal + (cartTotal >= 500 ? 0 : 40)).toFixed(2)}</span>
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
                                <div className="cart-items-scroll" style={{ gap: '0.75rem', display: 'flex', flexDirection: 'column', paddingBottom: '3rem' }}>
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
                                    <div className="checkout-form-group">
                                        <label className="input-label">Payment Method</label>
                                        <div style={{
                                            padding: '16px 12px', border: '2px solid #0984e3',
                                            borderRadius: '16px', textAlign: 'center',
                                            background: 'rgba(9, 132, 227, 0.06)',
                                            color: '#0984e3',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                                        }}>
                                            <CreditCard size={22} />
                                            <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>Online Payment</span>
                                        </div>

                                        <AnimatePresence>
                                            {customerDetails.payment_method === 'ONLINE' && (
                                                <motion.div
                                                    ref={qrSectionRef}
                                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                    animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                    style={{ overflow: 'hidden' }}
                                                >
                                                    <div style={{
                                                        background: '#f8fafc',
                                                        borderRadius: '20px',
                                                        padding: '20px',
                                                        border: '1.5px dashed #0984e3',
                                                        textAlign: 'center'
                                                    }}>
                                                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Scan & Pay Online</h4>
                                                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '16px' }}>Scan the QR code to pay, or click the QR code to open your payment app.</p>

                                                        <div style={{
                                                            background: 'white',
                                                            padding: '12px',
                                                            borderRadius: '16px',
                                                            display: 'inline-block',
                                                            boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                                                            marginBottom: '16px',
                                                            position: 'relative',
                                                            cursor: 'pointer'
                                                        }}
                                                            onClick={() => {
                                                                // Trigger form submission
                                                                const form = document.querySelector('.checkout-form');
                                                                if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                                                            }}>
                                                            <a
                                                                style={{ display: 'block', position: 'relative', textDecoration: 'none' }}
                                                                href={`upi://pay?pa=paytmqr5j6flc@ptys&pn=Guardian%20Pharmacy&mc=0000&mode=02&purpose=00&am=${(cartTotal + (cartTotal >= 500 ? 0 : 40)).toFixed(2)}&cu=INR&tn=Order%20Payment`}
                                                            >
                                                                <img
                                                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=10&data=${encodeURIComponent(`upi://pay?pa=paytmqr5j6flc@ptys&pn=Guardian%20Pharmacy&mc=0000&mode=02&purpose=00&am=${(cartTotal + (cartTotal >= 500 ? 0 : 40)).toFixed(2)}&cu=INR&tn=Order%20Payment`)}`}
                                                                    alt="Payment QR"
                                                                    style={{ width: '180px', height: '180px', borderRadius: '12px', display: 'block', margin: '0 auto' }}
                                                                />

                                                            </a>
                                                        </div>

                                                        <div style={{ marginTop: '4px', marginBottom: '16px' }}>
                                                            <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, marginBottom: '6px' }}>
                                                                QR valid for <span style={{ color: '#0984e3', fontVariantNumeric: 'tabular-nums' }}>{formatTime(timeLeft)}</span> minutes
                                                            </div>
                                                            <div style={{ width: '100%', height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                                                                <motion.div
                                                                    initial={{ width: '100%' }}
                                                                    animate={{ width: `${(timeLeft / 300) * 100}%` }}
                                                                    transition={{ duration: 1, ease: 'linear' }}
                                                                    style={{ height: '100%', background: '#0984e3' }}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div style={{
                                                            background: 'white',
                                                            padding: '12px 16px',
                                                            borderRadius: '16px',
                                                            border: '1.5px solid #e2e8f0',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            gap: '12px',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                                            position: 'relative'
                                                        }}
                                                            onClick={() => {
                                                                navigator.clipboard.writeText('paytmqr5j6flc@ptys');
                                                                alert('UPI ID copied to clipboard!');
                                                            }}>
                                                            <div style={{ textAlign: 'left' }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>UPI ID (Tap to Copy)</span>
                                                                </div>
                                                                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0984e3' }}>paytmqr5j6flc@ptys</span>
                                                            </div>
                                                            <motion.div
                                                                style={{ background: '#f1f5f9', padding: '8px', borderRadius: '10px' }}
                                                                whileTap={{ scale: 0.9 }}
                                                            >
                                                                <Sparkles size={16} color="#0984e3" />
                                                            </motion.div>
                                                        </div>

                                                        <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '12px', fontStyle: 'italic' }}>
                                                            * "Pay & Place Order" will automatically redirect you to UPI and register your order.
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <div className="premium-cart-footer shadow-lg" style={{ marginTop: 'auto' }}>
                                    <div className="summary-total-row" style={{ marginBottom: '1rem', borderTop: 'none', paddingTop: 0 }}>
                                        <span className="label">Amount Payable:</span>
                                        <span className="value">₹{(cartTotal + (cartTotal >= 500 ? 0 : 40)).toFixed(2)}</span>
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
                                            style={{
                                                flex: 2,
                                                height: '54px',
                                                background: customerDetails.payment_method === 'ONLINE' ? 'linear-gradient(135deg, #0984e3, #00cec9)' : 'var(--primary)'
                                            }}
                                            disabled={isCheckingOut}
                                        >
                                            <div className="btn-content" style={{ justifyContent: 'center' }}>
                                                <span className="btn-total" style={{ fontSize: '1rem' }}>
                                                    {isCheckingOut ? 'Processing...' : (customerDetails.payment_method === 'ONLINE' ? 'Pay & Place Order' : 'Place Order Now')}
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

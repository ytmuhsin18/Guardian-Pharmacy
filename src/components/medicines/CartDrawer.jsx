import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Minus, Plus, X } from 'lucide-react';

const CartDrawer = ({ 
    isOpen, onClose, cart, totalItems, cartTotal, 
    onAdd, onRemove, onCheckout, showCheckoutForm, 
    customerDetails, setCustomerDetails, onHandleCheckout, 
    isCheckingOut, onBack
}) => {
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
                                <div className="cart-items">
                                    {cart.length === 0 ? (
                                        <motion.div className="empty-cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            <ShoppingCart size={48} className="text-muted" />
                                            <p>Your cart is empty.</p>
                                        </motion.div>
                                    ) : (
                                        <AnimatePresence>
                                            {cart.map(item => (
                                                <motion.div
                                                    key={item.id}
                                                    className="cart-item"
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8, x: -50 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <div className="item-details">
                                                        <h4>{item.name}</h4>
                                                        <p className="text-muted">₹{Number(item.price).toFixed(2)}</p>
                                                    </div>
                                                    <div className="item-actions">
                                                        <motion.button whileTap={{ scale: 0.8 }} className="qty-btn" onClick={() => onRemove(item.id)}>
                                                            <Minus size={16} />
                                                        </motion.button>
                                                        <span className="quantity">{item.quantity}</span>
                                                        <motion.button whileTap={{ scale: 0.8 }} className="qty-btn qty-btn-plus" onClick={() => onAdd(item)}>
                                                            <Plus size={16} />
                                                        </motion.button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    )}
                                </div>

                                {cart.length > 0 && (
                                    <div className="cart-footer">
                                        <div className="cart-summary">
                                            <span>Total:</span>
                                            <span className="cart-total">₹{cartTotal.toFixed(2)}</span>
                                        </div>
                                        <button
                                            className="btn btn-primary btn-block checkout-btn"
                                            onClick={onCheckout}
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <form onSubmit={onHandleCheckout} className="checkout-form">
                                <div className="cart-items" style={{ gap: '0.75rem' }}>
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

                                <div className="cart-footer">
                                    <div className="cart-summary">
                                        <span>Total:</span>
                                        <span className="cart-total">₹{cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <button
                                            type="button"
                                            className="btn btn-outline"
                                            style={{ flex: 1 }}
                                            onClick={onBack}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary checkout-btn"
                                            style={{ flex: 2 }}
                                            disabled={isCheckingOut}
                                        >
                                            {isCheckingOut ? 'Processing...' : 'Place Order'}
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

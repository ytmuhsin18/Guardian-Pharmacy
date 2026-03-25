import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './FloatingCartBar.css';

const FloatingCartBar = ({ onOpenCart }) => {
    const { cart } = useApp();
    
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    if (totalItems === 0) return null;

    return (
        <AnimatePresence>
            <motion.div 
                className="floating-cart-bar"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                onClick={onOpenCart}
            >
                <div className="cart-bar-content">
                    <div className="cart-bar-left">
                        <div className="cart-bar-icon-wrapper">
                            <ShoppingCart size={22} color="white" />
                        </div>
                        <div className="cart-bar-info">
                            <span className="item-count">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
                            <span className="total-amount">₹{cartTotal.toFixed(0)}</span>
                        </div>
                    </div>
                    <div className="cart-bar-right">
                        <span>View Cart</span>
                        <ChevronRight size={18} />
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default FloatingCartBar;

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Home,
    Pill,
    ShieldPlus,
    LayoutGrid,
    FlaskConical,
    UserRound,
    Accessibility,
    Menu,
    Sparkles,
    Truck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';
import logo from '../assets/gp-logo-new.png';

import { useApp } from '../context/AppContext';
import { ShoppingCart } from 'lucide-react';

const NavLink = ({ to, children, IconComponent }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <Link
            to={to}
            className="nav-link"
            style={{
                position: 'relative',
                padding: '8px 12px',
                borderRadius: '12px',
                transition: 'color 0.3s ease',
                color: isHovered ? 'var(--primary)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                minWidth: 'fit-content'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 2 }}>
                <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <AnimatePresence>
                        {isHovered && IconComponent && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0, x: -10 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0, x: -10 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                style={{ position: 'absolute' }}
                            >
                                <IconComponent size={16} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <motion.span
                    animate={{ x: isHovered ? 0 : -10 }}
                    style={{ fontWeight: 600, transition: 'all 0.3s ease' }}
                >
                    {children}
                </motion.span>
            </div>

            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        layoutId="nav-hover-pill"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(16, 185, 129, 0.08)',
                            borderRadius: '14px',
                            zIndex: 1,
                            border: '1px solid rgba(16, 185, 129, 0.1)'
                        }}
                    />
                )}
            </AnimatePresence>
        </Link>
    );
};

function Navbar() {
    const location = useLocation();
    const { setIsCartOpen, totalItems, cartTotal } = useApp();
    const showPromo = location.pathname === '/medicines';
    
    // Only show cart icon on medicines listing, details, and categories page
    const shouldShowCart = location.pathname.startsWith('/medicines') || 
                          location.pathname.startsWith('/medicine/') || 
                          location.pathname.startsWith('/categories');

    return (
        <>
            {showPromo && (
                <div className="promo-banner">
                    <motion.div
                        className="promo-content"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Sparkles size={14} className="text-yellow-400" />
                        <span>Free Home Delivery on all orders above <strong>₹500</strong></span>
                        <Truck size={14} />
                    </motion.div>
                </div>
            )}
            <nav className={`navbar ${showPromo ? 'with-promo' : ''}`}>
                <div className="container nav-content">
                    <Link to="/" className="nav-logo">
                        <img src={logo} alt="Guardian Pharmacy Logo" className="brand-logo" />
                        <span className="logo-text">
                            Guardian <span className="text-primary">Pharmacy</span>
                        </span>
                    </Link>

                    <div className="nav-links desktop-only" style={{ gap: '0.75rem' }}>
                        <NavLink to="/" IconComponent={Home}>Home</NavLink>
                        <NavLink to="/medicines" IconComponent={Pill}>Medicines</NavLink>
                        <NavLink to="/categories" IconComponent={LayoutGrid}>Categories</NavLink>
                        <NavLink to="/doctors" IconComponent={UserRound}>Doctors</NavLink>
                        <NavLink to="/lab-tests" IconComponent={FlaskConical}>Lab Tests</NavLink>
                        <NavLink to="/physiotherapy" IconComponent={Accessibility}>PHYSIOTHERAPY</NavLink>
                    </div>

                    {shouldShowCart && totalItems > 0 && (
                        <div className="nav-actions">
                            <motion.button 
                                className="nav-cart-btn-premium"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsCartOpen(true)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '10px 18px',
                                    background: 'var(--primary, #10b981)',
                                    border: 'none',
                                    borderRadius: '14px',
                                    cursor: 'pointer',
                                    color: 'white',
                                    position: 'relative',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.3)'
                                }}
                            >
                                <div className="cart-icon-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <ShoppingCart size={22} strokeWidth={2.5} />
                                </div>
                                <div className="cart-info-vertical" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: '1.2' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, whiteSpace: 'nowrap' }}>
                                        {totalItems} {totalItems === 1 ? 'item' : 'items'}
                                    </span>
                                    <span style={{ fontSize: '0.95rem', fontWeight: 900 }}>
                                        ₹{cartTotal.toFixed(0)}
                                    </span>
                                </div>
                            </motion.button>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
}

export default Navbar;

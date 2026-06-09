import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
    Truck,
    ArrowRight,
    LogOut,
    Check,
    X as CloseIcon,
    Package,
    Calendar,
    Clock,
    ChevronRight,
    ShoppingBag
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
    const navigate = useNavigate();
    const { setIsCartOpen, totalItems, cartTotal, user, logout, orders, updateOrderStatus } = useApp();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showOrdersModal, setShowOrdersModal] = useState(false);

    // Filter orders for the current user (by phone, email, or private device history)
    const userOrders = orders.filter(order => {
        const matchesPhone = user?.phone && user.phone !== 'N/A' && order.phone === user.phone;
        const matchesEmail = user?.email && order.email === user.email;

        // Check device-local history SPECIFIC to THIS user
        const userKeySuffix = user ? (user.phone || user.email) : 'guest';
        const historyKey = `my_guardian_orders_${userKeySuffix}`;
        const localOrders = JSON.parse(localStorage.getItem(historyKey) || '[]');
        const matchesLocal = localOrders.includes(order.id);

        return matchesPhone || matchesEmail || matchesLocal;
    });

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        logout();
        setShowLogoutConfirm(false);
    };
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

                    <div className="nav-actions">
                        {!location.pathname.startsWith('/admin') && (
                            !user ? (
                                <Link to="/signin" className="nav-signin-link">
                                    <motion.div
                                        className="nav-signin-btn"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div className="signin-icon-wrapper">
                                            <UserRound size={18} />
                                        </div>
                                        <span className="desktop-only" style={{ fontSize: '0.9rem' }}>Sign In</span>
                                    </motion.div>
                                </Link>
                            ) : (
                                <div className="nav-user-pill">
                                    <button
                                        className="user-profile-info-btn"
                                        onClick={() => setShowOrdersModal(true)}
                                    >
                                        <div className="user-avatar-small">
                                            <UserRound size={16} />
                                        </div>
                                        <span className="user-name-text desktop-only">{user.name.split(' ')[0]}</span>
                                    </button>
                                    <button
                                        onClick={handleLogoutClick}
                                        className="user-logout-action"
                                        title="Log Out"
                                    >
                                        <LogOut size={14} />
                                        <span className="desktop-only">Logout</span>
                                    </button>
                                </div>
                            )
                        )}

                        {shouldShowCart && totalItems > 0 && (
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
                        )}
                    </div>
                </div>
            </nav>

            {/* Order History Modal */}
            <AnimatePresence>
                {showOrdersModal && (
                    <div className="modal-overlay" style={{ zIndex: 10002 }}>
                        <motion.div
                            className="modal-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowOrdersModal(false)}
                        />
                        <motion.div
                            className="orders-history-modal glass-panel"
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        >
                            <div className="orders-modal-header">
                                <div className="header-icon-title">
                                    <div className="history-icon-bg">
                                        <ShoppingBag size={24} color="var(--primary)" />
                                    </div>
                                    <div>
                                        <h3>My Orders</h3>
                                        <p>Track your health purchases</p>
                                    </div>
                                </div>
                                <button className="close-orders-btn" onClick={() => setShowOrdersModal(false)}>
                                    <CloseIcon size={20} />
                                </button>
                            </div>

                            <div className="orders-modal-content">
                                {userOrders.length === 0 ? (
                                    <div className="empty-orders-state">
                                        <div className="empty-icon-wrapper">
                                            <Package size={48} />
                                        </div>
                                        <h4>No orders yet</h4>
                                        <p>Your medicine purchase history will appear here once you place an order.</p>
                                        <button
                                            className="shop-now-btn"
                                            onClick={() => { setShowOrdersModal(false); navigate('/medicines'); }}
                                        >
                                            Start Shopping
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="orders-list">
                                        {userOrders.map((order, idx) => (
                                            <motion.div
                                                key={order.id}
                                                className="order-history-card"
                                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                                transition={{ delay: idx * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                                            >
                                                <div className="order-card-header">
                                                    <div className="order-id-info">
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <span className="order-tag">Order {order.id}</span>
                                                            {(order.status === 'Delivered' || order.status === 'Confirmed' || order.status === 'Pending') && (
                                                                <motion.div
                                                                    className="green-signal-dot"
                                                                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="order-date">
                                                            <Calendar size={12} />
                                                            {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </div>
                                                    </div>
                                                    <motion.div
                                                        className={`order-status-pill ${order.status?.toLowerCase().replace(/\s+/g, '-') || 'pending'}`}
                                                        animate={order.status === 'Delivered' || order.status === 'Confirmed' ?
                                                            { scale: [1, 1.05, 1], opacity: [1, 0.8, 1] } : {}
                                                        }
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    >
                                                        {order.status === 'Delivered' ? <Check size={14} /> :
                                                            order.status?.toLowerCase().includes('delivery') ? <Truck size={14} /> :
                                                                order.status?.toLowerCase().includes('confirmed') ? <Package size={14} /> :
                                                                    <Clock size={14} />}
                                                        <span>{order.status || 'Processing Order'}</span>
                                                    </motion.div>
                                                </div>

                                                <div className="order-items-preview">
                                                    {order.items?.map((item, i) => (
                                                        <div key={i} className="history-item-row">
                                                            <div className="item-main-info">
                                                                <div className="history-item-img">
                                                                    {item.image ? (
                                                                        <img src={item.image} alt={item.name} />
                                                                    ) : (
                                                                        <Pill size={16} />
                                                                    )}
                                                                    <span className="item-qty-badge">{item.quantity}x</span>
                                                                </div>
                                                                <div className="item-details-text">
                                                                    <span className="item-name">{item.name}</span>
                                                                    {item.selectedSize && <span className="item-meta">Size: {item.selectedSize}</span>}
                                                                </div>
                                                            </div>
                                                            <span className="item-price">₹{(item.price * item.quantity).toFixed(0)}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="order-card-footer" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '1rem' }}>
                                                    <div className="footer-main-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div className="order-total-info">
                                                            <span>Total Paid</span>
                                                            <span className="total-amt">₹{order.total_amount}</span>
                                                        </div>
                                                        <motion.div
                                                            className="order-eta"
                                                            animate={{ x: [0, 3, 0] }}
                                                            transition={{ duration: 3, repeat: Infinity }}
                                                        >
                                                            <Clock size={12} />
                                                            <span>{order.status === 'Delivered' ? 'Completed' : order.status === 'Cancelled' ? 'Order Cancelled' : order.status === 'Cancel Requested' ? 'Cancel Requested' : 'Processing Order'}</span>
                                                        </motion.div>
                                                    </div>

                                                    {(order.status === 'Pending' || !order.status) && (
                                                        <motion.button
                                                            className="btn-cancel-order"
                                                            whileHover={{ scale: 1.01, background: '#ef4444', color: 'white' }}
                                                            whileTap={{ scale: 0.98 }}
                                                            style={{ width: '100%', padding: '12px', fontSize: '0.8rem' }}
                                                            onClick={() => {
                                                                if (window.confirm("Are you sure you want to request cancellation for this order?")) {
                                                                    updateOrderStatus(order.id, 'Cancel Requested');
                                                                }
                                                            }}
                                                        >
                                                            REQUEST TO CANCEL
                                                        </motion.button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutConfirm && (
                    <div className="logout-confirm-overlay">
                        <motion.div
                            className="logout-confirm-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowLogoutConfirm(false)}
                        />
                        <motion.div
                            className="logout-confirm-modal"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                            <div className="logout-confirm-icon-wrapper">
                                <LogOut size={32} />
                            </div>
                            <h3>Confirm Logout</h3>
                            <p>Are you sure you want to sign out of your account?</p>

                            <div className="logout-confirm-actions">
                                <button
                                    className="confirm-btn-no"
                                    onClick={() => setShowLogoutConfirm(false)}
                                >
                                    <CloseIcon size={18} />
                                    No, Keep Me In
                                </button>
                                <button
                                    className="confirm-btn-yes"
                                    onClick={confirmLogout}
                                >
                                    <Check size={18} />
                                    Yes, Logout
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

export default Navbar;

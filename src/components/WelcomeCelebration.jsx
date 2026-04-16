import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle, PartyPopper, User, Heart } from 'lucide-react';
import './WelcomeCelebration.css';

function WelcomeCelebration({ isOpen, userName, onClose, isReturning = false }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="celebration-overlay">
                    <motion.div 
                        className="celebration-modal glass-panel"
                        initial={{ scale: 0.5, opacity: 0, y: 100 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        {/* Confetti-like background particles */}
                        <div className="particles-container">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="particle"
                                    initial={{ 
                                        x: 0, y: 0, 
                                        opacity: 1,
                                        scale: Math.random() * 0.5 + 0.5,
                                        rotate: 0 
                                    }}
                                    animate={{ 
                                        x: (Math.random() - 0.5) * 400, 
                                        y: (Math.random() - 0.5) * 400,
                                        opacity: 0,
                                        rotate: Math.random() * 360
                                    }}
                                    transition={{ duration: 2.5, ease: "easeOut" }}
                                    style={{
                                        background: ['#0d9488', '#10b981', '#fbbf24', '#f472b6', '#60a5fa'][i % 5]
                                    }}
                                />
                            ))}
                        </div>

                        <motion.div 
                            className="celebration-icon-wrapper"
                            initial={{ rotate: -180, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 15 }}
                        >
                            <div className="main-icon-bg" style={{ 
                                background: isReturning ? 'linear-gradient(135deg, #f43f5e, #fb7185)' : 'linear-gradient(135deg, #0d9488, #10b981)' 
                            }}>
                                {isReturning ? <Heart size={60} color="white" fill="white" /> : <PartyPopper size={60} color="white" />}
                            </div>
                            <motion.div 
                                className="icon-sparkle s1"
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                <Sparkles size={24} color="#fbbf24" fill="#fbbf24" />
                            </motion.div>
                        </motion.div>

                        <div className="celebration-content">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                {isReturning ? 'Welcome Back!' : 'Welcome to Guardian!'}
                            </motion.h1>
                            <motion.p
                                className="welcome-name"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                style={{ color: isReturning ? '#f43f5e' : '#0d9488' }}
                            >
                                Hello, {userName}!
                            </motion.p>
                            <motion.p
                                className="welcome-message"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                {isReturning 
                                    ? "It's wonderful to see you again. We've missed having you around!" 
                                    : "Your healthcare journey just got a whole lot better. We're excited to have you with us!"}
                            </motion.p>

                            <motion.div 
                                className="id-card-snippet"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                <div className="card-indicator">
                                    <User size={14} />
                                    <span>{isReturning ? 'Returning Member' : 'New Member Verified'}</span>
                                </div>
                                <div className="card-check">
                                    <CheckCircle size={14} fill={isReturning ? '#f43f5e' : '#10b981'} color="white" />
                                    {isReturning ? 'Happy to see you again' : 'Account Activated'}
                                </div>
                            </motion.div>
                        </div>

                        <motion.button 
                            className="celebration-btn"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onClose}
                            style={{ background: isReturning ? '#1e293b' : '#0f172a' }}
                        >
                            {isReturning ? 'Continue Shopping' : 'Start Exploring'}
                        </motion.button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export default WelcomeCelebration;

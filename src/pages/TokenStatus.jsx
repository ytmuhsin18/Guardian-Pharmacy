import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Clock, User, CheckCircle, AlertCircle, Phone, Calendar, ArrowRight, Wifi } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './TokenStatus.css';

function TokenStatus() {
    const { appointments, fetchData, user } = useApp();
    const [searchPhone, setSearchPhone] = useState('');
    const [foundAppointments, setFoundAppointments] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const resultsRef = useRef(null);

    useEffect(() => {
        if (foundAppointments !== null) {
            const cleanSearch = searchPhone.replace(/\D/g, '').slice(-10);
            if (cleanSearch.length >= 10) {
                const results = appointments.filter(apt => {
                    const aptPhone = apt.phone.replace(/\D/g, '').slice(-10);
                    const aptWhatsapp = (apt.whatsapp || "").replace(/\D/g, '').slice(-10);
                    return aptPhone === cleanSearch || aptWhatsapp === cleanSearch;
                });
                setFoundAppointments(results);
            }
        }
    }, [appointments]);

    useEffect(() => {
        let interval;
        if (foundAppointments !== null) {
            interval = setInterval(() => { fetchData(); }, 10000);
        }
        return () => { if (interval) clearInterval(interval); };
    }, [foundAppointments !== null]);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setIsSearching(true);

        // Fetch latest data
        await fetchData();

        // Artificial delay for the "automation" feel
        setTimeout(() => {
            const cleanSearch = searchPhone.replace(/\D/g, '').slice(-10);
            if (cleanSearch.length < 10) {
                setIsSearching(false);
                return;
            }

            const results = appointments.filter(apt => {
                const aptPhone = apt.phone.replace(/\D/g, '').slice(-10);
                const aptWhatsapp = (apt.whatsapp || "").replace(/\D/g, '').slice(-10);
                return aptPhone === cleanSearch || aptWhatsapp === cleanSearch;
            });

            setFoundAppointments(results);
            setIsSearching(false);

            if (results.length > 0) {
                setShowSuccess(true);
                
                // After success animation, scroll to results
                setTimeout(() => {
                    setShowSuccess(false);
                    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 3500);
            }
        }, 1200);
    };

    return (
        <div className="token-page">

            {/* ── Full-screen Hero ── */}
            <section className="token-hero">
                {/* Animated grid pattern */}
                <div className="token-grid-pattern" />

                {/* Orbiting circles decoration */}
                <div className="orbit-ring orbit-1" />
                <div className="orbit-ring orbit-2" />

                {/* 🚀 Cartoon Red Rocket Launch Animation */}
                <div className="space-atmosphere">
                    <div className="stars-layer-1" />
                    <div className="stars-layer-2" />
                    <div className="nebula-glow" />
                </div>

                {/* 🚀 Cinematic Mini Rocket Model */}
                <div className={`rocket-scene-cinematic mini-version ${isSearching ? 'is-launching-prep' : ''}`}>
                    <motion.div
                        className="rocket-model-mini"
                        animate={showSuccess ? {
                            y: [0, -10, -800],
                            scale: [1, 1.1, 0.6],
                            opacity: [1, 1, 0],
                        } : {
                            y: [0, -12, 0],
                            rotate: [0, 0.3, -0.3, 0],
                        }}
                        transition={showSuccess ? {
                            duration: 2.2,
                            ease: [0.4, 0, 0.2, 1],
                        } : {
                            duration: 3.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        {/* High-Detail SVG Rocket Mini Model */}
                        <svg width="100" height="180" viewBox="0 0 60 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="rocketBodyMini" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#e53e3e" />
                                    <stop offset="50%" stopColor="#f56565" />
                                    <stop offset="100%" stopColor="#c53030" />
                                </linearGradient>
                                <radialGradient id="windowGlow" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="#e0f2fe" />
                                    <stop offset="100%" stopColor="#7dd3fc" />
                                </radialGradient>
                            </defs>

                            <ellipse cx="30" cy="60" rx="16" ry="34" fill="url(#rocketBodyMini)" />
                            <path d="M30 8 C18 30 14 45 14 55 H46 C46 45 42 30 30 8Z" fill="#9b2c2c" />
                            <circle cx="30" cy="55" r="7" fill="url(#windowGlow)" />
                            <path d="M14 78 L2 98 C2 98 8 92 14 90 Z" fill="#9b2c2c" />
                            <path d="M46 78 L58 98 C58 98 52 92 46 90 Z" fill="#9b2c2c" />
                            <path d="M22 92 H38 L36 102 H24 Z" fill="#2d3748" />
                        </svg>

                        <div className="rocket-flame-group-mini">
                            <motion.div className="flame-mini orange" animate={{ scaleY: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 0.15 }} />
                            <motion.div className="flame-mini yellow" animate={{ scaleY: [1, 1.7, 1] }} transition={{ repeat: Infinity, duration: 0.1 }} />
                        </div>
                    </motion.div>
                </div>

                {/* Hero content */}
                <div className="token-hero-content">
                    {/* Live badge */}
                    <motion.div
                        className="live-badge"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="live-badge-dot" />
                        <div className="live-badge-pulse" />
                        <Wifi size={14} />
                        <span>LIVE TOKEN STATUS</span>
                    </motion.div>

                    <motion.h1
                        className="token-hero-title"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        Check <span className="token-gold">Token Status</span>
                    </motion.h1>

                    <motion.p
                        className="token-hero-sub"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Enter your registered phone number to check your live appointment token & status.
                    </motion.p>

                    {/* Search card */}
                    <motion.div
                        className="token-search-card"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, type: 'spring', stiffness: 100 }}
                    >
                        <form onSubmit={handleSearch} className="token-search-form">
                            <div className="token-input-wrapper">
                                <Phone size={20} className="token-input-icon" />
                                <input
                                    type="tel"
                                    className="token-input"
                                    placeholder="Enter Phone Number"
                                    value={searchPhone}
                                    onChange={(e) => setSearchPhone(e.target.value)}
                                    required
                                />
                            </div>
                            <motion.button
                                type="submit"
                                className="token-search-btn"
                                disabled={isSearching}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                {isSearching ? (
                                    <motion.div
                                        className="btn-spinner"
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                                    />
                                ) : (
                                    <>Check Status <ArrowRight size={18} /></>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* ── Success Overlay (Cinematic Version) ── */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div 
                        className="token-success-overlay cinematic-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="token-success-card cinematic-card"
                            initial={{ scale: 0.5, opacity: 0, y: 100 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 1.5, opacity: 0, y: -200 }}
                            transition={{ type: 'spring', damping: 20 }}
                        >
                            <div className="success-check-circle-cinematic">
                                <CheckCircle size={64} color="#10b981" />
                            </div>

                            <h2 className="success-title-cinematic">TOKEN FOUND!</h2>
                            
                            <p className="success-description-cinematic">
                                Your live status is now ready.
                                <span className="cinematic-shine"></span>
                            </p>

                            <div className="success-footer-cinematic">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="success-spinner-cinematic"
                                />
                                <span>INITIALIZING DASHBOARD...</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Results ── */}
            <section className="token-results-section" ref={resultsRef}>
                <div className="token-results-container">
                    <AnimatePresence mode="wait">
                        {foundAppointments === null ? null : foundAppointments.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="token-empty-state"
                            >
                                <AlertCircle size={52} strokeWidth={1.5} />
                                <h3>No Appointments Found</h3>
                                <p>We couldn't find any appointments linked to this number. Please check the number or contact us.</p>
                            </motion.div>
                        ) : (
                            <motion.div key="results" className="token-cards-grid">
                                {foundAppointments.map((apt, idx) => (
                                    <motion.div
                                        key={idx}
                                        className="token-result-card"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1, type: 'spring' }}
                                    >
                                        {/* Token Number Badge */}
                                        <div className="token-number-section">
                                            {apt.token_number ? (
                                                <motion.div
                                                    className="big-token-number"
                                                    animate={{ scale: [1, 1.05, 1] }}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                >
                                                    <span className="token-hash">#</span>
                                                    <span>{apt.token_number}</span>
                                                </motion.div>
                                            ) : (
                                                <div className="waiting-token">
                                                    <Clock size={24} />
                                                    <span>Awaiting Token</span>
                                                </div>
                                            )}
                                            <span className={`token-status-pill-badge ${apt.status?.toLowerCase().replace(/\s+/g, '-') || 'pending'}`}>
                                                {apt.status || 'Pending'}
                                            </span>
                                        </div>

                                        {/* Doctor & Details */}
                                        <div className="token-card-body">
                                            <h3 className="token-doctor-name">{apt.doctorName}</h3>
                                            <div className="token-detail-row">
                                                <div className="token-detail-item">
                                                    <User size={16} />
                                                    <div>
                                                        <span className="detail-label">Patient</span>
                                                        <span className="detail-value">{apt.patientName}</span>
                                                    </div>
                                                </div>
                                                <div className="token-detail-item">
                                                    <Calendar size={16} />
                                                    <div>
                                                        <span className="detail-label">Date</span>
                                                        <span className="detail-value">{apt.date}</span>
                                                    </div>
                                                </div>
                                                {apt.time && (
                                                    <div className="token-detail-item">
                                                        <Clock size={16} />
                                                        <div>
                                                            <span className="detail-label">Slot</span>
                                                            <span className="detail-value">{apt.time}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="token-card-footer">
                                            <CheckCircle size={14} />
                                            <span>Live updates every 10 seconds</span>
                                        </div>
                                    </motion.div>
                                ))}
                                <p className="arrive-note">Please arrive 15 minutes before your scheduled timing.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
}

export default TokenStatus;

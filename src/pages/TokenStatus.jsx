import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Clock, User, CheckCircle, AlertCircle, Phone, Calendar, ArrowRight, Wifi } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './TokenStatus.css';

function TokenStatus() {
    const { appointments, fetchData } = useApp();
    const [searchPhone, setSearchPhone] = useState('');
    const [foundAppointments, setFoundAppointments] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

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
        await fetchData();
        setTimeout(() => {
            const cleanSearch = searchPhone.replace(/\D/g, '').slice(-10);
            if (cleanSearch.length < 10) { setIsSearching(false); return; }
            const results = appointments.filter(apt => {
                const aptPhone = apt.phone.replace(/\D/g, '').slice(-10);
                const aptWhatsapp = (apt.whatsapp || "").replace(/\D/g, '').slice(-10);
                return aptPhone === cleanSearch || aptWhatsapp === cleanSearch;
            });
            setFoundAppointments(results);
            setIsSearching(false);
        }, 300);
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
                <div className="rocket-scene">
                    <motion.div
                        className="rocket-ship"
                        animate={{
                            y: [120, 0, -300],
                            opacity: [0, 1, 1, 0],
                        }}
                        transition={{
                            duration: 2.8,
                            ease: [0.25, 0.1, 0.25, 1],
                            times: [0, 0.25, 0.8, 1],
                            repeat: Infinity,
                            repeatDelay: 1.5,
                        }}
                    >
                        {/* SVG Cartoon Rocket */}
                        <svg width="60" height="110" viewBox="0 0 60 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Rocket body */}
                            <ellipse cx="30" cy="60" rx="16" ry="32" fill="#e53e3e" />
                            {/* Nose cone */}
                            <path d="M30 10 C18 30 14 45 14 55 H46 C46 45 42 30 30 10Z" fill="#c53030" />
                            {/* Window */}
                            <circle cx="30" cy="55" r="8" fill="white" />
                            <circle cx="30" cy="55" r="5" fill="#bee3f8" />
                            <circle cx="28" cy="53" r="1.5" fill="white" opacity="0.7" />
                            {/* Left fin */}
                            <path d="M14 75 L4 95 L14 88 Z" fill="#c53030" />
                            {/* Right fin */}
                            <path d="M46 75 L56 95 L46 88 Z" fill="#c53030" />
                            {/* Bottom nozzle */}
                            <rect x="24" y="88" width="12" height="8" rx="2" fill="#744210" />
                            {/* Shine highlight */}
                            <ellipse cx="22" cy="45" rx="4" ry="10" fill="white" opacity="0.18" />
                        </svg>

                        {/* Flame exhaust */}
                        <div className="rocket-flame-group">
                            <motion.div
                                className="flame flame-main"
                                animate={{ scaleY: [1, 1.4, 0.8, 1.2, 1], scaleX: [1, 0.8, 1.1, 0.9, 1] }}
                                transition={{ repeat: Infinity, duration: 0.18, ease: 'easeInOut' }}
                            />
                            <motion.div
                                className="flame flame-inner"
                                animate={{ scaleY: [1, 1.6, 0.7, 1.3, 1], scaleX: [1, 0.7, 1.2, 0.8, 1] }}
                                transition={{ repeat: Infinity, duration: 0.14, ease: 'easeInOut' }}
                            />
                            <motion.div
                                className="flame flame-core"
                                animate={{ scaleY: [1, 1.8, 0.6, 1.4, 1] }}
                                transition={{ repeat: Infinity, duration: 0.10, ease: 'easeInOut' }}
                            />
                        </div>
                    </motion.div>

                    {/* Smoke trail particles */}
                    {[0, 1, 2].map(i => (
                        <motion.div
                            key={i}
                            className="smoke-particle"
                            style={{ left: `${28 + (i - 1) * 8}px` }}
                            animate={{
                                y: [0, 60 + i * 20],
                                opacity: [0.5, 0],
                                scale: [0.5, 1.8],
                            }}
                            transition={{
                                duration: 1.2,
                                delay: i * 0.15,
                                repeat: Infinity,
                                repeatDelay: 0.3,
                                ease: 'easeOut',
                            }}
                        />
                    ))}
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
                        Track Your <span className="token-gold">Token</span>
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

            {/* ── Results ── */}
            <section className="token-results-section">
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

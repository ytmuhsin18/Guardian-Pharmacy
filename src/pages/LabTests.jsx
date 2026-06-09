import React from 'react';
import { motion } from 'framer-motion';
import {
    Phone, MessageCircle, CheckCircle, Clock,
    ShieldCheck, UserCheck, FlaskConical, ArrowRight,
    Microscope, Activity
} from 'lucide-react';
import './LabTests.css';

const PHONE = '9487469098';
const WHATSAPP_URL = `https://wa.me/91${PHONE}?text=Hi%20Guardian%20Pharmacy%2C%20I%20want%20to%20book%20a%20lab%20test.`;

function LabTests() {
    const stagger = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    return (
        <motion.div
            className="lab-page"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* ── HERO ── */}
            <section className="lab-hero">
                <div className="lab-hero-orb lab-orb-1" />
                <div className="lab-hero-orb lab-orb-2" />
                <div className="lab-hero-orb lab-orb-3" />

                <div className="container lab-hero-inner">
                    <motion.div
                        className="lab-hero-text"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <motion.div
                            className="lab-hero-chip"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <FlaskConical size={14} />
                            NABL Certified Labs · Home Collection
                        </motion.div>

                        <h1 className="lab-hero-title">
                            Lab Tests &amp; <span className="lab-gradient-text">Diagnostics</span>
                        </h1>

                        <p className="lab-hero-sub">
                            Professional diagnostic tests from the comfort of your home.
                            Simply call us or send your test list on WhatsApp — we handle the rest.
                        </p>

                        {/* CTA Cards */}
                        <motion.div
                            className="lab-cta-row"
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                show: {
                                    opacity: 1,
                                    y: 0,
                                    transition: { staggerChildren: 0.2, delayChildren: 0.4 }
                                }
                            }}
                            initial="hidden"
                            animate="show"
                        >
                            <motion.a
                                href={`tel:${PHONE}`}
                                className="lab-cta-card lab-cta-call"
                                variants={{
                                    hidden: { opacity: 0, scale: 0.9 },
                                    show: { opacity: 1, scale: 1 }
                                }}
                                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(14,165,233,0.35)' }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                <div className="lab-cta-icon-wrap call-icon">
                                    <motion.div
                                        animate={{
                                            rotate: [0, 15, -15, 0],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 2.5,
                                            ease: 'easeInOut'
                                        }}
                                    >
                                        <Phone size={26} />
                                    </motion.div>
                                </div>
                                <div className="lab-cta-info">
                                    <span className="lab-cta-label">Book on Call</span>
                                    <span className="lab-cta-value">094874 69098</span>
                                </div>
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                >
                                    <ArrowRight size={18} className="lab-cta-arrow" />
                                </motion.div>
                            </motion.a>

                            <motion.a
                                href={WHATSAPP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="lab-cta-card lab-cta-wa"
                                variants={{
                                    hidden: { opacity: 0, scale: 0.9 },
                                    show: { opacity: 1, scale: 1 }
                                }}
                                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(37,211,102,0.35)' }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                <div className="lab-cta-icon-wrap wa-icon">
                                    <motion.div
                                        animate={{ scale: [1, 1.15, 1] }}
                                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                                    >
                                        <MessageCircle size={26} />
                                    </motion.div>
                                </div>
                                <div className="lab-cta-info">
                                    <span className="lab-cta-label">Send Test List</span>
                                    <span className="lab-cta-value" style={{ color: '#25d366' }}>Chat on WhatsApp</span>
                                </div>
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                                >
                                    <ArrowRight size={18} className="lab-cta-arrow" />
                                </motion.div>
                            </motion.a>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="lab-steps-section">
                <div className="container">
                    <div className="lab-section-header">
                        <h2>How it <span className="lab-gradient-text">Works</span></h2>
                        <p>3 simple steps to get your results at home</p>
                    </div>

                    <motion.div
                        className="lab-steps-grid"
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {[
                            {
                                step: '01',
                                icon: <Phone size={28} />,
                                title: 'Contact Us',
                                desc: 'Call us or share your test list via WhatsApp. Our health advisors will confirm the booking instantly.',
                                color: '#0ea5e9'
                            },
                            {
                                step: '02',
                                icon: <Microscope size={28} />,
                                title: 'Home Sample Collection',
                                desc: 'A certified phlebotomist visits your home at your preferred time. Quick, safe, and hygienic.',
                                color: '#10b981'
                            },
                            {
                                step: '03',
                                icon: <Activity size={28} />,
                                title: 'Get Digital Reports',
                                desc: 'Certified diagnostic reports are delivered directly to your phone within 24 hours.',
                                color: '#a855f7'
                            },
                        ].map((s, i) => (
                            <motion.div
                                key={i}
                                className="lab-step-card"
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    show: { opacity: 1, y: 0 }
                                }}
                                whileHover={{ y: -8, boxShadow: `0 20px 40px ${s.color}22` }}
                            >
                                <div className="lab-step-number" style={{ color: s.color }}>{s.step}</div>
                                <div className="lab-step-icon" style={{ background: `${s.color}18`, color: s.color }}>
                                    {s.icon}
                                </div>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                                {i < 2 && <div className="lab-step-connector" />}
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── TEST CATEGORIES ── */}
            <section className="lab-categories-section">
                <div className="container">
                    <div className="lab-section-header">
                        <h2>Popular <span className="lab-gradient-text">Test Panels</span></h2>
                        <p>Comprehensive packages for all your health needs</p>
                    </div>

                    <motion.div
                        className="lab-categories-grid"
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        {[
                            { icon: '🩸', name: 'Complete Blood Count', tag: 'CBC' },
                            { icon: '🧪', name: 'Blood Sugar (Fasting / PP)', tag: 'Diabetes' },
                            { icon: '💛', name: 'Liver Function Test', tag: 'LFT' },
                            { icon: '🫘', name: 'Kidney Function Test', tag: 'KFT' },
                            { icon: '🦋', name: 'Thyroid Profile', tag: 'T3 T4 TSH' },
                            { icon: '❤️', name: 'Lipid Profile', tag: 'Cholesterol' },
                            { icon: '🦴', name: 'Vitamin D & B12', tag: 'Vitamins' },
                            { icon: '🧬', name: 'Full Body Checkup', tag: 'Comprehensive' },
                        ].map((cat, i) => (
                            <motion.div
                                key={i}
                                className="lab-category-pill"
                                variants={{
                                    hidden: { opacity: 0, scale: 0.85 },
                                    show: { opacity: 1, scale: 1 }
                                }}
                                whileHover={{ scale: 1.04, y: -3 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <span className="lab-cat-emoji">{cat.icon}</span>
                                <div>
                                    <div className="lab-cat-name">{cat.name}</div>
                                    <div className="lab-cat-tag">{cat.tag}</div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── TRUST BANNER ── */}
            <section className="lab-trust-section">
                <div className="container">
                    <motion.div
                        className="lab-trust-card"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="lab-trust-orb-1" />
                        <div className="lab-trust-orb-2" />
                        <div className="lab-trust-content">
                            <motion.div
                                className="lab-trust-icon"
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                            >
                                <Activity size={36} />
                            </motion.div>
                            <h2>Trusted Diagnostic <span style={{ color: '#10b981' }}>Excellence</span></h2>
                            <p>
                                We partner with leading NABL-certified laboratories to ensure absolute
                                accuracy and rapid turnaround for all your diagnostic requirements.
                            </p>
                            <div className="lab-trust-badges">
                                {[
                                    { icon: <ShieldCheck size={20} />, text: 'NABL Certified' },
                                    { icon: <UserCheck size={20} />, text: 'Expert Staff' },
                                    { icon: <Clock size={20} />, text: '24-Hr Reports' },
                                    { icon: <CheckCircle size={20} />, text: '100% Accurate' },
                                ].map((b, i) => (
                                    <motion.div
                                        key={i}
                                        className="lab-trust-badge"
                                        whileHover={{ scale: 1.08 }}
                                    >
                                        {b.icon}
                                        <span>{b.text}</span>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="lab-trust-cta">
                                <motion.a
                                    href={`tel:${PHONE}`}
                                    className="lab-trust-btn call"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <Phone size={18} /> Call Now
                                </motion.a>
                                <motion.a
                                    href={WHATSAPP_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="lab-trust-btn wa"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <MessageCircle size={18} /> WhatsApp
                                </motion.a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <div style={{ height: '4rem' }} />
        </motion.div>
    );
}

export default LabTests;

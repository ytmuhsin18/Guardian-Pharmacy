import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Receipt, CheckCircle, Clock, ShieldCheck, UserCheck } from 'lucide-react';
import './Medicines.css'; // Reusing Medicines CSS

function LabTests() {
    return (
        <motion.div
            className="medicines-page"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {/* Header section with minimal but premium feel */}
            <section className="med-header section-padding" style={{ paddingBottom: '2rem' }}>
                <div className="container">
                    <motion.div
                        className="med-header-flex"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <div style={{ maxWidth: '700px' }}>
                            <motion.h1 
                                className="title"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                Lab Tests & <span className="gradient-text">Diagnostics</span>
                            </motion.h1>
                            <motion.p 
                                className="subtitle"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                Get professional laboratory diagnostic tests done from the comfort of your home. 
                                We've simplified the process - just call or send your prescription via WhatsApp.
                            </motion.p>
                        </div>
                    </motion.div>

                    {/* Primary Booking Options */}
                    <motion.div 
                        className="quick-action-banners" 
                        style={{
                            marginTop: '3rem',
                            display: 'flex',
                            gap: '1.5rem',
                            flexWrap: 'wrap',
                            justifyContent: 'center'
                        }}
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.2
                                }
                            }
                        }}
                        initial="hidden"
                        animate="show"
                    >
                        <motion.a 
                            href="tel:9487469098" 
                            className="action-banner-item" 
                            variants={{
                                hidden: { opacity: 0, y: 30, scale: 0.95 },
                                show: { opacity: 1, y: 0, scale: 1 }
                            }}
                            whileHover={{ 
                                scale: 1.05, 
                                y: -10,
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                                transition: { type: 'spring', stiffness: 300, damping: 20 }
                            }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                background: 'white', border: '1px solid #e2e8f0', borderRadius: '32px',
                                padding: '24px 30px', display: 'flex', alignItems: 'center', gap: '20px',
                                cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', flex: '1', minWidth: '300px',
                                maxWidth: '500px', textDecoration: 'none', color: 'inherit',
                                overflow: 'hidden', position: 'relative'
                            }}
                        >
                            {/* Animated background glow */}
                            <motion.div 
                                style={{
                                    position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
                                    background: 'radial-gradient(circle, rgba(14, 165, 233, 0.05) 0%, transparent 70%)',
                                    zIndex: 0
                                }}
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            />

                            <div style={{ position: 'relative', zIndex: 1, background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)', padding: '15px', borderRadius: '20px', color: 'white', flexShrink: 0 }}>
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                                    transition={{ duration: 0.5, delay: 2, repeat: Infinity, repeatDelay: 3 }}
                                >
                                    <Phone size={28} />
                                </motion.div>
                            </div>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Book on Call</h3>
                                <p style={{ fontSize: '1rem', color: '#64748b', margin: '4px 0 0 0', fontWeight: 600 }}>094874 69098</p>
                            </div>
                        </motion.a>

                        <motion.a 
                            href="https://wa.me/919487469098?text=Hello,%20I%20would%20like%20to%20upload%20my%20prescription%20to%20book%20a%20lab%20test." 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="action-banner-item" 
                            variants={{
                                hidden: { opacity: 0, y: 30, scale: 0.95 },
                                show: { opacity: 1, y: 0, scale: 1 }
                            }}
                            whileHover={{ 
                                scale: 1.05, 
                                y: -10,
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                                transition: { type: 'spring', stiffness: 300, damping: 20 }
                            }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                background: 'white', border: '1px solid #e2e8f0', borderRadius: '32px',
                                padding: '24px 30px', display: 'flex', alignItems: 'center', gap: '20px',
                                cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', flex: '1', minWidth: '300px',
                                maxWidth: '500px', textDecoration: 'none', color: 'inherit',
                                overflow: 'hidden', position: 'relative'
                            }}
                        >
                            {/* Animated background glow */}
                            <motion.div 
                                style={{
                                    position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
                                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)',
                                    zIndex: 0
                                }}
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            />

                            <div style={{ position: 'relative', zIndex: 1, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '15px', borderRadius: '20px', color: 'white', flexShrink: 0 }}>
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Receipt size={28} />
                                </motion.div>
                            </div>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Upload Prescription</h3>
                                <p style={{ fontSize: '1rem', color: '#64748b', margin: '4px 0 0 0', fontWeight: 600 }}>Send on WhatsApp</p>
                            </div>
                        </motion.a>
                    </motion.div>
                </div>
            </section>

            {/* Why Choose Us / Process Section */}
            <section className="section-padding" style={{ background: '#f8fafc', margin: '2rem 0' }}>
                <div className="container">
                    <div className="section-header text-center" style={{ marginBottom: '3rem' }}>
                        <h2 className="title" style={{ fontSize: '2rem' }}>How it <span className="gradient-text">Works</span></h2>
                        <p className="subtitle">Simple 3-step process to get your health checked.</p>
                    </div>

                    <motion.div 
                        style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                            gap: '2rem' 
                        }}
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: { staggerChildren: 0.15 }
                            }
                        }}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <FeatureCard 
                            icon={<Phone className="text-primary" />} 
                            title="1. Contact Us" 
                            desc="Call or share your prescription/test list via WhatsApp to our health advisors."
                        />
                        <FeatureCard 
                            icon={<Clock className="text-primary" />} 
                            title="2. Home Sample Collection" 
                            desc="A professional phlebotomist will visit your home at your preferred time to collect samples."
                        />
                        <FeatureCard 
                            icon={<CheckCircle className="text-primary" />} 
                            title="3. Digitized Reports" 
                            desc="Receive accurate and certified diagnostic reports directly on your phone within 24 hours."
                        />
                    </motion.div>
                </div>
            </section>

            {/* Quality & Trust section */}
            <section className="section-padding">
                <div className="container">
                    <motion.div 
                        className="glass-panel" 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{ 
                            padding: '4rem 3rem', 
                            borderRadius: '40px', 
                            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                            color: 'white',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                        }}
                    >
                        {/* Elegant background circles */}
                        <motion.div 
                            style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, transparent 70%)', zIndex: 0 }}
                            animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
                            transition={{ duration: 8, repeat: Infinity }}
                        />
                        <motion.div 
                            style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)', zIndex: 0 }}
                            animate={{ y: [0, -20, 0], scale: [1, 1.2, 1] }}
                            transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                        />

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}
                            >
                                Trusted Diagnostic <span style={{ color: '#10b981' }}>Excellence</span>
                            </motion.h2>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                style={{ fontSize: '1.25rem', opacity: 0.85, maxWidth: '850px', margin: '0 auto 4rem', lineHeight: 1.6 }}
                            >
                                We partner with leading NABL-certified laboratories across the region to ensure 
                                absolute accuracy and rapid turnaround for all your diagnostic requirements.
                            </motion.p>

                            <motion.div 
                                style={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    gap: '4rem', 
                                    flexWrap: 'wrap' 
                                }}
                                variants={{
                                    hidden: { opacity: 0 },
                                    show: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.2, delayChildren: 0.3 }
                                    }
                                }}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true }}
                            >
                                <TrustBadge icon={<ShieldCheck size={28} />} text="Certified Labs" />
                                <TrustBadge icon={<UserCheck size={28} />} text="Expert Staff" />
                                <TrustBadge icon={<Clock size={28} />} text="Fast Results" />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <div style={{ height: '4rem' }} />
        </motion.div>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <motion.div 
            className="glass-panel"
            variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 }
            }}
            whileHover={{ 
                y: -10,
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                borderColor: 'var(--primary)'
            }}
            style={{ 
                padding: '2.5rem', borderRadius: '24px', textAlign: 'center', 
                background: 'white', border: '1px solid transparent', transition: 'all 0.3s ease'
            }}
        >
            <div style={{ 
                width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-light)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
                color: 'var(--primary)'
            }}>
                {React.cloneElement(icon, { size: 30 })}
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.75rem' }}>{title}</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6 }}>{desc}</p>
        </motion.div>
    );
}

function TrustBadge({ icon, text }) {
    return (
        <motion.div 
            variants={{
                hidden: { opacity: 0, scale: 0.8 },
                show: { opacity: 1, scale: 1 }
            }}
            whileHover={{ scale: 1.1, color: '#10b981' }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'default' }}
        >
            <div style={{ color: '#10b981' }}>{icon}</div>
            <span style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: '0.02em' }}>{text}</span>
        </motion.div>
    );
}

export default LabTests;

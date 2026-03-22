import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Hash, Clock, User, CheckCircle, AlertCircle, Phone, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Doctors.css'; // Reusing some doctor styles

function TokenStatus() {
    const { appointments, fetchData } = useApp();
    const [searchPhone, setSearchPhone] = useState('');
    const [foundAppointments, setFoundAppointments] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setIsSearching(true);
        
        // Fetch fresh data from context to make sure we see latest tokens
        await fetchData();
        
        // Use a small timeout to let state re-sync if needed (though context should be enough)
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
        }, 300);
    };

    return (
        <div className="token-status-page" style={{ padding: '2rem 0', minHeight: '80vh' }}>
            <div className="container" style={{ maxWidth: '600px' }}>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel" 
                    style={{ padding: '2.5rem', borderRadius: '24px', textAlign: 'center' }}
                >
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ 
                            width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-light)', 
                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            margin: '0 auto 1rem' 
                        }}>
                            <Hash size={32} />
                        </div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Track Your <span className="gradient-text">Token</span></h1>
                        <p className="text-muted">Enter your registered phone number to view your appointment token details.</p>
                    </div>

                    <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="input-group" style={{ marginBottom: 0 }}>
                            <div className="icon-input-wrapper">
                                <Phone size={20} className="input-icon text-muted" />
                                <input 
                                    type="tel" 
                                    className="input-field with-icon" 
                                    placeholder="Enter Phone Number (e.g. 9876543210)"
                                    value={searchPhone}
                                    onChange={(e) => setSearchPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block" disabled={isSearching}>
                            {isSearching ? 'Searching...' : 'Check Status'}
                        </button>
                    </form>
                </motion.div>

                <div style={{ marginTop: '2rem' }}>
                    <AnimatePresence mode="wait">
                        {foundAppointments === null ? null : foundAppointments.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-panel"
                                style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}
                            >
                                <AlertCircle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                <h3>No Appointments Found</h3>
                                <p>We couldn't find any appointments linked to this number. Please check the number or contact us if you need help.</p>
                            </motion.div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {foundAppointments.map((apt, idx) => (
                                    <motion.div 
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="glass-panel"
                                        style={{ padding: '2rem', borderRadius: '20px', borderLeft: '6px solid var(--primary)' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                            <div>
                                                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>{apt.doctorName}</h3>
                                                <span className="status-badge confirmed">{apt.status}</span>
                                            </div>
                                            {apt.token_number ? (
                                                <div style={{ textAlign: 'right' }}>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Your Token</span>
                                                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>#{apt.token_number}</div>
                                                </div>
                                            ) : (
                                                <div style={{ textAlign: 'right' }}>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Status</span>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent)', marginTop: '4px' }}>WAITING FOR TOKEN</div>
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <User size={18} className="text-primary" />
                                                <div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Patient</div>
                                                    <div style={{ fontWeight: 600 }}>{apt.patientName}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <Calendar size={18} className="text-primary" />
                                                <div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date</div>
                                                    <div style={{ fontWeight: 600 }}>{apt.date}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    Please arrive 15 minutes before your scheduled timing.
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

export default TokenStatus;

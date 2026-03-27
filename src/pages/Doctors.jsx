import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Star, User, X, CheckCircle, Hash, Hand } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import EmergencyBanner from '../components/EmergencyBanner';
import './Doctors.css';

// Default image if none exists (moved outside for DoctorCard to use)
const getDefaultImage = (idx) => {
    const fallbacks = [
        'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=300&h=300',
        'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
        'https://images.unsplash.com/photo-1594824436951-7f1262d04840?auto=format&fit=crop&q=80&w=300&h=300',
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300'
    ];
    return fallbacks[idx % fallbacks.length];
};

const DoctorCard = memo(({ doc, idx, onSelect, fetchImage }) => {
    const [imageSrc, setImageSrc] = useState(doc.image_base64 || getDefaultImage(idx));

    useEffect(() => {
        if (!doc.image_base64 && doc.id) {
            fetchImage(doc.id).then(base64Image => {
                if (base64Image) {
                    setImageSrc(base64Image);
                }
            });
        }
    }, [doc.id, doc.image_base64, fetchImage]);

    return (
        <motion.div
            className="doctor-card glass-panel"
            whileHover={{ y: -5, boxShadow: 'var(--shadow-lg)' }}
        >
            <div className="doc-img-wrapper">
                <img src={imageSrc} alt={doc.name} className="doc-image" />
                <div className="doc-exp-badge">{doc.experience}</div>
            </div>

            <div className="doc-info" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 className="doc-name" style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.5rem 0' }}>{doc.name.toUpperCase()}</h3>
                <div className="doc-specialty-badge" style={{
                    background: '#f0fdfa', color: '#0d9488', padding: '4px 12px',
                    borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700,
                    marginBottom: '1rem', border: '1px solid #ccfbf1'
                }}>
                    {doc.specialty.toUpperCase()}
                </div>

                <p className="doc-about text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                    {doc.about || "Expert clinical consultant specializing in advanced healthcare and patient care."}
                </p>

                {doc.reg_no && (
                    <p className="doc-reg text-muted" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                        REG NO: {doc.reg_no}
                    </p>
                )}

                <button
                    className="btn btn-primary btn-block mt-auto"
                    onClick={() => onSelect(doc)}
                    style={{
                        borderRadius: '12px', padding: '12px', fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '8px', width: '100%', border: 'none'
                    }}
                >
                    <Calendar size={18} /> BOOK APPOINTMENT
                </button>
            </div>
        </motion.div>
    );
});

function Doctors() {
    const { addAppointment, doctors, loading, fetchDoctorImage } = useApp();
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [bookingFormData, setBookingFormData] = useState({
        patientName: '',
        date: '',
        phone: '',
        reason: ''
    });
    const [bookingSuccess, setBookingSuccess] = useState(false);

    const handleInputChange = (e) => {
        setBookingFormData({
            ...bookingFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleBookingSubmit = (e) => {
        e.preventDefault();
        addAppointment({
            doctorId: selectedDoctor.id,
            doctorName: selectedDoctor.name,
            ...bookingFormData,
            time: `${selectedDoctor.availability_start || '06:00 PM'} - ${selectedDoctor.availability_end || '10:00 PM'}`
        });

        setBookingSuccess(true);
        setTimeout(() => {
            setBookingSuccess(false);
            setSelectedDoctor(null);
            setBookingFormData({ patientName: '', date: '', phone: '', reason: '' });
        }, 3000);
    };

    return (
        <motion.div 
            className="doctors-page"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <EmergencyBanner />
            <section className="docs-header section-padding">
                <div className="container text-center">
                    <motion.h1 
                        className="title"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Our <span className="gradient-text">Specialists</span>
                    </motion.h1>
                    <p className="subtitle" style={{ marginTop: '1rem', maxWidth: '600px', margin: '1rem auto 0' }}>
                        Book appointments with our top-rated specialists or track your current status below.
                    </p>
                    <div style={{ marginTop: '2rem' }}>
                        <motion.div
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            style={{ display: 'inline-block' }}
                        >
                            <Link to="/tokens" className="btn btn-primary" style={{ 
                                display: 'inline-flex', alignItems: 'center', gap: '14px', 
                                padding: '12px 28px', borderRadius: '18px', textDecoration: 'none', 
                                boxShadow: '0 8px 30px rgba(5, 150, 105, 0.25)',
                                background: 'linear-gradient(135deg, #10b981, #059669)'
                            }}>
                                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '12px' }}>
                                    <Hash size={24} color="white" />
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ color: 'white', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.5px' }}>CHECK LIVE TOKEN STATUS</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'rgba(255,255,255,0.9)', letterSpacing: '1px' }}>TAP HERE</span>
                                        <motion.div
                                            animate={{ x: [0, 4, 0] }}
                                            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                                        >
                                            <Hand size={14} color="white" fill="white" fillOpacity={0.2} />
                                        </motion.div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="docs-list section-padding pt-0">
                <div className="container">
                    {loading ? (
                        <div className="text-center py-8">Loading Doctors...</div>
                    ) : (
                        <div className="doctors-grid">
                            {doctors.map((doc, idx) => (
                                <DoctorCard 
                                    key={doc.id} 
                                    doc={doc} 
                                    idx={idx} 
                                    onSelect={setSelectedDoctor} 
                                    fetchImage={fetchDoctorImage}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <AnimatePresence>
                {selectedDoctor && (
                    <div className="modal-overlay">
                        <motion.div
                            className="modal-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedDoctor(null)}
                        />
                        <motion.div
                            className="modal-content doctor-modal"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        >
                            <button className="modal-close" onClick={() => setSelectedDoctor(null)}>
                                <X size={24} />
                            </button>

                            <div className="modal-grid">
                                {/* Left Profile Side */}
                                <div className="doc-profile-side">
                                    <img src={selectedDoctor.image_base64 || getDefaultImage(doctors.findIndex(d => d.id === selectedDoctor.id))} alt={selectedDoctor.name} className="profile-img" />
                                    <h2 className="profile-name">{selectedDoctor.name}</h2>
                                    <p className="profile-specialty text-primary">{selectedDoctor.specialty}</p>

                                    <div className="profile-about">
                                        <h4>About</h4>
                                        <p>{selectedDoctor.about}</p>
                                    </div>

                                    <div className="profile-reviews-section">
                                        <h4>Patient Reviews</h4>
                                        <div className="reviews-list">
                                            {/* Static fallback reviews since it's not in DB schema yet */}
                                            <div className="review-item">
                                                <div className="review-header">
                                                    <span className="review-author">Verified Patient</span>
                                                    <span className="review-date text-muted">2 weeks ago</span>
                                                </div>
                                                <div className="review-stars">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                                                    ))}
                                                </div>
                                                <p className="review-text">Great and attentive doctor. Highly recommend!</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Booking Side */}
                                <div className="doc-booking-side bg-surface-dark">
                                    {bookingSuccess ? (
                                        <div className="booking-success-state text-center">
                                            <CheckCircle size={64} className="text-primary mb-4" />
                                            <h3>Booking Confirmed!</h3>
                                            <p className="text-muted mt-2">Your appointment has been successfully scheduled. We look forward to seeing you.</p>
                                        </div>
                                    ) : (
                                        <>
                                            <h3 className="mb-4">Book Appointment</h3>
                                            
                                            {/* Doctor Availability Info */}
                                            <div className="doctor-availability-notice">
                                                <div className="availability-icon-wrapper">
                                                    <Clock size={20} />
                                                </div>
                                                <div>
                                                    <strong>Doctor Available</strong>
                                                    <p className="avail-time">{selectedDoctor.availability_start || '06:00 PM'} — {selectedDoctor.availability_end || '10:00 PM'}</p>
                                                    <span className="avail-note">Token will be assigned by the admin after booking.</span>
                                                </div>
                                            </div>

                                            <form onSubmit={handleBookingSubmit} className="booking-form">
                                                <div className="input-group">
                                                    <label className="input-label">Patient Name</label>
                                                    <input
                                                        type="text"
                                                        name="patientName"
                                                        required
                                                        className="input-field"
                                                        placeholder="Full Name"
                                                        value={bookingFormData.patientName}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>

                                                <div className="input-group">
                                                    <label className="input-label">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        required
                                                        className="input-field"
                                                        placeholder="Contact Number"
                                                        value={bookingFormData.phone}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>

                                                <div className="input-group">
                                                    <label className="input-label">Date</label>
                                                    <div className="icon-input-wrapper">
                                                        <Calendar size={18} className="input-icon text-muted" />
                                                        <input
                                                            type="date"
                                                            name="date"
                                                            required
                                                            className="input-field with-icon"
                                                            value={bookingFormData.date}
                                                            onChange={handleInputChange}
                                                            min={new Date().toISOString().split('T')[0]}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="input-group">
                                                    <label className="input-label">Reason for Visit</label>
                                                    <textarea
                                                        name="reason"
                                                        className="input-field"
                                                        rows="3"
                                                        placeholder="Briefly describe your symptoms..."
                                                        value={bookingFormData.reason}
                                                        onChange={handleInputChange}
                                                    ></textarea>
                                                </div>

                                                <div className="form-notice">
                                                    <MapPin size={16} className="text-primary" />
                                                    <span>Appointment Location: Guardian Pharmacy / Hospital at Thiruvarur.</span>
                                                </div>

                                                <button type="submit" className="btn btn-primary btn-block mt-4">
                                                    Confirm Booking
                                                </button>
                                            </form>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default Doctors;

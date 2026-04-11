import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Star, User, X, CheckCircle, Hash, Hand } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const { addAppointment, doctors, loading, fetchDoctorImage, user } = useApp();
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [bookingFormData, setBookingFormData] = useState({
        patientName: '',
        date: '',
        phone: '',
        reason: ''
    });
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [dateError, setDateError] = useState('');

    // Lock body scroll when modal is open
    useEffect(() => {
        if (selectedDoctor) {
            document.body.classList.add('modal-open');
            document.documentElement.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
            document.documentElement.classList.remove('modal-open');
        }
        return () => {
            document.body.classList.remove('modal-open');
            document.documentElement.classList.remove('modal-open');
        };
    }, [selectedDoctor]);

    const handleDoctorSelect = (doc) => {
        if (!user) {
            navigate('/signin', { state: { from: '/doctors' } });
            return;
        }
        setSelectedDoctor(doc);
    };

    const closeModal = () => {
        setSelectedDoctor(null);
        setBookingSuccess(false);
        setShowQR(false);
        setBookingFormData({ patientName: '', date: '', phone: '', reason: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'date') {
            const selectedDate = new Date(value);
            if (selectedDate.getDay() === 0) {
                setDateError(<>Sunday is a Holiday. For any Emergency Call us now: <strong>094874 69098</strong></>);
                setBookingFormData({ ...bookingFormData, date: '' });
                return;
            } else {
                setDateError('');
            }
        }
        
        setBookingFormData({
            ...bookingFormData,
            [name]: value
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
        // After 2 seconds show the QR payment screen
        setTimeout(() => {
            setShowQR(true);
        }, 2000);
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
                        Guardian <span className="gradient-text">Pharmacy & Clinic</span>
                    </motion.h1>
                    <p className="subtitle" style={{ marginTop: '1rem', maxWidth: '600px', margin: '1rem auto 0' }}>
                        Book appointments with our team of expert specialists at Thiruvarur.
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
                                    onSelect={handleDoctorSelect}
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
                            <button className="modal-close" onClick={closeModal}>
                                <X size={24} />
                            </button>

                            <div className="modal-grid">
                                {/* Left Profile Side */}
                                <div className="doc-profile-side">
                                    <img src={selectedDoctor.image_base64 || getDefaultImage(doctors.findIndex(d => d.id === selectedDoctor.id))} alt={selectedDoctor.name} className="profile-img" />
                                    <h2 className="profile-name">{selectedDoctor.name}</h2>
                                    <p className="profile-specialty">{selectedDoctor.specialty}</p>

                                    <div className="profile-about">
                                        <h4>About</h4>
                                        <p>{selectedDoctor.about}</p>
                                    </div>

                                    {/* Patient reviews have been removed as requested */}
                                </div>

                                {/* Right Booking Side */}
                                <div className="doc-booking-side">
                                    {bookingSuccess ? (
                                        <AnimatePresence mode="wait">
                                            {!showQR ? (
                                                <motion.div
                                                    key="confirm"
                                                    className="booking-success-state text-center"
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                >
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                                                    >
                                                        <CheckCircle size={72} color="#0d9488" style={{ marginBottom: '1rem' }} />
                                                    </motion.div>
                                                    <h3 style={{ color: '#0f172a', fontWeight: 800 }}>Booking Confirmed! 🎉</h3>
                                                    <p className="text-muted mt-2" style={{ fontSize: '0.9rem' }}>
                                                        Preparing your payment QR...
                                                    </p>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="qr"
                                                    className="qr-payment-screen"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0 }}
                                                >
                                                    <div className="qr-header">
                                                        <CheckCircle size={22} color="#0d9488" />
                                                        <span>Booked for <strong>{bookingFormData.patientName}</strong></span>
                                                    </div>
                                                    <h3 className="qr-title">Complete Your Payment</h3>
                                                    <div className="qr-fee-badge">
                                                        <span className="qr-fee-label">Consultation Fee</span>
                                                        <span className="qr-fee-amount">₹250</span>
                                                    </div>
                                                    <p className="qr-subtitle">Scan the QR below via Paytm / any UPI app to confirm your slot</p>

                                                    <div className="qr-image-wrapper">
                                                        <img
                                                            src="/paytm-qr.jpg"
                                                            alt="Paytm QR Code"
                                                            className="qr-image"
                                                        />
                                                        <div className="qr-label">Paytm · UPI · GPay · PhonePe</div>
                                                    </div>

                                                    <p className="qr-note">💡 Your token will be assigned by the admin once payment is verified.</p>

                                                     <div className="qr-actions">
                                                        <button
                                                            className="btn btn-primary btn-block"
                                                            onClick={closeModal}
                                                            style={{ background: '#0d9488', border: 'none', borderRadius: '14px', padding: '14px', fontWeight: 800 }}
                                                        >
                                                            ✅ Done, I've Paid
                                                        </button>
                                                        
                                                        {/* WhatsApp Help Button with Animation */}
                                                        <motion.a
                                                            href="https://wa.me/919487469098?text=I%20need%20help%20with%20my%20appointment%20payment%20verification"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="qr-help-wa-btn"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 0.5 }}
                                                        >
                                                            <motion.div
                                                                className="wa-pulse-circle"
                                                                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                                                                transition={{ repeat: Infinity, duration: 2 }}
                                                            />
                                                            <div className="wa-icon-container">
                                                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                                </svg>
                                                                <span>Payment Help</span>
                                                            </div>
                                                        </motion.a>

                                                        <Link
                                                            to="/tokens"
                                                            style={{ display: 'block', textAlign: 'center', marginTop: '1rem', color: '#0d9488', fontWeight: 700, fontSize: '0.85rem' }}
                                                            onClick={closeModal}
                                                        >
                                                            Check Live Token Status →
                                                        </Link>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    ) : (
                                        <>
                                            <h3 className="mb-4">Book Appointment</h3>

                                            {/* Doctor Availability Info */}
                                            <div className="doctor-availability-notice">
                                                <div className="availability-icon-wrapper">
                                                    <Clock size={24} />
                                                </div>
                                                <div>
                                                    <strong>Doctor Available</strong>
                                                    <p className="avail-time">{selectedDoctor.availability_start || '06:00 PM'} — {selectedDoctor.availability_end || '10:00 PM'}</p>
                                                    <span className="avail-note">Consultation Fee: <strong style={{ color: '#0d9488' }}>₹250</strong> · Token assigned by admin after payment.</span>
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
                                                            className={`input-field with-icon ${dateError ? 'error-border' : ''}`}
                                                            value={bookingFormData.date}
                                                            onChange={handleInputChange}
                                                            min={new Date().toISOString().split('T')[0]}
                                                        />
                                                    </div>
                                                    {dateError && <p className="error-text" style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, marginTop: '4px' }}>{dateError}</p>}
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
                                                    <span>Appointment Location: Guardian Pharmacy / Clinic at Thiruvarur.</span>
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

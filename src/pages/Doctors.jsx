import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Star, User, X, CheckCircle, Hash, Hand, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

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
            className="doctor-card custom-doc-card"
            whileHover={{ y: -5, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
        >
            <div className="doc-img-wrapper">
                <img src={imageSrc} alt={doc.name} className="doc-image" />
            </div>

            <div className="doc-info">
                <h3 className="doc-name">{doc.name.toUpperCase()}</h3>

                <div className="doc-specialty-wrapper">
                    <span className="doc-specialty-badge">
                        {doc.specialty.toUpperCase()}
                    </span>
                </div>

                <p className="doc-about-reg">
                    {doc.about && doc.about.toUpperCase()} {doc.reg_no && `REG NO: ${doc.reg_no}`}
                </p>

                <button
                    className="doc-book-btn mt-auto"
                    onClick={() => onSelect(doc)}
                >
                    <Calendar size={16} /> BOOK APPOINTMENT
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
        reason: '',
        selectedSlot: ''
    });
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [dateError, setDateError] = useState('');
    const [timeLeft, setTimeLeft] = useState(300);

    useEffect(() => {
        let timer;
        if (showQR) {
            setTimeLeft(300);
            timer = setInterval(() => {
                setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [showQR]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

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

        // Pre-fill today's date
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;

        // Auto-select slot 1 if it's the only one
        const slot1 = `${doc.availability_start || '06:00 PM'} - ${doc.availability_end || '10:00 PM'}`;
        const defaultSlot = (!doc.availability_start_2 || !doc.availability_end_2) ? slot1 : '';

        setBookingFormData({
            patientName: '',
            date: todayStr,
            phone: '',
            reason: '',
            selectedSlot: defaultSlot
        });

        // Check if today is Sunday
        if (today.getDay() === 0) {
            setDateError(<>Sunday is a Holiday. For any Emergency Call us now: <a href="tel:09487469098" className="contact-link"><strong>094874 69098</strong></a></>);
            setBookingFormData(prev => ({ ...prev, date: '' }));
        } else {
            setDateError('');
        }
    };

    const closeModal = () => {
        setSelectedDoctor(null);
        setBookingSuccess(false);
        setShowQR(false);
        setBookingFormData({ patientName: '', date: '', phone: '', reason: '', selectedSlot: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'date') {
            const selectedDate = new Date(value);
            if (selectedDate.getDay() === 0) {
                setDateError(<>Sunday is a Holiday. For any Emergency Call us now: <a href="tel:09487469098" className="contact-link"><strong>094874 69098</strong></a></>);
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

        if (!bookingFormData.selectedSlot) {
            alert("Please select an availability slot before confirming.");
            return;
        }

        addAppointment({
            doctorId: selectedDoctor.id,
            doctorName: selectedDoctor.name,
            ...bookingFormData,
            time: bookingFormData.selectedSlot
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

            {/* --- NEW PREMIUM HERO SECTION --- */}
            <section className="docs-hero">
                <div className="hero-pattern"></div>
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    width: '100%',
                    maxWidth: '1280px',
                    margin: '0 auto',
                    padding: '0 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                }}>
                    <motion.h1
                        className="hero-title"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Meet Our <span className="highlight">Medical Experts</span>
                    </motion.h1>
                    <motion.p
                        className="docs-hero-sub"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Click <span className="bold-gold">Book Appointment</span> to schedule a consultation with our specialists.
                        <br />
                        <motion.div
                            className="hero-action"
                            style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', marginTop: '20px' }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Link to="/tokens" className="live-token-btn">
                                <motion.div
                                    className="token-icon-box"
                                    animate={{ rotate: [0, 15, -15, 0] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                >
                                    <Hash size={20} color="white" />
                                </motion.div>
                                <div className="token-text-content">
                                    <span className="token-label">CHECK LIVE TOKEN STATUS</span>
                                    <div className="token-subtext">
                                        <span>TAP HERE</span>
                                        <motion.div
                                            animate={{ y: [0, -4, 0] }}
                                            transition={{ repeat: Infinity, duration: 1 }}
                                        >
                                            <Hand size={14} color="white" fill="white" />
                                        </motion.div>
                                    </div>
                                </div>
                                <div className="live-indicator">
                                    <div className="live-dot"></div>
                                    <div className="live-pulse"></div>
                                </div>
                            </Link>
                        </motion.div>
                    </motion.p>


                </div>
            </section>

            {/* --- SPECIALISTS INFO CARD --- */}
            <section className="specialists-info-section">
                <div className="container">
                    <motion.div
                        className="specialists-card"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        <div className="card-left">
                            <h2 className="card-title">Our Specialists</h2>
                            <div className="title-underline"></div>
                            <p className="card-description">
                                Highly experienced doctors and dedicated staff ensuring round-the-clock quality care.
                            </p>
                        </div>
                        <div className="card-right">
                            <div className="availability-badge">
                                <User size={18} />
                                <span>{doctors.length} Specialists Available</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="docs-list section-padding" style={{ paddingTop: '1rem' }}>
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
                                                    style={{ padding: '2rem 1rem' }}
                                                >
                                                    <motion.div
                                                        initial={{ scale: 0, rotate: -15 }}
                                                        animate={{ scale: 1, rotate: 0 }}
                                                        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                                                        style={{
                                                            width: '80px',
                                                            height: '80px',
                                                            background: '#f0fdf4',
                                                            borderRadius: '50%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            margin: '0 auto 1.5rem',
                                                            border: '4px solid #ccfbf1'
                                                        }}
                                                    >
                                                        <CheckCircle size={48} color="#10b981" fill="#10b981" fillOpacity={0.1} />
                                                    </motion.div>

                                                    {/* 🚀 Rocket Takeoff Animation */}
                                                    <div style={{
                                                        position: 'relative',
                                                        height: '90px',
                                                        overflow: 'hidden',
                                                        width: '60px',
                                                        margin: '0 auto 0.5rem'
                                                    }}>
                                                        <motion.div
                                                            animate={{
                                                                y: [60, 0, -120],
                                                                opacity: [0, 1, 0],
                                                                scale: [0.6, 1, 0.8]
                                                            }}
                                                            transition={{
                                                                duration: 2,
                                                                ease: ['easeIn', 'easeIn', 'easeIn'],
                                                                repeat: Infinity,
                                                                repeatDelay: 1.5,
                                                                times: [0, 0.35, 1]
                                                            }}
                                                            style={{
                                                                fontSize: '2.5rem',
                                                                display: 'block',
                                                                textAlign: 'center',
                                                                filter: 'drop-shadow(0 4px 12px rgba(16,185,129,0.5))'
                                                            }}
                                                        >
                                                            🚀
                                                        </motion.div>
                                                        {/* Flame trail */}
                                                        <motion.div
                                                            animate={{
                                                                y: [80, 20, -110],
                                                                opacity: [0, 0.7, 0],
                                                                scaleY: [0.3, 1, 0.2]
                                                            }}
                                                            transition={{
                                                                duration: 2,
                                                                ease: 'easeIn',
                                                                repeat: Infinity,
                                                                repeatDelay: 1.5,
                                                                times: [0, 0.35, 1]
                                                            }}
                                                            style={{
                                                                position: 'absolute',
                                                                left: '50%',
                                                                transform: 'translateX(-50%)',
                                                                fontSize: '1.2rem',
                                                                textAlign: 'center',
                                                                top: '10px'
                                                            }}
                                                        >
                                                            🔥
                                                        </motion.div>
                                                    </div>

                                                    <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.75rem', color: '#0d9488', letterSpacing: '-0.02em' }}>
                                                        Booking Confirmed!
                                                    </h2>

                                                    <p style={{ fontSize: '1.05rem', color: '#64748b', fontWeight: 500, lineHeight: 1.5, marginBottom: '1.5rem' }}>
                                                        Thank you for choosing Guardian Clinic. Our team is preparing your token details.
                                                        <br /><br />
                                                        <span style={{ color: '#0d9488', fontWeight: 700 }}>Enjoy your visit! 🧑‍⚕️🏥✨</span>
                                                    </p>

                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                                            style={{ width: '18px', height: '18px', border: '3px solid #e2e8f0', borderTopColor: '#0d9488', borderRadius: '50%' }}
                                                        />
                                                        <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Preparing payment QR...</span>
                                                    </div>
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
                                                    <p className="qr-subtitle">Scan the QR code to pay, or click the QR code to open your payment app.</p>

                                                    <div className="qr-image-wrapper" style={{ position: 'relative' }}>
                                                        <a
                                                            href={`upi://pay?pa=paytmqr5j6flc@ptys&pn=Guardian%20Clinic&mc=0000&mode=02&purpose=00&am=250&cu=INR&tn=Appointment%20for%20${bookingFormData.patientName}`}
                                                            className="qr-link"
                                                            style={{ textDecoration: 'none', display: 'block', position: 'relative' }}
                                                        >
                                                            <img
                                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=10&data=${encodeURIComponent(`upi://pay?pa=paytmqr5j6flc@ptys&pn=Guardian%20Clinic&mc=0000&mode=02&purpose=00&am=250&cu=INR&tn=Appointment%20for%20${bookingFormData.patientName}`)}`}
                                                                alt="Paytm QR Code"
                                                                className="qr-image"
                                                                style={{ cursor: 'pointer', width: '200px', height: '200px', borderRadius: '12px', display: 'block', margin: '0 auto' }}
                                                            />


                                                            <div className="qr-label">Paytm · UPI · GPay · PhonePe</div>
                                                            <div className="upi-id-display"
                                                                style={{
                                                                    marginTop: '8px', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b',
                                                                    background: '#f1f5f9', padding: '10px 12px', borderRadius: '12px',
                                                                    border: '1.5px solid #e2e8f0', display: 'flex', flexDirection: 'column',
                                                                    alignItems: 'center', gap: '4px', cursor: 'pointer', position: 'relative'
                                                                }}
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    navigator.clipboard.writeText('paytmqr5j6flc@ptys');
                                                                    alert('UPI ID copied to clipboard!');
                                                                }}
                                                            >
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>TAP TO COPY UPI ID</span>

                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                    <span style={{ color: '#0d9488' }}>paytmqr5j6flc@ptys</span>
                                                                    <Sparkles size={14} color="#0d9488" />
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </div>

                                                    <div style={{ marginTop: '12px', marginBottom: '16px', width: '100%', maxWidth: '200px' }}>
                                                        <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, marginBottom: '6px', textAlign: 'center' }}>
                                                            QR valid for <span style={{ color: '#0d9488', fontVariantNumeric: 'tabular-nums' }}>{formatTime(timeLeft)}</span> minutes
                                                        </div>
                                                        <div style={{ width: '100%', height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                                                            <motion.div
                                                                initial={{ width: '100%' }}
                                                                animate={{ width: `${(timeLeft / 300) * 100}%` }}
                                                                transition={{ duration: 1, ease: 'linear' }}
                                                                style={{ height: '100%', background: '#0d9488' }}
                                                            />
                                                        </div>
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
                                                    <div className="avail-slots-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '0.5rem' }}>
                                                        <button
                                                            type="button"
                                                            className={`slot-select-btn ${bookingFormData.selectedSlot === `${selectedDoctor.availability_start || '06:00 PM'} - ${selectedDoctor.availability_end || '10:00 PM'}` ? 'active' : ''}`}
                                                            onClick={() => setBookingFormData({ ...bookingFormData, selectedSlot: `${selectedDoctor.availability_start || '06:00 PM'} - ${selectedDoctor.availability_end || '10:00 PM'}` })}
                                                        >
                                                            <div className="slot-check">
                                                                <CheckCircle size={14} />
                                                            </div>
                                                            <span className="slot-time">
                                                                {selectedDoctor.availability_start || '06:00 PM'} - {selectedDoctor.availability_end || '10:00 PM'}
                                                            </span>
                                                            <span className="slot-label">Slot 1</span>
                                                        </button>

                                                        {selectedDoctor.availability_start_2 && selectedDoctor.availability_end_2 && (
                                                            <button
                                                                type="button"
                                                                className={`slot-select-btn ${bookingFormData.selectedSlot === `${selectedDoctor.availability_start_2} - ${selectedDoctor.availability_end_2}` ? 'active' : ''}`}
                                                                onClick={() => setBookingFormData({ ...bookingFormData, selectedSlot: `${selectedDoctor.availability_start_2} - ${selectedDoctor.availability_end_2}` })}
                                                                style={{ borderColor: bookingFormData.selectedSlot === `${selectedDoctor.availability_start_2} - ${selectedDoctor.availability_end_2}` ? '#b45309' : '#fde68a' }}
                                                            >
                                                                <div className="slot-check" style={{ background: bookingFormData.selectedSlot === `${selectedDoctor.availability_start_2} - ${selectedDoctor.availability_end_2}` ? '#b45309' : 'transparent' }}>
                                                                    <CheckCircle size={14} />
                                                                </div>
                                                                <span className="slot-time" style={{ color: bookingFormData.selectedSlot === `${selectedDoctor.availability_start_2} - ${selectedDoctor.availability_end_2}` ? '#b45309' : '#a16207' }}>
                                                                    {selectedDoctor.availability_start_2} - {selectedDoctor.availability_end_2}
                                                                </span>
                                                                <span className="slot-label" style={{ color: '#b45309' }}>Slot 2</span>
                                                            </button>
                                                        )}
                                                    </div>
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

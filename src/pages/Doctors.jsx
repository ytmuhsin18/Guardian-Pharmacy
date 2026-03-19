import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Star, User, X, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import EmergencyBanner from '../components/EmergencyBanner';
import './Doctors.css';

function Doctors() {
    const { addAppointment, doctors, loading } = useApp();
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

    // Default image if none exists
    const getDefaultImage = (idx) => {
        const fallbacks = [
            'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=300&h=300',
            'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
            'https://images.unsplash.com/photo-1594824436951-7f1262d04840?auto=format&fit=crop&q=80&w=300&h=300',
            'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300'
        ];
        return fallbacks[idx % fallbacks.length];
    };

    return (
        <div className="doctors-page">
            <EmergencyBanner />
            <section className="docs-header section-padding">
                <div className="container text-center">
                    <h1 className="title">Our <span className="gradient-text">Specialists</span></h1>
                    <p className="subtitle" style={{ marginTop: '1rem', maxWidth: '600px', margin: '1rem auto 0' }}>
                        Book a home appointment to visit our top-rated specialists at the hospital.
                    </p>
                </div>
            </section>

            <section className="docs-list section-padding pt-0">
                <div className="container">
                    {loading ? (
                        <div className="text-center py-8">Loading Doctors...</div>
                    ) : (
                        <div className="doctors-grid">
                            {doctors.map((doc, idx) => (
                                <motion.div
                                    key={doc.id}
                                    className="doctor-card glass-panel"
                                    whileHover={{ y: -5, boxShadow: 'var(--shadow-lg)' }}
                                >
                                    <div className="doc-img-wrapper">
                                        <img src={doc.image_base64 || getDefaultImage(idx)} alt={doc.name} className="doc-image" />
                                        <div className="doc-exp-badge">{doc.experience}</div>
                                    </div>

                                    <div className="doc-info">
                                        <h3 className="doc-name">{doc.name}</h3>
                                        <p className="doc-specialty text-primary">{doc.specialty}</p>

                                        {/* Availability Badge */}
                                        <div className="doc-availability-info">
                                            <Clock size={14} className="text-primary" />
                                            <span>Available: {doc.availability_start || '06:00 PM'} - {doc.availability_end || '10:00 PM'}</span>
                                        </div>

                                        <div className="doc-stats">
                                            <div className="stat">
                                                <Star size={16} fill="#f59e0b" className="text-accent" />
                                                <span>4.9</span>
                                            </div>
                                            <div className="stat">
                                                <User size={16} className="text-muted" />
                                                <span>10+ Reviews</span>
                                            </div>
                                        </div>

                                        <button
                                            className="btn btn-outline btn-block mt-4"
                                            onClick={() => setSelectedDoctor(doc)}
                                        >
                                            View Profile & Book
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Booking / Profile Modal */}
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
        </div>
    );
}

export default Doctors;

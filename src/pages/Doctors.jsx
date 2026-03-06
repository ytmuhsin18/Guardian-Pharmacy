import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Star, User, X, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Doctors.css';

const doctorsList = [
    {
        id: 1,
        name: 'Dr. Muralidharan',
        specialty: 'Dentist (BDS)',
        experience: 'Experienced',
        image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=300&h=300',
        about: 'Dr. Muralidharan is a highly experienced dentist dedicated to providing comprehensive dental care for families.',
        reviews: [
            { author: 'Michael T.', rating: 5, date: '2 weeks ago', text: 'Dr. Muralidharan was very attentive and quickly solved my dental issue.' },
            { author: 'Sarah K.', rating: 4, date: '1 month ago', text: 'Great dentist, very friendly and professional.' }
        ]
    },
    {
        id: 2,
        name: 'Dr. Swaminathan',
        specialty: 'MD DVL (SKIN DOCTOR)',
        experience: 'Experienced',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
        about: 'Specializing in dermatology, Dr. Swaminathan utilizes the latest diagnostic technologies for optimal skin health.',
        reviews: [
            { author: 'Robert W.', rating: 5, date: '3 days ago', text: 'Excellent skin specialist. Explained everything clearly.' }
        ]
    },
    {
        id: 3,
        name: 'Dr. Uma maheswaran',
        specialty: 'Ortho (MS ORTHO D ORTHO)',
        experience: 'Experienced',
        image: 'https://images.unsplash.com/photo-1594824436951-7f1262d04840?auto=format&fit=crop&q=80&w=300&h=300',
        about: 'Expert orthopedist passionate about providing excellent orthopedic care and joint health treatments.',
        reviews: [
            { author: 'Laura M.', rating: 5, date: '1 week ago', text: 'My joint pain is much better. He is so patient and kind.' },
            { author: 'Daniel H.', rating: 5, date: '2 months ago', text: 'Highly recommend for any orthopedic needs.' }
        ]
    },
    {
        id: 4,
        name: 'Dr. Pragadeesh',
        specialty: 'MD',
        experience: 'Experienced',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
        about: 'Dr. PragaDees is a dedicated general physician providing comprehensive healthcare and medical guidance.',
        reviews: [
            { author: 'John D.', rating: 5, date: '3 weeks ago', text: 'Very attentive and professional doctor.' }
        ]
    }
];

function Doctors() {
    const { addAppointment } = useApp();
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [bookingFormData, setBookingFormData] = useState({
        patientName: '',
        date: '',
        time: '',
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
            ...bookingFormData
        });

        setBookingSuccess(true);
        setTimeout(() => {
            setBookingSuccess(false);
            setSelectedDoctor(null);
            setBookingFormData({ patientName: '', date: '', time: '', phone: '', reason: '' });
        }, 3000);
    };

    return (
        <div className="doctors-page">
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
                    <div className="doctors-grid">
                        {doctorsList.map((doc) => (
                            <motion.div
                                key={doc.id}
                                className="doctor-card glass-panel"
                                whileHover={{ y: -5, boxShadow: 'var(--shadow-lg)' }}
                            >
                                <div className="doc-img-wrapper">
                                    <img src={doc.image} alt={doc.name} className="doc-image" />
                                    <div className="doc-exp-badge">{doc.experience}</div>
                                </div>

                                <div className="doc-info">
                                    <h3 className="doc-name">{doc.name}</h3>
                                    <p className="doc-specialty text-primary">{doc.specialty}</p>

                                    <div className="doc-stats">
                                        <div className="stat">
                                            <Star size={16} fill="#f59e0b" className="text-accent" />
                                            <span>4.9</span>
                                        </div>
                                        <div className="stat">
                                            <User size={16} className="text-muted" />
                                            <span>{doc.reviews.length} Reviews</span>
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
                                    <img src={selectedDoctor.image} alt={selectedDoctor.name} className="profile-img" />
                                    <h2 className="profile-name">{selectedDoctor.name}</h2>
                                    <p className="profile-specialty text-primary">{selectedDoctor.specialty}</p>

                                    <div className="profile-about">
                                        <h4>About</h4>
                                        <p>{selectedDoctor.about}</p>
                                    </div>

                                    <div className="profile-reviews-section">
                                        <h4>Patient Reviews</h4>
                                        <div className="reviews-list">
                                            {selectedDoctor.reviews.map((review, idx) => (
                                                <div key={idx} className="review-item">
                                                    <div className="review-header">
                                                        <span className="review-author">{review.author}</span>
                                                        <span className="review-date text-muted">{review.date}</span>
                                                    </div>
                                                    <div className="review-stars">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={14} fill={i < review.rating ? "#f59e0b" : "transparent"} color={i < review.rating ? "#f59e0b" : "#cbd5e1"} />
                                                        ))}
                                                    </div>
                                                    <p className="review-text">{review.text}</p>
                                                </div>
                                            ))}
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

                                                <div className="form-row">
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
                                                        <label className="input-label">TimeSlot</label>
                                                        <div className="icon-input-wrapper">
                                                            <Clock size={18} className="input-icon text-muted" />
                                                            <select
                                                                name="time"
                                                                required
                                                                className="input-field with-icon"
                                                                value={bookingFormData.time}
                                                                onChange={handleInputChange}
                                                            >
                                                                <option value="">Select Time</option>
                                                                <option value="09:00 AM">09:00 AM</option>
                                                                <option value="11:00 AM">11:00 AM</option>
                                                                <option value="02:00 PM">02:00 PM</option>
                                                                <option value="04:00 PM">04:00 PM</option>
                                                            </select>
                                                        </div>
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

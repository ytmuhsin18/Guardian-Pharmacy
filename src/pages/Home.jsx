import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Pill, Activity, Clock, ShieldCheck, ArrowRight, MapPin, Phone, Star } from 'lucide-react';
import './Home.css';
import heroImg1 from '../assets/Screenshot 2026-02-11 083435.png';
import heroImg2 from '../assets/Screenshot 2026-02-11 083832.png';
import heroImg3 from '../assets/Screenshot 2026-02-11 083955.png';
import heroImg4 from '../assets/Screenshot 2026-02-11 084037.png';

function Home() {
    const fadeInUp = {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    const staggerContainer = {
        initial: {},
        animate: {
            transition: { staggerChildren: 0.2 }
        }
    };

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-bg-accent"></div>
                <div className="container hero-content">
                    <motion.div
                        className="hero-text"
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp} className="hero-badge">
                            <Star className="text-accent" fill="#f59e0b" size={16} />
                            <span><strong>4.89</strong> Google Reviews</span>
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="hero-title">
                            Your Health is Our <br />
                            <span className="gradient-text">Top Priority</span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="hero-subtitle">
                            Welcome to Guardian Pharmacy. We provide authentic medicines delivered to your door and seamless home doctor appointments.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="hero-actions">
                            <Link to="/medicines" className="btn btn-primary btn-lg">
                                <Pill size={20} />
                                Order Medicines
                            </Link>
                            <Link to="/doctors" className="btn btn-outline btn-lg">
                                <Activity size={20} />
                                Book Appointment
                            </Link>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="hero-images"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        <div className="image-grid">
                            <motion.img
                                src={heroImg1}
                                className="grid-img img-large shadow-lg"
                                alt="Pharmacy"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            />
                            <div className="grid-column">
                                <motion.img
                                    src={heroImg2}
                                    className="grid-img shadow-md"
                                    alt="Medicine"
                                    whileHover={{ scale: 1.05 }}
                                />
                                <motion.img
                                    src={heroImg4}
                                    className="grid-img shadow-md"
                                    alt="Doctor"
                                    whileHover={{ scale: 1.05 }}
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Services Section */}
            <section className="services-section section-padding">
                <div className="container">
                    <motion.div
                        className="section-header text-center"
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                    >
                        <h2 className="title">Our <span className="gradient-text">Services</span></h2>
                        <p className="subtitle">Comprehensive healthcare solutions tailored for you.</p>
                    </motion.div>

                    <motion.div
                        className="services-grid"
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={staggerContainer}
                    >
                        <ServiceCard
                            icon={<Pill size={32} className="text-primary" />}
                            title="Authentic Medicines"
                            desc="Wide range of genuine pharmaceuticals available for immediate order and delivery."
                            link="/medicines"
                        />
                        <ServiceCard
                            icon={<Activity size={32} className="text-primary" />}
                            title="Expert Doctors"
                            desc="Book appointments with top-rated specialists and visit the hospital at your convenience."
                            link="/doctors"
                        />
                        <ServiceCard
                            icon={<Clock size={32} className="text-primary" />}
                            title="24/7 Support"
                            desc="Our pharmacy is open round the clock to cater to your urgent medical needs."
                            link="/contact"
                        />
                        <ServiceCard
                            icon={<ShieldCheck size={32} className="text-primary" />}
                            title="Secure Platform"
                            desc="Your medical data and transactions are safely secured with top-tier encryption."
                            link="/about"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Location Section */}
            <section className="location-section section-padding">
                <div className="container location-content glass-panel">
                    <motion.div
                        className="location-text"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="title">Visit Our <span className="gradient-text">Pharmacy</span></h2>
                        <p className="subtitle" style={{ marginBottom: '2rem' }}>
                            We are conveniently located in Thiruvarur. Drop by for in-person consultations or medicine pickups.
                        </p>

                        <ul className="location-details">
                            <li>
                                <div className="icon-box"><MapPin size={24} className="text-primary" /></div>
                                <div>
                                    <strong>Address</strong>
                                    <p>South Madavilagam, Vasan Nagar, Madappuram, <br />Thiruvarur, Tamil Nadu 610001</p>
                                </div>
                            </li>
                            <li>
                                <div className="icon-box"><Phone size={24} className="text-primary" /></div>
                                <div>
                                    <strong>Phone</strong>
                                    <p>094874 69098</p>
                                </div>
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div
                        className="location-map"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="map-placeholder" style={{ padding: 0, border: 'none', background: 'transparent' }}>
                            <iframe
                                src="https://maps.google.com/maps?q=10.7736818,79.6358374&t=&z=17&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0, borderRadius: '1.5rem' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Guardian Pharmacy Location"
                            ></iframe>
                        </div>
                        <a
                            href="https://maps.app.goo.gl/fEUrSfdPTmKKMLwz5"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="open-maps-btn"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            Open in Google Maps
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}

function ServiceCard({ icon, title, desc, link }) {
    return (
        <motion.div
            className="service-card glass-panel"
            variants={{
                initial: { opacity: 0, y: 30 },
                animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
            whileHover={{ y: -10, boxShadow: 'var(--shadow-lg)' }}
        >
            <div className="service-icon">{icon}</div>
            <h3 className="service-title">{title}</h3>
            <p className="service-desc">{desc}</p>
            <Link to={link} className="service-link">
                Learn More <ArrowRight size={16} />
            </Link>
        </motion.div>
    );
}

export default Home;

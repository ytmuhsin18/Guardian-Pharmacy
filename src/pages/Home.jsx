import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Pill, Activity, Clock, ShieldCheck, ArrowRight, MapPin, Phone,
    Star, Truck, TestTube, Accessibility, LayoutGrid, Stethoscope
} from 'lucide-react';
import './Home.css';
import heroImg1 from '../assets/Screenshot 2026-02-11 083435.png';
import heroImg2 from '../assets/Screenshot 2026-02-11 083832.png';
import heroImg4 from '../assets/Screenshot 2026-02-11 084037.png';

function Home() {
    const fadeInUp = {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, ease: "easeOut" }
    };

    const staggerContainer = {
        initial: {},
        animate: { transition: { staggerChildren: 0.15 } }
    };

    return (
        <div className="home-container">

            {/* ── HERO ── */}
            <section className="hero-section">
                <div className="hero-orb-1" />
                <div className="hero-orb-2" />

                <div className="container hero-content">
                    {/* LEFT: Text */}
                    <motion.div
                        className="hero-text"
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp} className="hero-badge">
                            <Star fill="#00b894" size={14} style={{ color: '#00b894' }} />
                            <span><strong>4.89</strong> Google Rating · Trusted by 10,000+ customers</span>
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="hero-title">
                            Your Health, <br />
                            <span className="gradient-text">Delivered Fast.</span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="hero-subtitle">
                            Authentic medicines, expert doctors & lab tests — all at your fingertips.
                            Guardian Pharmacy delivers care right to your door.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="hero-actions">
                            <Link to="/medicines" className="btn btn-primary btn-lg">
                                <Pill size={18} />
                                Order Medicines
                            </Link>
                            <Link to="/doctors" className="btn btn-white btn-lg">
                                <Stethoscope size={18} />
                                Book Doctor
                            </Link>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="hero-stats">
                            <div className="hero-stat">
                                <span className="stat-number">10K+</span>
                                <span className="stat-label">Happy Customers</span>
                            </div>
                            <div className="hero-stat">
                                <span className="stat-number">500+</span>
                                <span className="stat-label">Medicines</span>
                            </div>
                            <div className="hero-stat">
                                <span className="stat-number">4.89★</span>
                                <span className="stat-label">Google Rating</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* RIGHT: Images */}
                    <motion.div
                        className="hero-images"
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                    >
                        <div className="image-grid">
                            <motion.img
                                src={heroImg1}
                                className="grid-img img-large shadow-lg"
                                alt="Guardian Pharmacy"
                                whileHover={{ scale: 1.03 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            />
                            <div className="grid-column">
                                <motion.img
                                    src={heroImg2}
                                    className="grid-img shadow-md"
                                    alt="Medicine"
                                    whileHover={{ scale: 1.03 }}
                                />
                                <motion.img
                                    src={heroImg4}
                                    className="grid-img shadow-md"
                                    alt="Doctor"
                                    whileHover={{ scale: 1.03 }}
                                />
                            </div>
                        </div>

                        {/* Floating badge */}
                        <motion.div
                            className="hero-float-badge"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9, duration: 0.6 }}
                        >
                            <div className="float-icon">
                                <Truck size={20} />
                            </div>
                            <div className="float-text">
                                <strong>Free Delivery</strong>
                                <span>On orders above ₹500</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>


            {/* ── Services Section ── */}
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
                        <p className="subtitle" style={{ marginTop: '0.75rem' }}>Comprehensive healthcare solutions tailored for you.</p>
                    </motion.div>

                    <motion.div
                        className="services-grid"
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={staggerContainer}
                    >
                        <ServiceCard icon={<Pill size={28} className="text-primary" />} title="Authentic Medicines" desc="Wide range of genuine pharmaceuticals available for immediate order and delivery." link="/medicines" />
                        <ServiceCard icon={<Activity size={28} className="text-primary" />} title="Expert Doctors" desc="Book appointments with top-rated specialists and visit the hospital at your convenience." link="/doctors" />
                        <ServiceCard icon={<ShieldCheck size={28} className="text-primary" />} title="Physiotherapy At Home" desc="Professional physiotherapy services and equipment delivered to your doorstep." link="/physiotherapy" />
                        <ServiceCard icon={<Clock size={28} className="text-primary" />} title="24/7 Support" desc="Our pharmacy is open round the clock to cater to your urgent medical needs." link="/medicines" />
                    </motion.div>
                </div>
            </section>

            {/* ── Location Section ── */}
            <section className="location-section section-padding">
                <div className="container location-content">
                    <motion.div
                        className="location-text"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <h2 className="title">Visit Our <span className="gradient-text">Pharmacy</span></h2>
                        <p className="subtitle" style={{ marginBottom: '2rem', marginTop: '0.5rem' }}>
                            Conveniently located in Thiruvarur. Drop by for in-person consultations or medicine pickups.
                        </p>

                        <ul className="location-details">
                            <li>
                                <div className="icon-box"><MapPin size={22} className="text-primary" /></div>
                                <div>
                                    <strong>Address</strong>
                                    <p>South Madavilagam, Vasan Nagar, Madappuram, <br />Thiruvarur, Tamil Nadu 610001</p>
                                </div>
                            </li>
                            <li>
                                <div className="icon-box"><Phone size={22} className="text-primary" /></div>
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
                        transition={{ duration: 0.7 }}
                    >
                        <div className="map-placeholder" style={{ padding: 0, border: 'none', background: 'transparent' }}>
                            <iframe
                                src="https://maps.google.com/maps?q=10.7736818,79.6358374&t=&z=17&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0, borderRadius: '20px' }}
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
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            Open in Google Maps
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}


/* ── Service Card ── */
function ServiceCard({ icon, title, desc, link }) {
    return (
        <motion.div
            className="service-card"
            variants={{
                initial: { opacity: 0, y: 30 },
                animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
        >
            <div className="service-icon">{icon}</div>
            <h3 className="service-title">{title}</h3>
            <p className="service-desc">{desc}</p>
            <Link to={link} className="service-link">
                Learn More <ArrowRight size={15} />
            </Link>
        </motion.div>
    );
}

export default Home;

import React from 'react';
import './Footer.css';
import { Pill, MapPin, Phone, Star, Instagram, Facebook, Mail } from 'lucide-react';
import logo from '../assets/gp-logo-new.png';
import { motion } from 'framer-motion';

function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-col">
                    <div className="nav-logo footer-logo">
                        <img src={logo} alt="Guardian Pharmacy Logo" className="brand-logo" />
                        <span className="logo-text">
                            Guardian <span className="text-primary">Pharmacy</span>
                        </span>
                    </div>
                    <p className="footer-desc">
                        Your trusted partner in healthcare. Providing quality medicines and seamless doctor appointments.
                    </p>
                    <div className="review-badge">
                        <Star className="text-accent" fill="#f59e0b" size={18} />
                        <strong>4.89</strong> Google Reviews
                    </div>
                </div>

                <div className="footer-col">
                    <h4 className="footer-title">Contact Information</h4>
                    <ul className="footer-contact-list">
                        <li>
                            <MapPin size={18} className="text-primary" style={{ flexShrink: 0, marginTop: '4px' }} />
                            <a
                                href="https://maps.app.goo.gl/awKrfW5eVoEk9gay5"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-link"
                            >
                                17- A SOUTH MAIN STREET, THIRUVARUR
                            </a>
                        </li>
                        <li>
                            <Phone size={18} className="text-primary" />
                            <a href="tel:09487469098" className="contact-link">
                                094874 69098
                            </a>
                        </li>
                        <li style={{ maxWidth: '100%' }}>
                            <Mail size={18} className="text-primary" style={{ flexShrink: 0, marginTop: '4px' }} />
                            <a href="mailto:tvrguardianpharmacy@gmail.com" className="contact-link" style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                                tvrguardianpharmacy@gmail.com
                            </a>
                        </li>
                    </ul>

                    <h4 className="footer-title mt-4">Connect With Us</h4>
                    <div className="social-links">
                        <a href="https://www.instagram.com/guardianpharmacytvr?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                            <Instagram size={20} />
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=100063820794691" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
                            <Facebook size={20} />
                        </a>

                        <a href="mailto:tvrguardianpharmacy@gmail.com" className="social-icon" aria-label="Email">
                            <Mail size={20} />
                        </a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Guardian Pharmacy. All rights reserved.</p>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 0.8, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, opacity: 1 }}
                    style={{ marginTop: '0.5rem', fontSize: '0.8rem', display: 'inline-block' }}
                >
                    <a href="https://myportfoliomuhsin.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                        Web Developed by <span style={{ textDecoration: 'underline' }}>Muhsin</span>
                    </a>
                </motion.p>
            </div>
        </footer>
    );
}

export default Footer;

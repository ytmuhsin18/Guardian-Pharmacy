import React from 'react';
import './Footer.css';
import { Pill, MapPin, Phone, Star, Instagram, Facebook, MessageCircle } from 'lucide-react';
import logo from '../assets/gp logo.jpeg';

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
                        Your trusted partner in healthcare. Providing quality medicines, precise lab tests, and seamless doctor appointments.
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
                            <span>South Madavilagam, Vasan Nagar, Madappuram, Thiruvarur, Tamil Nadu 610001</span>
                        </li>
                        <li>
                            <Phone size={18} className="text-primary" />
                            <span>094874 69098</span>
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
                        <a href="https://wa.me/919487469098" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="WhatsApp">
                            <MessageCircle size={20} />
                        </a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Guardian Pharmacy. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;

import React from 'react';
import { Phone } from 'lucide-react';
import './EmergencyBanner.css';

function EmergencyBanner() {
    return (
        <div className="emergency-banner">
            <div className="emergency-inner">
                <Phone size={14} className="emergency-icon" />
                <span className="emergency-text">
                    <strong>Emergency?</strong> Call us now: 
                    <a href="tel:+919487469098" className="emergency-number"> 094874 69098</a>
                </span>
            </div>
        </div>
    );
}

export default EmergencyBanner;

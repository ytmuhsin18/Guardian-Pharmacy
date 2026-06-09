import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Link, useLocation } from 'react-router-dom';
import { Home, Pill, Stethoscope, LayoutGrid, TestTube, Accessibility, Heart } from 'lucide-react';
import './MobileNavbar.css';

const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/medicines', icon: Pill, label: 'Meds' },
    { to: '/categories', icon: LayoutGrid, label: 'Categories' },
    { to: '/doctors', icon: Stethoscope, label: 'Docs' },
    { to: '/lab-tests', icon: TestTube, label: 'Labs' },
    { to: '/physiotherapy', icon: Accessibility, label: 'Physio' }
];

function MobileNavbar() {
    const location = useLocation();
    const [activeIndex, setActiveIndex] = useState(0);

    const { appointments } = useApp();
    const [hasActiveApt, setHasActiveApt] = useState(false);

    useEffect(() => {
        const index = navItems.findIndex(item =>
            item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)
        );
        if (index !== -1) setActiveIndex(index);
    }, [location]);

    useEffect(() => {
        try {
            const myAptIds = JSON.parse(localStorage.getItem('my_guardian_appointments') || '[]');
            if (myAptIds.length === 0) {
                setHasActiveApt(false);
                return;
            }
            // Check if any of MY appointments are in the current live set
            const active = appointments.some(apt => myAptIds.includes(apt.id));
            setHasActiveApt(active);
        } catch (e) {
            setHasActiveApt(false);
        }
    }, [appointments]);

    return (
        <nav className="mobile-bottom-nav">
            <ul className="nav-list">
                {navItems.map((item, index) => (
                    <li
                        key={item.to}
                        className={`nav-item ${index === activeIndex ? 'active' : ''}`}
                    >
                        <Link
                            to={item.to}
                            className="mobile-nav-link"
                            onClick={(e) => {
                                if (location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))) {
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }
                            }}
                        >
                            <span className="nav-icon">
                                <item.icon
                                    size={24}
                                    strokeWidth={index === activeIndex ? 2.5 : 2}
                                />

                            </span>
                            <span className="nav-text">{item.label}</span>
                        </Link>
                    </li>
                ))}
                <div
                    className="nav-indicator"
                    style={{ left: `calc(${activeIndex} * (100% / ${navItems.length}))` }}
                >
                    <div className="indicator-circle"></div>
                </div>

            </ul>
        </nav>
    );
}

export default MobileNavbar;


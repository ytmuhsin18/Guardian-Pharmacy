import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Pill, Stethoscope, Bone, TestTube, Accessibility } from 'lucide-react';
import './MobileNavbar.css';

function MobileNavbar() {
    return (
        <div className="mobile-bottom-nav">
            <NavLink to="/" className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}>
                <Home size={20} />
                <span>Home</span>
            </NavLink>
            <NavLink to="/medicines" className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}>
                <Pill size={20} />
                <span>Medicines</span>
            </NavLink>
            <NavLink to="/surgical-products" className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}>
                <Bone size={20} />
                <span>Categories</span>
            </NavLink>
            <NavLink to="/doctors" className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}>
                <Stethoscope size={20} />
                <span>Doctors</span>
            </NavLink>
            <NavLink to="/lab-tests" className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}>
                <TestTube size={20} />
                <span>Labs</span>
            </NavLink>
        </div>
    );
}

export default MobileNavbar;

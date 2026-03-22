import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Pill, Activity, Stethoscope, User, LogIn, Hash } from 'lucide-react';
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
                <Stethoscope size={20} />
                <span>Ortho</span>
            </NavLink>
            <NavLink to="/doctors" className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}>
                <Stethoscope size={20} />
                <span>Doctors</span>
            </NavLink>
            <NavLink to="/lab-tests" className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}>
                <Activity size={20} />
                <span>Labs</span>
            </NavLink>
            <NavLink to="/physiotherapy" className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}>
                <Activity size={20} />
                <span>Physio</span>
            </NavLink>

        </div>
    );
}

export default MobileNavbar;

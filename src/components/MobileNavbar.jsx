import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Pill, Activity, Stethoscope, User } from 'lucide-react';
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
            <NavLink to="/doctors" className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}>
                <Stethoscope size={20} />
                <span>Doctors</span>
            </NavLink>
            <NavLink to="/lab-tests" className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}>
                <Activity size={20} />
                <span>Lab Tests</span>
            </NavLink>
            {localStorage.getItem('guardian_admin_auth') === 'true' && (
                <NavLink to="/admin" className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}>
                    <User size={20} />
                    <span>Admin</span>
                </NavLink>
            )}
        </div>
    );
}

export default MobileNavbar;

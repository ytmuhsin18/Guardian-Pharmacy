import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, User, Menu, LogIn } from 'lucide-react';
import './Navbar.css';
import logo from '../assets/gp-logo-new.png';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="nav-logo">
                    <img src={logo} alt="Guardian Pharmacy Logo" className="brand-logo" />
                    <span className="logo-text">
                        Guardian <span className="text-primary">Pharmacy</span>
                    </span>
                </Link>

                <div className="nav-links desktop-only">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/medicines" className="nav-link">Medicines</Link>
                    <Link to="/lab-tests" className="nav-link">Lab Tests</Link>
                    <Link to="/doctors" className="nav-link">Doctors</Link>
                    <Link to="/surgical-products" className="nav-link">Surgical Products</Link>
                    <Link to="/physiotherapy" className="nav-link">Physiotherapy</Link>
                </div>

                <div className="nav-actions desktop-only">
                    {localStorage.getItem('guardian_admin_auth') === 'true' ? (
                        <Link to="/admin" className="btn btn-outline nav-admin-btn">
                            <User size={18} />
                            Admin
                        </Link>
                    ) : (
                        <div className="admin-login-wrapper">
                            <Link to="/login" className="nav-login-btn">
                                <LogIn size={24} />
                            </Link>
                            <span className="nav-tooltip">Admin Login</span>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

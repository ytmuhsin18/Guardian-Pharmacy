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
                    <Link to="/surgical-products" className="nav-link">Ortho &amp; Surgical Products</Link>
                    <Link to="/physiotherapy" className="nav-link">Physiotherapy</Link>
                </div>

                <div className="nav-actions desktop-only">

                </div>
            </div>
        </nav>
    );
}

export default Navbar;

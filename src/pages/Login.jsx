import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (email === 'ytmuhsin18@gmail.com' && password === '8248513188') {
            localStorage.setItem('guardian_admin_auth', 'true');
            navigate('/admin');
        } else {
            setError('Invalid email or password.');
        }
    };

    return (
        <div className="login-page">
            <motion.div
                className="login-container glass-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="login-header">
                    <div className="login-icon-bg">
                        <Lock size={32} className="text-primary" />
                    </div>
                    <h1 className="title">Admin Access</h1>
                    <p className="subtitle">Sign in to manage the platform</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <div className="icon-input-wrapper">
                            <Mail size={18} className="input-icon text-muted" />
                            <input
                                type="email"
                                className="input-field with-icon"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <div className="icon-input-wrapper">
                            <Lock size={18} className="input-icon text-muted" />
                            <input
                                type="password"
                                className="input-field with-icon"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block login-btn">
                        Sign In
                    </button>
                </form>
            </motion.div>
        </div>
    );
}

export default Login;

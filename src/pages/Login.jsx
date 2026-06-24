import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowLeft, Pill, Heart, Activity, ShieldCheck, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Support both email and phone number for admin login
        if ((email === 'ytmuhsin18@gmail.com' || email === '8248513188') && password === '8248513188') {
            localStorage.setItem('guardian_admin_auth', 'true');
            navigate('/admin');
        } else {
            setError('Invalid email/number or password.');
        }
    };

    return (
        <div className="login-page">
            {/* Floating Background Medical Icons */}
            <div className="floating-medical-icons" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
                {[...Array(24)].map((_, i) => {
                    const Icon = [Pill, Heart, Activity, ShieldCheck, Plus][i % 5];
                    const size = 20 + (i * 7) % 40;
                    const duration = 15 + (i * 5) % 25;
                    const delay = i * 0.4;
                    const colors = ['#00b894', '#0984e3', '#6c5ce7', '#fab1a0', '#ff7675', '#fdcb6e'];
                    const color = colors[i % colors.length];

                    return (
                        <motion.div
                            key={i}
                            className="floating-icon-wrapper"
                            initial={{
                                x: `${(i * 13) % 100}%`,
                                y: `${(i * 19) % 100}%`,
                                opacity: 0,
                                rotate: 0
                            }}
                            animate={{
                                y: [`${(i * 19) % 100}%`, `${((i * 19) % 100) - 15}%`, `${(i * 19) % 100}%`],
                                x: [`${(i * 13) % 100}%`, `${((i * 13) % 100) + 8}%`, `${(i * 13) % 100}%`],
                                opacity: [0, 0.12, 0],
                                rotate: [0, 90, 0]
                            }}
                            transition={{
                                duration,
                                repeat: Infinity,
                                delay,
                                ease: "linear"
                            }}
                            style={{ position: 'absolute' }}
                        >
                            <Icon size={size} color={color} strokeWidth={1} style={{ filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.8))' }} />
                        </motion.div>
                    );
                })}
            </div>
            {/* Prominent Back Button */}
            <motion.button
                onClick={() => navigate('/')}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1, backgroundColor: 'white' }}
                whileTap={{ scale: 0.9 }}
                style={{
                    position: 'fixed',
                    top: '25px',
                    left: '20px',
                    background: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--primary)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    zIndex: 100
                }}
                title="Back to Home"
            >
                <ArrowLeft size={28} strokeWidth={3} />
            </motion.button>

            <motion.div
                className="login-container glass-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ position: 'relative' }}
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
                        <label className="input-label">Email or Phone Number</label>
                        <div className="icon-input-wrapper">
                            <Mail size={18} className="input-icon text-muted" />
                            <input
                                type="text"
                                className="input-field with-icon"
                                placeholder="Enter email or number"
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

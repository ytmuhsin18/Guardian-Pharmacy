import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Mail, Eye, EyeOff, ArrowRight, Phone } from 'lucide-react';
import './UserLogin.css';
import { useApp } from '../context/AppContext';
import WelcomeCelebration from '../components/WelcomeCelebration';

function UserLogin() {
    const { login, user, registeredUsers } = useApp();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const [isReturningCelebration, setIsReturningCelebration] = useState(false);
    const [recentSignedUpName, setRecentSignedUpName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Where the user came from
    const from = location.state?.from || '/';

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        let userData;

        try {
            if (isLogin) {
                // Call login API
                const response = await fetch('/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        phone: formData.phone,
                        password: formData.password
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.error || 'Login failed. Please check your credentials.');
                    setIsLoading(false);
                    return;
                }

                userData = data;
            } else {
                // Call register API
                const response = await fetch('/api/users/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name || `User ${formData.phone.slice(-4)}`,
                        phone: formData.phone,
                        email: formData.email,
                        password: formData.password
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.error || 'Registration failed. Please try again.');
                    setIsLoading(false);
                    return;
                }

                userData = data;
            }

            setRecentSignedUpName(userData.name);
            setIsReturningCelebration(isLogin);
            setShowCelebration(true);
            login(userData);
        } catch (err) {
            console.error('Authentication error:', err);
            setError('An error occurred during authentication. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseCelebration = () => {
        setShowCelebration(false);
        navigate(from, { replace: true });
    };

    return (
        <div className="user-login-page">
            <WelcomeCelebration
                isOpen={showCelebration}
                userName={recentSignedUpName}
                isReturning={isReturningCelebration}
                onClose={handleCloseCelebration}
            />
            {/* Animated Background Shapes */}
            <motion.div
                className="login-bg-shape shape-1"
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="login-bg-shape shape-2"
                animate={{
                    scale: [1, 1.5, 1],
                    rotate: [0, -90, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />

            <motion.div
                className="user-login-container"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
            >
                <div className="user-login-header">
                    <motion.div
                        className="user-login-icon-bg"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <User size={36} color="var(--primary)" strokeWidth={2.5} />
                    </motion.div>
                    <motion.h1
                        className="user-login-title"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </motion.h1>
                    <motion.p
                        className="user-login-subtitle"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        {isLogin ? 'Sign in with your phone number' : 'Join us for a better healthcare experience'}
                    </motion.p>
                </div>

                <div className="auth-tabs">
                    <motion.div
                        className="auth-tab-indicator"
                        initial={false}
                        animate={{
                            left: isLogin ? '6px' : 'calc(50% + 3px)',
                            width: 'calc(50% - 9px)'
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                    <button
                        className={`auth-tab-btn ${isLogin ? 'active' : ''}`}
                        onClick={() => { setIsLogin(true); setError(''); }}
                        type="button"
                    >
                        Login
                    </button>
                    <button
                        className={`auth-tab-btn ${!isLogin ? 'active' : ''}`}
                        onClick={() => { setIsLogin(false); setError(''); }}
                        type="button"
                    >
                        Sign Up
                    </button>
                </div>

                {error && (
                    <motion.div
                        className="auth-error-msg"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                    <AnimatePresence mode="popLayout">
                        {!isLogin && (
                            <>
                                <motion.div
                                    className="user-form-group"
                                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginBottom: '1.5rem' }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <label className="user-form-label">Full Name</label>
                                    <div className="user-input-wrapper">
                                        <User size={20} className="user-input-icon" />
                                        <input
                                            type="text"
                                            name="name"
                                            className="user-input-field"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required={!isLogin}
                                        />
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="user-form-group"
                                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginBottom: '1.5rem' }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <label className="user-form-label">Email Address</label>
                                    <div className="user-input-wrapper">
                                        <Mail size={20} className="user-input-icon" />
                                        <input
                                            type="email"
                                            name="email"
                                            className="user-input-field"
                                            placeholder="name@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required={!isLogin}
                                        />
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    <div className="user-form-group">
                        <label className="user-form-label">Phone Number</label>
                        <div className="user-input-wrapper">
                            <Phone size={20} className="user-input-icon" />
                            <input
                                type="tel"
                                name="phone"
                                className="user-input-field"
                                placeholder="1234567890"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="user-form-group" style={{ marginBottom: isLogin ? '0.5rem' : '1.5rem' }}>
                        <label className="user-form-label">Password</label>
                        <div className="user-input-wrapper">
                            <Lock size={20} className="user-input-icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="user-input-field"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="user-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {isLogin && (
                        <div 
                            className="forgot-password-link tooltip-container" 
                            style={{ position: 'relative', display: 'inline-block', cursor: 'help', color: '#64748b' }}
                            title="If you forgot your password, please contact us at 094874 69098 for assistance."
                        >
                            Forgot your password?
                        </div>
                    )}

                    <motion.button
                        type="submit"
                        className="user-submit-btn"
                        whileHover={!isLoading ? { scale: 1.02 } : {}}
                        whileTap={!isLoading ? { scale: 0.98 } : {}}
                        disabled={isLoading}
                        style={{ opacity: isLoading ? 0.7 : 1 }}
                    >
                        {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                        {!isLoading && <ArrowRight size={20} />}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}

export default UserLogin;

import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Mail, Eye, EyeOff, ArrowRight, Phone } from 'lucide-react';
import './UserLogin.css';
import { useApp } from '../context/AppContext';

function UserLogin() {
    const { login, user, registeredUsers } = useApp();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isSocialLoading, setIsSocialLoading] = useState(false);
    const [showGooglePicker, setShowGooglePicker] = useState(false);
    const [selectedGoogleAccount, setSelectedGoogleAccount] = useState(null);
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

    const handleGoogleLogin = () => {
        setIsSocialLoading(true);
        // Simulate a short network delay before showing the account picker
        setTimeout(() => {
            setIsSocialLoading(false);
            setShowGooglePicker(true);
        }, 800);
    };

    const handleSelectAccount = (account) => {
        setSelectedGoogleAccount(account);
        // Simulate "Signing in..." after selection
        setTimeout(() => {
            login({
                name: account.name,
                email: account.email,
                phone: 'N/A',
                image: account.image,
                id: 'google_' + Math.random().toString(36).substr(2, 9)
            });
            setShowGooglePicker(false);
            navigate(from, { replace: true });
        }, 1500);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        
        let userData;
        
        if (isLogin) {
            // Find existing user
            const existingUser = registeredUsers?.find(u => u.phone === formData.phone);
            
            if (existingUser) {
                // VERIFY PASSWORD
                if (existingUser.password !== formData.password) {
                    setError('Incorrect password. Please try again.');
                    return;
                }
                userData = { ...existingUser };
            } else {
                // If user doesn't exist, we can either throw error or auto-register 
                // But usually Login should only allow existing users
                setError('User not found. Please Sign Up first.');
                return;
            }
        } else {
            // New registration - check if phone already taken
            const exists = registeredUsers?.some(u => u.phone === formData.phone);
            if (exists) {
                setError('Phone number already registered. Please Login.');
                return;
            }

            // New registration
            userData = {
                name: formData.name || `User ${formData.phone.slice(-4)}`,
                phone: formData.phone,
                email: formData.email,
                password: formData.password, // Store password
                id: 'user_' + Math.random().toString(36).substr(2, 9)
            };
        }
        
        login(userData);
        navigate(from, { replace: true });
    };

    return (
        <div className="user-login-page">
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
                        <Link to="#" className="forgot-password-link">
                            Forgot your password?
                        </Link>
                    )}

                    <motion.button 
                        type="submit" 
                        className="user-submit-btn"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isLogin ? 'Sign In' : 'Create Account'}
                        <ArrowRight size={20} />
                    </motion.button>
                </form>

                <div className="social-login-divider">Or continue with</div>

                <div className="social-login-buttons">
                    <button 
                        className="social-btn"
                        onClick={handleGoogleLogin}
                        disabled={isSocialLoading}
                    >
                        {isSocialLoading ? (
                             <div className="loading-dots">
                                 <span></span><span></span><span></span>
                             </div>
                        ) : (
                            <>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.78 15.74 17.55V20.47H19.3C21.38 18.55 22.56 15.67 22.56 12.25Z" fill="#4285F4"/>
                                    <path d="M12 23C14.97 23 17.47 22.02 19.3 20.47L15.74 17.55C14.75 18.21 13.48 18.62 12 18.62C9.13001 18.62 6.69001 16.68 5.82001 14.08H2.15002V17.02C3.96002 20.61 7.7 23 12 23Z" fill="#34A853"/>
                                    <path d="M5.82001 14.08C5.60001 13.41 5.47001 12.72 5.47001 12C5.47001 11.28 5.60001 10.59 5.82001 9.92V6.98H2.15002C1.41002 8.46 1 10.18 1 12C1 13.82 1.41002 15.54 2.15002 17.02L5.82001 14.08Z" fill="#FBBC05"/>
                                    <path d="M12 5.38C13.62 5.38 15.06 5.94 16.2 7.02L19.38 3.84C17.46 2.05 14.96 1 12 1C7.7 1 3.96002 3.39 2.15002 6.98L5.82001 9.92C6.69001 7.32 9.13001 5.38 12 5.38Z" fill="#EA4335"/>
                                </svg>
                                Google
                            </>
                        )}
                    </button>
                </div>

                <div className="auth-footer-text">
                    By continuing, you agree to our 
                    <Link to="#" className="auth-link">Terms of Service</Link> and 
                    <Link to="#" className="auth-link">Privacy Policy</Link>.
                </div>
            </motion.div>

            {/* Simulated Google Account Picker */}
            <AnimatePresence>
                {showGooglePicker && (
                    <div className="google-picker-overlay">
                        <motion.div 
                            className="google-picker-card"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                            <div className="google-picker-header">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.78 15.74 17.55V20.47H19.3C21.38 18.55 22.56 15.67 22.56 12.25Z" fill="#4285F4"/>
                                    <path d="M12 23C14.97 23 17.47 22.02 19.3 20.47L15.74 17.55C14.75 18.21 13.48 18.62 12 18.62C9.13001 18.62 6.69001 16.68 5.82001 14.08H2.15002V17.02C3.96002 20.61 7.7 23 12 23Z" fill="#34A853"/>
                                    <path d="M5.82001 14.08C5.60001 13.41 5.47001 12.72 5.47001 12C5.47001 11.28 5.60001 10.59 5.82001 9.92V6.98H2.15002C1.41002 8.46 1 10.18 1 12C1 13.82 1.41002 15.54 2.15002 17.02L5.82001 14.08Z" fill="#FBBC05"/>
                                    <path d="M12 5.38C13.62 5.38 15.06 5.94 16.2 7.02L19.38 3.84C17.46 2.05 14.96 1 12 1C7.7 1 3.96002 3.39 2.15002 6.98L5.82001 9.92C6.69001 7.32 9.13001 5.38 12 5.38Z" fill="#EA4335"/>
                                </svg>
                                <h2>Choose an account</h2>
                                <p>to continue to Guardian Pharmacy</p>
                            </div>

                            <div className="google-accounts-list">
                                {selectedGoogleAccount ? (
                                    <div className="google-signing-in">
                                        <div className="google-avatar large">
                                            {selectedGoogleAccount.name[0]}
                                        </div>
                                        <h3>Signing you in...</h3>
                                        <div className="google-progress-bar">
                                            <motion.div 
                                                className="google-progress-fill"
                                                initial={{ width: 0 }}
                                                animate={{ width: '100%' }}
                                                transition={{ duration: 1.5 }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <button 
                                            className="google-account-item"
                                            onClick={() => handleSelectAccount({
                                                name: 'Muhsin',
                                                email: 'ytmuhsin18@gmail.com',
                                                image: null
                                            })}
                                        >
                                            <div className="google-avatar">M</div>
                                            <div className="google-account-info">
                                                <span className="account-name">Muhsin</span>
                                                <span className="account-email">ytmuhsin18@gmail.com</span>
                                            </div>
                                        </button>

                                        <button 
                                            className="google-account-item"
                                            onClick={() => handleSelectAccount({
                                                name: 'Guest User',
                                                email: 'guest@gmail.com',
                                                image: null
                                            })}
                                        >
                                            <div className="google-avatar guest">G</div>
                                            <div className="google-account-info">
                                                <span className="account-name">Guest User</span>
                                                <span className="account-email">guest@gmail.com</span>
                                            </div>
                                        </button>

                                        <button className="google-account-item other">
                                            <div className="google-avatar other">
                                                <User size={18} />
                                            </div>
                                            <div className="google-account-info">
                                                <span className="account-name">Use another account</span>
                                            </div>
                                        </button>
                                    </>
                                )}
                            </div>

                            <div className="google-picker-footer">
                                <p>To continue, Google will share your name, email address, language preference, and profile picture with Guardian Pharmacy.</p>
                                <button className="google-picker-cancel" onClick={() => setShowGooglePicker(false)}>Cancel</button>
                            </div>
                        </motion.div>
                        <div className="google-picker-backdrop" onClick={() => !selectedGoogleAccount && setShowGooglePicker(false)} />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default UserLogin;

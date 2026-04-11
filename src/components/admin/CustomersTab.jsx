import React, { useState } from 'react';
import { Search, Mail, Calendar, User, ArrowUpRight, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function CustomersTab({ users }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = (users || []).filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
    );

    return (
        <div className="tab-container">
            <div className="tab-header">
                <div className="search-bar-premium">
                    <Search size={20} className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search by name, phone or email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="customers-list-container">
                <AnimatePresence mode='popLayout'>
                    {filteredUsers.length > 0 ? (
                        <div className="customers-grid">
                            {filteredUsers.map((user, index) => (
                                <motion.div 
                                    key={user.id || index}
                                    className="customer-card-premium"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div className="customer-card-header">
                                        <div className="customer-avatar-large">
                                            {user.name?.charAt(0) || 'U'}
                                        </div>
                                        <div className="customer-main-info">
                                            <h3>{user.name}</h3>
                                            <span className="customer-id">#{user.id?.slice(-6) || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <div className="customer-details-list">
                                        {user.email && (
                                            <div className="customer-detail-item">
                                                <Mail size={16} />
                                                <span>{user.email}</span>
                                            </div>
                                        )}
                                        <div className="customer-detail-item">
                                            <Phone size={16} />
                                            <span>{user.phone || 'No phone'}</span>
                                        </div>
                                        <div className="customer-detail-item">
                                            <Calendar size={16} />
                                            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="customer-card-footer">
                                        <div className="customer-status-pill online">
                                            <div className="dot"></div>
                                            Verified Account
                                        </div>
                                        <button className="customer-action-btn" title="View Details">
                                            <ArrowUpRight size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div 
                            className="no-results-premium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <User size={48} className="muted-icon" />
                            <h3>No customers found</h3>
                            <p>Try searching with a different name, phone or email address.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default CustomersTab;

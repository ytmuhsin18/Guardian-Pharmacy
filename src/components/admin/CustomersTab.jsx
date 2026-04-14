import React, { useState } from 'react';
import { Search, Mail, Calendar, User, ArrowUpRight, Phone, Edit2, Trash2, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';

function CustomersTab({ users }) {
    const { updateRegisteredUser, deleteRegisteredUser } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: '', email: '', phone: '' });

    const filteredUsers = (users || []).filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
    );

    const handleEditClick = (user) => {
        setEditingUser(user);
        setEditFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || ''
        });
    };

    const handleSaveEdit = () => {
        if (!editFormData.name.trim()) {
            alert('Name is required');
            return;
        }
        updateRegisteredUser(editingUser.id, editFormData);
        setEditingUser(null);
    };

    return (
        <div className="tab-container">
            <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
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
                                        <div className="customer-actions-top" style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                                            <button 
                                                className="customer-action-btn" 
                                                title="Edit Customer" 
                                                style={{ color: '#0984e3' }}
                                                onClick={() => handleEditClick(user)}
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                className="customer-action-btn" 
                                                title="Delete Customer" 
                                                style={{ color: '#ef4444' }}
                                                onClick={() => deleteRegisteredUser(user.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
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

            {/* Edit Modal */}
            <AnimatePresence>
                {editingUser && (
                    <div className="modal-overlay" style={{ 
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
                        background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', 
                        alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' 
                    }}>
                        <motion.div 
                            className="glass-panel" 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{ width: '100%', maxWidth: '400px', padding: '2rem', position: 'relative' }}
                        >
                            <button 
                                style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#64748b' }}
                                onClick={() => setEditingUser(null)}
                            >
                                <X size={24} />
                            </button>
                            
                            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Edit2 size={24} className="text-primary" />
                                Edit Customer
                            </h2>

                            <div className="input-group">
                                <label className="input-label">Full Name</label>
                                <input 
                                    className="input-field"
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Email Address</label>
                                <input 
                                    className="input-field"
                                    type="email"
                                    value={editFormData.email}
                                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Phone Number</label>
                                <input 
                                    className="input-field"
                                    value={editFormData.phone}
                                    onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button 
                                    className="btn btn-primary" 
                                    style={{ flex: 1 }}
                                    onClick={handleSaveEdit}
                                >
                                    <Save size={18} />
                                    Save Changes
                                </button>
                                <button 
                                    className="btn" 
                                    style={{ background: '#f1f5f9', color: '#64748b' }}
                                    onClick={() => setEditingUser(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default CustomersTab;

import React, { useState } from 'react';
import { Search, User, Phone, Edit2, Trash2, X, Save } from 'lucide-react';
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

            <div className="customers-table-wrapper">
                <table className="excel-table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email Address</th>
                            <th>Phone Number</th>
                            <th>Joined Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user, index) => (
                                <tr key={user.id || index}>
                                    <td style={{ color: '#94a3b8', fontSize: '0.8rem', textAlign: 'center', width: '40px' }}>{index + 1}</td>
                                    <td className="id-cell">{user.id?.slice(-6).toUpperCase() || 'N/A'}</td>
                                    <td className="name-cell">
                                        <div className="name-with-avatar">
                                            <div className="mini-avatar">{user.name?.charAt(0) || 'U'}</div>
                                            {user.name}
                                        </div>
                                    </td>
                                    <td>{user.email || '-'}</td>
                                    <td>{user.phone || 'No phone'}</td>
                                    <td>
                                        {user.createdAt && !isNaN(new Date(user.createdAt).getTime())
                                            ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                                            : 'N/A'}
                                    </td>
                                    <td>
                                        <div className="customer-status-pill online" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
                                            <div className="dot"></div>
                                            Verified
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-btns-cell">
                                            <button
                                                className="table-action-btn edit"
                                                title="Edit Customer"
                                                onClick={() => handleEditClick(user)}
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                className="table-action-btn delete"
                                                title="Delete Customer"
                                                onClick={() => deleteRegisteredUser(user.id)}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">
                                    <div className="no-results-table">
                                        <User size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                                        <p>No customers found matching your search.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
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
                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Email Address</label>
                                <input
                                    className="input-field"
                                    type="email"
                                    value={editFormData.email}
                                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Phone Number</label>
                                <input
                                    className="input-field"
                                    value={editFormData.phone}
                                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
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

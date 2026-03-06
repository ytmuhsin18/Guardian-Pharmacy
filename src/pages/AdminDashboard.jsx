import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Pill, LogOut, CheckCircle, Clock, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './AdminDashboard.css';

function AdminDashboard() {
    const navigate = useNavigate();
    const { appointments, updateAppointmentStatus, addMedicine } = useApp();
    const [activeTab, setActiveTab] = useState('appointments');
    const [newMedicine, setNewMedicine] = useState({
        name: '', category: '', price: '', description: '', inStock: true
    });
    const [uploadSuccess, setUploadSuccess] = useState(false);

    useEffect(() => {
        // Check auth
        const isAuth = localStorage.getItem('guardian_admin_auth');
        if (isAuth !== 'true') {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('guardian_admin_auth');
        navigate('/login');
    };

    const handleMedicineSubmit = (e) => {
        e.preventDefault();
        addMedicine({
            ...newMedicine,
            price: parseFloat(newMedicine.price)
        });
        setUploadSuccess(true);
        setNewMedicine({ name: '', category: '', price: '', description: '', inStock: true });

        setTimeout(() => {
            setUploadSuccess(false);
            setActiveTab('appointments'); // redirect back to dashboard view
        }, 2000);
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-profile">
                    <div className="admin-avatar">A</div>
                    <div>
                        <h3>Admin User</h3>
                        <span className="badge bg-primary">Online</span>
                    </div>
                </div>

                <nav className="admin-nav">
                    <button
                        className={`admin-nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('appointments')}
                    >
                        <LayoutDashboard size={20} />
                        Appointments
                    </button>

                    <button
                        className={`admin-nav-item ${activeTab === 'upload' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upload')}
                    >
                        <Pill size={20} />
                        Upload Medicine
                    </button>
                </nav>

                <div className="admin-sidebar-footer">
                    <button className="admin-nav-item text-danger" onClick={handleLogout}>
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <h1 className="title">
                        {activeTab === 'appointments' ? 'Doctor Appointments' : 'Add New Medicine'}
                    </h1>
                </header>

                <div className="admin-content">
                    {activeTab === 'appointments' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="appointments-view"
                        >
                            {appointments.length === 0 ? (
                                <div className="empty-state glass-panel">
                                    <Clock size={48} className="text-muted" />
                                    <h3>No Appointments Yet</h3>
                                    <p>When patients book home visits, they will appear here.</p>
                                </div>
                            ) : (
                                <div className="appointments-table-wrapper glass-panel">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Patient Name</th>
                                                <th>Doctor</th>
                                                <th>Date & Time</th>
                                                <th>Contact</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appointments.map(apt => (
                                                <tr key={apt.id}>
                                                    <td><strong>{apt.patientName}</strong></td>
                                                    <td>{apt.doctorName}</td>
                                                    <td>
                                                        <div className="date-time-cell">
                                                            <span>{apt.date}</span>
                                                            <span className="text-muted text-sm">{apt.time}</span>
                                                        </div>
                                                    </td>
                                                    <td>{apt.phone}</td>
                                                    <td>
                                                        <span className={`status-badge ${apt.status.toLowerCase()}`}>
                                                            {apt.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {apt.status === 'Pending' && (
                                                            <div className="action-buttons">
                                                                <button
                                                                    className="btn-icon accept"
                                                                    onClick={() => updateAppointmentStatus(apt.id, 'Confirmed')}
                                                                    title="Confirm"
                                                                >
                                                                    <CheckCircle size={18} />
                                                                </button>
                                                                <button
                                                                    className="btn-icon reject"
                                                                    onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')}
                                                                    title="Cancel"
                                                                >
                                                                    <X size={18} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'upload' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="upload-view"
                        >
                            <div className="upload-form-container glass-panel">
                                {uploadSuccess ? (
                                    <div className="success-state text-center">
                                        <CheckCircle size={64} className="text-primary" style={{ margin: '0 auto 1rem' }} />
                                        <h3>Medicine Added Successfully!</h3>
                                        <p className="text-muted">The product is now available in the store.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleMedicineSubmit} className="upload-form">
                                        <div className="form-row">
                                            <div className="input-group">
                                                <label className="input-label">Medicine Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="input-field"
                                                    placeholder="e.g. Paracetamol 500mg"
                                                    value={newMedicine.name}
                                                    onChange={e => setNewMedicine({ ...newMedicine, name: e.target.value })}
                                                />
                                            </div>

                                            <div className="input-group">
                                                <label className="input-label">Category</label>
                                                <select
                                                    required
                                                    className="input-field"
                                                    value={newMedicine.category}
                                                    onChange={e => setNewMedicine({ ...newMedicine, category: e.target.value })}
                                                >
                                                    <option value="">Select Category</option>
                                                    <option value="Fever & Pain">Fever & Pain</option>
                                                    <option value="Antibiotics">Antibiotics</option>
                                                    <option value="Allergy">Allergy</option>
                                                    <option value="Supplements">Supplements</option>
                                                    <option value="Digestion">Digestion</option>
                                                    <option value="First Aid">First Aid</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="input-group">
                                                <label className="input-label">Price ($)</label>
                                                <input
                                                    type="number"
                                                    required
                                                    min="0.01" step="0.01"
                                                    className="input-field"
                                                    placeholder="e.g. 5.99"
                                                    value={newMedicine.price}
                                                    onChange={e => setNewMedicine({ ...newMedicine, price: e.target.value })}
                                                />
                                            </div>

                                            <div className="input-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.5rem' }}>
                                                <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={newMedicine.inStock}
                                                        onChange={e => setNewMedicine({ ...newMedicine, inStock: e.target.checked })}
                                                        style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
                                                    />
                                                    <span style={{ fontWeight: 500 }}>Is in stock?</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="input-group">
                                            <label className="input-label">Description</label>
                                            <textarea
                                                required
                                                className="input-field"
                                                rows="4"
                                                placeholder="Briefly describe the medicine, dosage, and uses..."
                                                value={newMedicine.description}
                                                onChange={e => setNewMedicine({ ...newMedicine, description: e.target.value })}
                                            ></textarea>
                                        </div>

                                        <button type="submit" className="btn btn-primary mt-4">
                                            <Pill size={18} /> Upload Product to Store
                                        </button>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;

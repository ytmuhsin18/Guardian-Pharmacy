import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Pill, LogOut, CheckCircle, Clock, X, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './AdminDashboard.css';

function AdminDashboard() {
    const navigate = useNavigate();
    const { appointments, updateAppointmentStatus, orders, updateOrderStatus, addMedicine, doctors, updateDoctorImage, addDoctor } = useApp();
    const [activeTab, setActiveTab] = useState('orders');
    const [newMedicine, setNewMedicine] = useState({
        name: '', category: '', price: '', description: '', inStock: true, image_base64: ''
    });
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const [newDoctor, setNewDoctor] = useState({
        name: '', specialty: '', experience: 'Experienced', about: '', image_base64: ''
    });
    const [doctorUploadSuccess, setDoctorUploadSuccess] = useState(false);

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

    const handleImageUpload = (e, callback) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => callback(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleMedicineSubmit = (e) => {
        e.preventDefault();
        addMedicine({
            ...newMedicine,
            price: parseFloat(newMedicine.price)
        });
        setUploadSuccess(true);
        setNewMedicine({ name: '', category: '', price: '', description: '', inStock: true, image_base64: '' });

        setTimeout(() => {
            setUploadSuccess(false);
            setActiveTab('appointments'); // redirect back to dashboard view
        }, 2000);
    };

    const handleDoctorSubmit = (e) => {
        e.preventDefault();
        addDoctor(newDoctor);
        setDoctorUploadSuccess(true);
        setNewDoctor({ name: '', specialty: '', experience: 'Experienced', about: '', image_base64: '' });

        setTimeout(() => {
            setDoctorUploadSuccess(false);
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
                        className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <Package size={20} />
                        Orders
                    </button>

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
                    <button
                        className={`admin-nav-item ${activeTab === 'doctors' ? 'active' : ''}`}
                        onClick={() => setActiveTab('doctors')}
                    >
                        <Users size={20} />
                        Edit Doctors
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
                        {activeTab === 'orders' ? 'Customer Orders' : activeTab === 'appointments' ? 'Doctor Appointments' : activeTab === 'upload' ? 'Add New Medicine' : 'Edit Doctors'}
                    </h1>
                </header>

                <div className="admin-content">
                    {activeTab === 'orders' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="appointments-view"
                        >
                            {orders.length === 0 ? (
                                <div className="empty-state glass-panel">
                                    <Package size={48} className="text-muted" />
                                    <h3>No Orders Yet</h3>
                                    <p>When customers place orders, they will appear here.</p>
                                </div>
                            ) : (
                                <div className="appointments-table-wrapper glass-panel">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Customer Details</th>
                                                <th>Items Ordered</th>
                                                <th>Total</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(order => (
                                                <tr key={order.id}>
                                                    <td>
                                                        <strong>{order.customer_name}</strong><br />
                                                        <span className="text-muted text-sm">{order.phone} (WA: {order.whatsapp})</span><br />
                                                        <span className="text-muted text-sm" style={{ whiteSpace: 'normal', display: 'inline-block', maxWidth: '200px' }}>{order.address}, {order.pincode}</span>
                                                    </td>
                                                    <td>
                                                        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem' }}>
                                                            {order.items.map((item, idx) => (
                                                                <li key={idx}>{item.name} x{item.quantity}</li>
                                                            ))}
                                                        </ul>
                                                    </td>
                                                    <td>
                                                        <strong>₹{Number(order.total_amount).toFixed(2)}</strong>
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge ${order.status.toLowerCase()}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {order.status === 'Pending' && (
                                                            <div className="action-buttons">
                                                                <button
                                                                    className="btn-icon accept"
                                                                    onClick={() => updateOrderStatus(order.id, 'Confirmed')}
                                                                    title="Confirm Order"
                                                                >
                                                                    <CheckCircle size={18} />
                                                                </button>
                                                                <button
                                                                    className="btn-icon reject"
                                                                    onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                                                                    title="Cancel Order"
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
                                                <label className="input-label">Price (₹)</label>
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
                                            <label className="input-label">Medicine Image</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="input-field"
                                                style={{ padding: '0.5rem' }}
                                                onChange={e => handleImageUpload(e, (base64) => setNewMedicine({ ...newMedicine, image_base64: base64 }))}
                                            />
                                            {newMedicine.image_base64 && (
                                                <div style={{ marginTop: '10px' }}>
                                                    <img src={newMedicine.image_base64} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                                                </div>
                                            )}
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

                    {activeTab === 'doctors' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="doctors-edit-view glass-panel"
                            style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1.5rem' }}
                        >
                            <div className="add-doctor-section">
                                <h3>Add New Doctor</h3>
                                {doctorUploadSuccess ? (
                                    <div className="success-state text-center" style={{ padding: '2rem' }}>
                                        <CheckCircle size={48} className="text-primary" style={{ margin: '0 auto 1rem' }} />
                                        <h4>Doctor Added Successfully!</h4>
                                    </div>
                                ) : (
                                    <form onSubmit={handleDoctorSubmit} className="upload-form" style={{ marginTop: '1rem' }}>
                                        <div className="form-row">
                                            <div className="input-group">
                                                <label className="input-label">Doctor Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="input-field"
                                                    placeholder="e.g. Dr. Sarah Smith"
                                                    value={newDoctor.name}
                                                    onChange={e => setNewDoctor({ ...newDoctor, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label className="input-label">Specialty</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="input-field"
                                                    placeholder="e.g. Cardiologist"
                                                    value={newDoctor.specialty}
                                                    onChange={e => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="input-group">
                                                <label className="input-label">Experience</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="input-field"
                                                    placeholder="e.g. 10 Years"
                                                    value={newDoctor.experience}
                                                    onChange={e => setNewDoctor({ ...newDoctor, experience: e.target.value })}
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label className="input-label">Photo</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="input-field"
                                                    style={{ padding: '0.5rem' }}
                                                    onChange={e => handleImageUpload(e, (base64) => setNewDoctor({ ...newDoctor, image_base64: base64 }))}
                                                />
                                            </div>
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label">About</label>
                                            <textarea
                                                required
                                                className="input-field"
                                                rows="3"
                                                placeholder="Briefly describe the doctor..."
                                                value={newDoctor.about}
                                                onChange={e => setNewDoctor({ ...newDoctor, about: e.target.value })}
                                            ></textarea>
                                        </div>
                                        <button type="submit" className="btn btn-primary mt-2">
                                            <Users size={18} /> Add Doctor
                                        </button>
                                    </form>
                                )}
                            </div>

                            <hr style={{ borderColor: 'var(--border-color)', margin: '1rem 0' }} />

                            <div>
                                <h3>Manage Existing Doctors</h3>
                                <table className="admin-table" style={{ marginTop: '1rem' }}>
                                    <thead>
                                        <tr>
                                            <th>Current Photo</th>
                                            <th>Name</th>
                                            <th>Specialty</th>
                                            <th>Update Photo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {doctors.map(doc => (
                                            <tr key={doc.id}>
                                                <td>
                                                    <img
                                                        src={doc.image_base64 || 'https://via.placeholder.com/50'}
                                                        alt={doc.name}
                                                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }}
                                                    />
                                                </td>
                                                <td><strong>{doc.name}</strong></td>
                                                <td>{doc.specialty}</td>
                                                <td>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            handleImageUpload(e, (base64) => {
                                                                updateDoctorImage(doc.id, base64);
                                                            });
                                                        }}
                                                        style={{ fontSize: '0.8rem' }}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;

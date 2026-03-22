import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Pill, LogOut, CheckCircle, Clock, X, Package, Paperclip, Edit2, Save, Trash2, ToggleLeft, ToggleRight, Hash, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './AdminDashboard.css';

function AdminDashboard() {
    const navigate = useNavigate();
    const { appointments, updateAppointmentStatus, updateAppointmentToken, orders, updateOrderStatus, prescriptions, updatePrescriptionStatus, addMedicine, updateMedicineData, deleteMedicine, toggleMedicineStock, medicines, doctors, updateDoctorImage, addDoctor, updateDoctorAvailability, updateDoctorData, deleteDoctor } = useApp();
    const [activeTab, setActiveTab] = useState('orders');
    const [newMedicine, setNewMedicine] = useState({
        name: '', combination: '', category: '', price: '', discount: '', description: '', stockQuantity: '', images: []
    });
    const [editingMedicineId, setEditingMedicineId] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [newDoctor, setNewDoctor] = useState({
        name: '', specialty: '', experience: 'Experienced', about: '', image_base64: '',
        availability_start: '06:00 PM', availability_end: '10:00 PM'
    });
    const [doctorUploadSuccess, setDoctorUploadSuccess] = useState(false);
    const [editingDoctorId, setEditingDoctorId] = useState(null);

    // Token editing state
    const [editingTokenId, setEditingTokenId] = useState(null);
    const [tokenValue, setTokenValue] = useState('');

    // Doctor availability editing state
    const [editingAvailId, setEditingAvailId] = useState(null);
    const [availStart, setAvailStart] = useState('');
    const [availEnd, setAvailEnd] = useState('');

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
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const readers = files.map(file => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(readers).then(base64Images => {
                callback(base64Images);
            });
        }
    };

    const handleMedicineSubmit = async (e) => {
        e.preventDefault();

        const submissionData = {
            name: newMedicine.name,
            combination: newMedicine.combination || null,
            category: newMedicine.category,
            price: parseFloat(newMedicine.price),
            discount: newMedicine.discount ? parseFloat(newMedicine.discount) : 0,
            description: newMedicine.description || null,
            inStock: parseInt(newMedicine.stockQuantity) > 0,
            images: newMedicine.images || []
        };

        let success;
        if (editingMedicineId) {
            success = await updateMedicineData(editingMedicineId, submissionData);
            if (success) setUploadSuccess('Medicine updated successfully!');
        } else {
            success = await addMedicine(submissionData);
            if (success) setUploadSuccess('Medicine added successfully!');
        }

        if (!success) {
            setUploadSuccess('Error! Check console for details.');
        }

        setNewMedicine({ name: '', combination: '', category: '', price: '', discount: '', description: '', stockQuantity: '', images: [] });
        setEditingMedicineId(null);

        setTimeout(() => {
            setUploadSuccess(false);
        }, 2500);
    };

    const handleEditMedicine = (med) => {
        setNewMedicine({
            name: med.name,
            combination: med.combination || '',
            category: med.category,
            price: med.price,
            discount: med.discount || '',
            description: med.description || '',
            stockQuantity: med.stockQuantity || (med.inStock ? 100 : 0),
            images: Array.isArray(med.images) ? med.images : (med.image_base64 ? [med.image_base64] : [])
        });
        setEditingMedicineId(med.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setNewMedicine({ name: '', combination: '', category: '', price: '', discount: '', description: '', stockQuantity: '', image_base64: '' });
        setEditingMedicineId(null);
    };

    const handleDeleteMedicine = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            const success = await deleteMedicine(id);
            if (success) {
                setUploadSuccess('Medicine deleted successfully!');
                setTimeout(() => setUploadSuccess(false), 2500);
            }
        }
    };

    const handleToggleStock = async (id, currentStatus) => {
        await toggleMedicineStock(id, currentStatus);
    };

    const handleTokenEdit = (apt) => {
        setEditingTokenId(apt.id);
        setTokenValue(apt.token_number || '');
    };

    const handleTokenSave = async (id) => {
        const num = parseInt(tokenValue);
        if (!isNaN(num) && num > 0) {
            const success = await updateAppointmentToken(id, num);
            if (success) {
                setEditingTokenId(null);
                setTokenValue('');
            }
        } else {
            alert('Please enter a valid token number.');
        }
    };

    const handleAvailEdit = (doc) => {
        setEditingAvailId(doc.id);
        setAvailStart(doc.availability_start || '06:00 PM');
        setAvailEnd(doc.availability_end || '10:00 PM');
    };

    const handleAvailSave = async (id) => {
        const success = await updateDoctorAvailability(id, availStart, availEnd);
        if (success) {
            setEditingAvailId(null);
            setAvailStart('');
            setAvailEnd('');
        }
    };

    const handleDoctorSubmit = async (e) => {
        e.preventDefault();

        let success;
        if (editingDoctorId) {
            success = await updateDoctorData(editingDoctorId, newDoctor);
            if (success) setDoctorUploadSuccess('Doctor updated successfully!');
        } else {
            success = await addDoctor(newDoctor);
            if (success) setDoctorUploadSuccess('Doctor added successfully!');
        }

        if (success !== false) {
            setNewDoctor({ name: '', specialty: '', experience: 'Experienced', about: '', image_base64: '', availability_start: '06:00 PM', availability_end: '10:00 PM' });
            setEditingDoctorId(null);
            setTimeout(() => setDoctorUploadSuccess(false), 3000);
        }
    };

    const handleEditDoctor = (doc) => {
        setNewDoctor({
            name: doc.name,
            specialty: doc.specialty,
            experience: doc.experience || 'Experienced',
            about: doc.about || '',
            image_base64: doc.image_base64 || '',
            availability_start: doc.availability_start || '06:00 PM',
            availability_end: doc.availability_end || '10:00 PM'
        });
        setEditingDoctorId(doc.id);
        // Scroll to form if not in view
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelDoctorEdit = () => {
        setNewDoctor({ name: '', specialty: '', experience: 'Experienced', about: '', image_base64: '', availability_start: '06:00 PM', availability_end: '10:00 PM' });
        setEditingDoctorId(null);
    };

    const handleDeleteDoctor = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete Dr. ${name}?`)) {
            const success = await deleteDoctor(id);
            if (!success) {
                alert('Failed to delete doctor. Please try again.');
            }
        }
    };

    const timeOptions = [
        '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
        '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'
    ];

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
                        className={`admin-nav-item ${activeTab === 'prescriptions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('prescriptions')}
                    >
                        <Paperclip size={20} />
                        Prescriptions
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

                    <button className="admin-nav-item text-danger mobile-logout-only" onClick={handleLogout}>
                        <LogOut size={20} />
                        Logout
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <h1 className="title">
                        {activeTab === 'orders' ? 'Customer Orders' : activeTab === 'appointments' ? 'Doctor Appointments' : activeTab === 'upload' ? (editingMedicineId ? 'Edit Medicine' : 'Add New Medicine') : 'Edit Doctors'}
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
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                            {order.items.map((item, idx) => (
                                                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                    {item.image ? (
                                                                        <img
                                                                            src={item.image}
                                                                            alt={item.name}
                                                                            style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '6px', background: '#f1f5f9', border: '1px solid #e2e8f0', flexShrink: 0 }}
                                                                        />
                                                                    ) : (
                                                                        <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                                            <Package size={16} style={{ color: '#94a3b8' }} />
                                                                        </div>
                                                                    )}
                                                                    <span style={{ fontSize: '0.85rem' }}>{item.name} <strong>x{item.quantity}</strong></span>
                                                                </div>
                                                            ))}
                                                        </div>
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
                                                <th>Date</th>
                                                <th>Contact</th>
                                                <th>Token #</th>
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
                                                        </div>
                                                    </td>
                                                    <td>{apt.phone}</td>
                                                    <td>
                                                        {editingTokenId === apt.id ? (
                                                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    value={tokenValue}
                                                                    onChange={e => setTokenValue(e.target.value)}
                                                                    style={{ width: '60px', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                                                                    placeholder="#"
                                                                />
                                                                <button
                                                                    className="btn-icon accept"
                                                                    onClick={() => handleTokenSave(apt.id)}
                                                                    title="Save Token"
                                                                    style={{ width: '28px', height: '28px' }}
                                                                >
                                                                    <CheckCircle size={14} />
                                                                </button>
                                                                <button
                                                                    className="btn-icon reject"
                                                                    onClick={() => { setEditingTokenId(null); setTokenValue(''); }}
                                                                    title="Cancel"
                                                                    style={{ width: '28px', height: '28px' }}
                                                                >
                                                                    <X size={14} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                {apt.token_number ? (
                                                                    <span className="token-badge">
                                                                        <Hash size={12} /> {apt.token_number}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-muted text-sm">—</span>
                                                                )}
                                                                <button
                                                                    className="btn-icon accept"
                                                                    onClick={() => handleTokenEdit(apt)}
                                                                    title="Assign/Edit Token"
                                                                    style={{ width: '26px', height: '26px', background: '#e0f2fe', color: 'var(--primary)', border: '1px solid #bae6fd' }}
                                                                >
                                                                    <Edit2 size={12} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
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

                    {activeTab === 'prescriptions' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="prescriptions-view"
                        >
                            {prescriptions.length === 0 ? (
                                <div className="empty-state glass-panel">
                                    <Paperclip size={48} className="text-muted" />
                                    <h3>No Prescriptions Yet</h3>
                                    <p>Patient uploaded prescriptions for lab tests will appear here.</p>
                                </div>
                            ) : (
                                <div className="appointments-table-wrapper glass-panel">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Upload Date</th>
                                                <th>Prescription Image</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {prescriptions.map(pres => (
                                                <tr key={pres.id}>
                                                    <td>
                                                        <strong>{new Date(pres.created_at).toLocaleDateString()}</strong><br />
                                                        <span className="text-muted text-sm">{new Date(pres.created_at).toLocaleTimeString()}</span>
                                                    </td>
                                                    <td>
                                                        <div 
                                                            className="prescription-thumbnail"
                                                            style={{ cursor: 'pointer', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', width: '120px', height: '120px' }}
                                                            onClick={() => window.open(pres.image_base64, '_blank')}
                                                        >
                                                            <img 
                                                                src={pres.image_base64} 
                                                                alt="Prescription" 
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                            />
                                                        </div>
                                                        <span className="text-muted text-xs">Click to enlarge</span>
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge ${pres.status.toLowerCase()}`}>
                                                            {pres.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {pres.status === 'Pending' && (
                                                            <div className="action-buttons">
                                                                <button
                                                                    className="btn-icon accept"
                                                                    onClick={() => updatePrescriptionStatus(pres.id, 'Processed')}
                                                                    title="Mark as Processed"
                                                                >
                                                                    <CheckCircle size={18} />
                                                                </button>
                                                                <button
                                                                    className="btn-icon reject"
                                                                    onClick={() => updatePrescriptionStatus(pres.id, 'Cancelled')}
                                                                    title="Reject"
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
                            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
                        >
                            <div className="upload-form-container glass-panel" style={{ padding: '2rem' }}>
                                {uploadSuccess ? (
                                    <div className="success-state text-center" style={{ padding: '3rem' }}>
                                        <CheckCircle size={64} className="text-primary" style={{ margin: '0 auto 1rem' }} />
                                        <h3>{uploadSuccess}</h3>
                                        <p className="text-muted">The product is now available in the store.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleMedicineSubmit} className="upload-form">
                                        <div className="form-row">
                                            <div className="input-group">
                                                <label className="input-label" style={{ fontWeight: 600, color: '#334155' }}>Medicine Name <span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="input-field"
                                                    placeholder="e.g. Paracetamol 500mg"
                                                    value={newMedicine.name}
                                                    onChange={e => setNewMedicine({ ...newMedicine, name: e.target.value })}
                                                    style={{ background: 'white' }}
                                                />
                                            </div>

                                            <div className="input-group">
                                                <label className="input-label" style={{ fontWeight: 600, color: '#334155' }}>Category <span className="text-danger">*</span></label>
                                                <select
                                                    required
                                                    className="input-field"
                                                    value={newMedicine.category}
                                                    onChange={e => setNewMedicine({ ...newMedicine, category: e.target.value })}
                                                    style={{ background: 'white' }}
                                                >
                                                    <option value="">Select Category</option>
                                                    <option value="Fever & Pain">Fever & Pain</option>
                                                    <option value="Antibiotics">Antibiotics</option>
                                                    <option value="Allergy">Allergy</option>
                                                    <option value="Supplements">Supplements</option>
                                                    <option value="Digestion">Digestion</option>
                                                    <option value="First Aid">First Aid</option>
                                                    <option value="Baby Care">Baby Care</option>
                                                    <option value="Pharmacy">Pharmacy</option>
                                                    <option value="Skin Care">Skin Care</option>
                                                    <option value="Vitamins">Vitamins</option>
                                                    <option value="Personal Care">Personal Care</option>
                                                    <option value="Ayurvedic">Ayurvedic</option>
                                                    <option value="Pain Relief">Pain Relief</option>
                                                    <option value="Healthcare Devices">Healthcare Devices</option>
                                                    <option value="Home Care">Home Care</option>
                                                    <option value="Sexual Wellness">Sexual Wellness</option>
                                                    <option value="Maternity Care">Maternity Care</option>
                                                    <option value="Surgical Products">Ortho &amp; Surgical Products</option>
                                                    <option value="Physiotherapy">Physiotherapy</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="input-group">
                                                <label className="input-label" style={{ fontWeight: 600, color: '#334155' }}>Selling Price (₹) <span className="text-danger">*</span></label>
                                                <input
                                                    type="number"
                                                    required
                                                    min="0" step="0.01"
                                                    className="input-field"
                                                    placeholder="e.g. 5.99"
                                                    value={newMedicine.price}
                                                    onChange={e => setNewMedicine({ ...newMedicine, price: e.target.value })}
                                                    style={{ background: 'white' }}
                                                />
                                            </div>

                                            <div className="input-group">
                                                <label className="input-label" style={{ fontWeight: 600, color: '#334155' }}>Stock Quantity <span className="text-danger">*</span></label>
                                                <input
                                                    type="number"
                                                    required
                                                    min="0"
                                                    className="input-field"
                                                    placeholder="e.g. 50"
                                                    value={newMedicine.stockQuantity}
                                                    onChange={e => setNewMedicine({ ...newMedicine, stockQuantity: e.target.value })}
                                                    style={{ background: 'white' }}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="input-group">
                                                <label className="input-label" style={{ fontWeight: 600, color: '#334155' }}>Sales Discount (%)</label>
                                                <input
                                                    type="number"
                                                    min="0" max="100"
                                                    className="input-field"
                                                    placeholder="e.g. 10"
                                                    value={newMedicine.discount}
                                                    onChange={e => setNewMedicine({ ...newMedicine, discount: e.target.value })}
                                                    style={{ background: 'white' }}
                                                />
                                            </div>
                                        </div>

                                        <div className="input-group">
                                            <label className="input-label" style={{ fontWeight: 600, color: '#334155' }}>Combination / Composition</label>
                                            <textarea
                                                className="input-field"
                                                rows="2"
                                                placeholder="e.g. Paracetamol + Caffeine"
                                                value={newMedicine.combination}
                                                onChange={e => setNewMedicine({ ...newMedicine, combination: e.target.value })}
                                                style={{ background: 'white', resize: 'vertical' }}
                                            ></textarea>
                                        </div>

                                        <div className="input-group">
                                            <label className="input-label" style={{ fontWeight: 600, color: '#334155' }}>Medicine Images</label>
                                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', background: 'white' }}>
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    id="med-image"
                                                    style={{ display: 'none' }}
                                                    onChange={e => handleImageUpload(e, (base64Images) => {
                                                        setNewMedicine(prev => ({
                                                            ...prev,
                                                            images: [...prev.images, ...base64Images]
                                                        }));
                                                    })}
                                                />
                                                <label htmlFor="med-image" style={{ background: '#f1f5f9', padding: '0.65rem 1rem', borderRight: '1px solid var(--border-color)', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem', color: '#334155', borderTopLeftRadius: 'var(--border-radius-sm)', borderBottomLeftRadius: 'var(--border-radius-sm)' }}>
                                                    Choose File
                                                </label>
                                                <span style={{ padding: '0 1rem', color: '#64748b', fontSize: '0.9rem' }}>
                                                    {newMedicine.images.length > 0 ? `${newMedicine.images.length} Image(s) selected` : 'No file chosen'}
                                                </span>
                                            </div>
                                            {newMedicine.images.length > 0 && (
                                                <div style={{ marginTop: '15px', display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                                                    {newMedicine.images.map((img, idx) => (
                                                        <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                                                            <img src={img} alt={`Preview ${idx}`} style={{ width: '100px', height: '100px', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--border-color)', padding: '5px', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const updatedImages = [...newMedicine.images];
                                                                    updatedImages.splice(idx, 1);
                                                                    setNewMedicine({ ...newMedicine, images: updatedImages });
                                                                }}
                                                                style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white', cursor: 'pointer', zIndex: 2 }}
                                                                title="Delete Image"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="input-group">
                                            <label className="input-label" style={{ fontWeight: 600, color: '#334155' }}>Description</label>
                                            <textarea
                                                className="input-field"
                                                rows="5"
                                                placeholder="Briefly describe the medicine, dosage, and uses..."
                                                value={newMedicine.description}
                                                onChange={e => setNewMedicine({ ...newMedicine, description: e.target.value })}
                                                style={{ background: 'white', resize: 'vertical' }}
                                            ></textarea>
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '30px' }}>
                                                {editingMedicineId ? (
                                                    <><Save size={18} style={{ marginRight: '6px' }} /> Update Product</>
                                                ) : (
                                                    <><Paperclip size={18} style={{ transform: 'rotate(-45deg)', marginRight: '6px' }} /> Upload Product to Store</>
                                                )}
                                            </button>

                                            {editingMedicineId && (
                                                <button type="button" className="btn btn-outline" onClick={cancelEdit} style={{ borderRadius: '30px' }}>
                                                    <X size={18} /> Cancel Edit
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                )}
                            </div>

                            <div className="manage-medicines-container glass-panel" style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <h3 style={{ margin: 0 }}>Manage Existing Medicines</h3>
                                    <div className="admin-search-wrapper">
                                        <Search className="search-icon" size={18} />
                                        <input
                                            type="text"
                                            className="admin-search-input"
                                            placeholder="Search medicines..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="medicines-scroll-wrapper">
                                    <div className="appointments-table-wrapper">
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>Image</th>
                                                    <th>Name / Comb.</th>
                                                    <th>Category</th>
                                                    <th>Price / Disc.</th>
                                                    <th>Stock Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {medicines.filter(m =>
                                                    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    (m.combination && m.combination.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                                    m.category.toLowerCase().includes(searchTerm.toLowerCase())
                                                ).map(med => (
                                                    <tr key={med.id}>
                                                        <td>
                                                            <img
                                                                src={(Array.isArray(med.images) && med.images.length > 0) ? med.images[0] : (med.image_base64 || 'https://via.placeholder.com/50')}
                                                                alt={med.name}
                                                                style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px', background: 'white', border: '1px solid #e2e8f0' }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <strong>{med.name}</strong><br />
                                                            {med.combination && <span className="text-muted text-sm">{med.combination}</span>}
                                                        </td>
                                                        <td>{med.category}</td>
                                                        <td>
                                                            ₹{med.price}
                                                            {med.discount > 0 && <span style={{ marginLeft: '8px', color: '#ea580c', fontSize: '0.8rem', fontWeight: 'bold' }}>-{med.discount}%</span>}
                                                        </td>
                                                        <td>
                                                            <button
                                                                className={`stock-toggle-btn ${med.inStock ? 'in-stock' : 'out-of-stock'}`}
                                                                onClick={() => handleToggleStock(med.id, med.inStock)}
                                                                title={med.inStock ? 'Click to mark Out of Stock' : 'Click to mark In Stock'}
                                                            >
                                                                {med.inStock ? (
                                                                    <><ToggleRight size={20} /> In Stock</>
                                                                ) : (
                                                                    <><ToggleLeft size={20} /> Out of Stock</>
                                                                )}
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                                <button
                                                                    className="btn-icon accept"
                                                                    onClick={() => handleEditMedicine(med)}
                                                                    title="Edit Medicine"
                                                                    style={{ background: '#e0f2fe', color: 'var(--primary)', border: '1px solid #bae6fd' }}
                                                                >
                                                                    <Edit2 size={16} />
                                                                </button>
                                                                <button
                                                                    className="btn-icon reject"
                                                                    onClick={() => handleDeleteMedicine(med.id, med.name)}
                                                                    title="Delete Medicine"
                                                                    style={{ background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca' }}
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {medicines.length === 0 && (
                                                    <tr>
                                                        <td colSpan="6" className="text-center text-muted" style={{ padding: '2rem' }}>No medicines found in the store.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
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
                                                    onChange={e => handleImageUpload(e, (base64) => setNewDoctor(prev => ({ ...prev, image_base64: base64[0] })))}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="input-group">
                                                <label className="input-label">Availability Start Time</label>
                                                <input
                                                    type="text"
                                                    className="input-field"
                                                    list="time-options"
                                                    placeholder="e.g. 06:00 PM"
                                                    value={newDoctor.availability_start}
                                                    onChange={e => setNewDoctor({ ...newDoctor, availability_start: e.target.value })}
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label className="input-label">Availability End Time</label>
                                                <input
                                                    type="text"
                                                    className="input-field"
                                                    list="time-options"
                                                    placeholder="e.g. 10:00 PM"
                                                    value={newDoctor.availability_end}
                                                    onChange={e => setNewDoctor({ ...newDoctor, availability_end: e.target.value })}
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
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                            <button type="submit" className="btn btn-primary" style={{ borderRadius: '30px' }}>
                                                {editingDoctorId ? (
                                                    <><Save size={18} style={{ marginRight: '6px' }} /> Update Profile</>
                                                ) : (
                                                    <><Users size={18} style={{ marginRight: '6px' }} /> Add Doctor</>
                                                )}
                                            </button>
                                            {editingDoctorId && (
                                                <button type="button" className="btn btn-outline" onClick={cancelDoctorEdit} style={{ borderRadius: '30px' }}>
                                                    <X size={18} /> Cancel
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                )}
                            </div>

                            <hr style={{ borderColor: 'var(--border-color)', margin: '1rem 0' }} />

                            <div>
                                <h3>Manage Existing Doctors</h3>
                                <div className="appointments-table-wrapper" style={{ marginTop: '1rem' }}>
                                    <table className="admin-table" style={{ marginTop: '1rem' }}>
                                        <thead>
                                            <tr>
                                                <th>Current Photo</th>
                                                <th>Name</th>
                                                <th>Specialty</th>
                                                <th>Availability</th>
                                                <th>Actions</th>
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
                                                        {editingAvailId === doc.id ? (
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                                                    <input
                                                                        type="text"
                                                                        list="time-options"
                                                                        value={availStart}
                                                                        onChange={e => setAvailStart(e.target.value)}
                                                                        style={{ width: '100px', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}
                                                                        placeholder="Start"
                                                                    />
                                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>to</span>
                                                                    <input
                                                                        type="text"
                                                                        list="time-options"
                                                                        value={availEnd}
                                                                        onChange={e => setAvailEnd(e.target.value)}
                                                                        style={{ width: '100px', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}
                                                                        placeholder="End"
                                                                    />
                                                                </div>
                                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                                    <button className="btn-icon accept" onClick={() => handleAvailSave(doc.id)} style={{ width: '26px', height: '26px' }}><CheckCircle size={14} /></button>
                                                                    <button className="btn-icon reject" onClick={() => setEditingAvailId(null)} style={{ width: '26px', height: '26px' }}><X size={14} /></button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                <span className="availability-badge">
                                                                    <Clock size={12} /> {doc.availability_start} - {doc.availability_end}
                                                                </span>
                                                                <button
                                                                    className="btn-icon accept"
                                                                    onClick={() => handleAvailEdit(doc)}
                                                                    title="Edit Availability"
                                                                    style={{ width: '26px', height: '26px', background: '#e0f2fe', color: 'var(--primary)', border: '1px solid #bae6fd' }}
                                                                >
                                                                    <Edit2 size={12} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button
                                                                className="btn-icon accept"
                                                                onClick={() => handleEditDoctor(doc)}
                                                                title="Edit Doctor Details"
                                                                style={{ width: '32px', height: '32px' }}
                                                            >
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <div style={{ position: 'relative', overflow: 'hidden', width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => {
                                                                        handleImageUpload(e, (base64) => {
                                                                            updateDoctorImage(doc.id, base64);
                                                                        });
                                                                    }}
                                                                    style={{ position: 'absolute', opacity: 0, scale: 2, cursor: 'pointer' }}
                                                                />
                                                                <Paperclip size={16} className="text-muted" />
                                                            </div>
                                                            <button
                                                                className="btn-icon reject"
                                                                onClick={() => handleDeleteDoctor(doc.id, doc.name)}
                                                                title="Delete Doctor"
                                                                style={{ width: '32px', height: '32px', background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca' }}
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <datalist id="time-options">
                                {timeOptions.map(t => <option key={t} value={t} />)}
                            </datalist>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;

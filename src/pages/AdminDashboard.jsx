import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Pill, LogOut, CheckCircle, Clock, X, Package, Paperclip, Edit2, Save, Trash2, ToggleLeft, ToggleRight, Hash, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './AdminDashboard.css';

function AdminDashboard() {
    const navigate = useNavigate();
    const { appointments, updateAppointmentStatus, updateAppointmentToken, orders, updateOrderStatus, addMedicine, updateMedicineData, deleteMedicine, toggleMedicineStock, medicines, doctors, updateDoctorImage, addDoctor, updateDoctorAvailability, updateDoctorData } = useApp();
    const [activeTab, setActiveTab] = useState('orders');
    const [newMedicine, setNewMedicine] = useState({
        name: '', combination: '', category: '', price: '', discount: '', description: '', stockQuantity: '', image_base64: ''
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
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => callback(reader.result);
            reader.readAsDataURL(file);
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
            image_base64: newMedicine.image_base64 || null
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

        setNewMedicine({ name: '', combination: '', category: '', price: '', discount: '', description: '', stockQuantity: '', image_base64: '' });
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
            image_base64: med.image_base64 || ''
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
                                                     <option value="Surgical Products">Surgical Products</option>
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
                                            <label className="input-label" style={{ fontWeight: 600, color: '#334155' }}>Medicine Image</label>
                                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', background: 'white' }}>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    id="med-image"
                                                    style={{ display: 'none' }}
                                                    onChange={e => handleImageUpload(e, (base64) => setNewMedicine({ ...newMedicine, image_base64: base64 }))}
                                                />
                                                <label htmlFor="med-image" style={{ background: '#f1f5f9', padding: '0.65rem 1rem', borderRight: '1px solid var(--border-color)', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem', color: '#334155', borderTopLeftRadius: 'var(--border-radius-sm)', borderBottomLeftRadius: 'var(--border-radius-sm)' }}>
                                                    Choose File
                                                </label>
                                                <span style={{ padding: '0 1rem', color: '#64748b', fontSize: '0.9rem' }}>
                                                    {newMedicine.image_base64 ? 'Image selected' : 'No file chosen'}
                                                </span>
                                            </div>
                                            {newMedicine.image_base64 && (
                                                <div style={{ marginTop: '10px', position: 'relative', display: 'inline-block' }}>
                                                    <img src={newMedicine.image_base64} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'contain', borderRadius: '4px', border: '1px solid var(--border-color)', padding: '4px', background: 'white' }} />
                                                    {editingMedicineId && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setNewMedicine({ ...newMedicine, image_base64: '' })}
                                                            style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}
                                                            title="Delete Image"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    )}
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
                                                                src={med.image_base64 || 'https://via.placeholder.com/50'}
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
                                                    onChange={e => handleImageUpload(e, (base64) => setNewDoctor({ ...newDoctor, image_base64: base64 }))}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="input-group">
                                                <label className="input-label">Availability Start Time</label>
                                                <select
                                                    className="input-field"
                                                    value={newDoctor.availability_start}
                                                    onChange={e => setNewDoctor({ ...newDoctor, availability_start: e.target.value })}
                                                >
                                                    {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                            </div>
                                            <div className="input-group">
                                                <label className="input-label">Availability End Time</label>
                                                <select
                                                    className="input-field"
                                                    value={newDoctor.availability_end}
                                                    onChange={e => setNewDoctor({ ...newDoctor, availability_end: e.target.value })}
                                                >
                                                    {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                                </select>
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
                                                                    <select
                                                                        value={availStart}
                                                                        onChange={e => setAvailStart(e.target.value)}
                                                                        style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}
                                                                    >
                                                                        {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                                                    </select>
                                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>to</span>
                                                                    <select
                                                                        value={availEnd}
                                                                        onChange={e => setAvailEnd(e.target.value)}
                                                                        style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}
                                                                    >
                                                                        {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                                                    </select>
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
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;

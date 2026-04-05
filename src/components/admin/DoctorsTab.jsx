import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle, Save, X, Clock, Edit2, Paperclip, Trash2 } from 'lucide-react';
import { uploadToCloudinary } from '../../lib/cloudinary';

const DoctorsTab = memo(({ doctors, addDoctor, updateDoctorData, updateDoctorAvailability, updateDoctorImage, deleteDoctor }) => {
    const [newDoctor, setNewDoctor] = useState({
        name: '', specialty: '', experience: 'Experienced', about: '', image_base64: '',
        availability_start: '06:00 PM', availability_end: '10:00 PM'
    });
    const [doctorUploadSuccess, setDoctorUploadSuccess] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [editingDoctorId, setEditingDoctorId] = useState(null);
    const [editingAvailId, setEditingAvailId] = useState(null);
    const [availStart, setAvailStart] = useState('');
    const [availEnd, setAvailEnd] = useState('');

    const timeOptions = [
        '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
        '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'
    ];

    const handleImageUpload = async (e, callback) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setIsUploading(true);
            try {
                const url = await uploadToCloudinary(files[0]);
                callback(url);
            } catch (error) {
                console.error("Upload failed:", error);
                alert("Failed to upload image. Make sure you have created an Unsigned Upload Preset named 'guardian_pharma_uploads' in Cloudinary Settings.");
            } finally {
                setIsUploading(false);
            }
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
            name: doc.name, specialty: doc.specialty, experience: doc.experience || 'Experienced',
            about: doc.about || '', image_base64: doc.image_base64 || '',
            availability_start: doc.availability_start || '06:00 PM', availability_end: doc.availability_end || '10:00 PM'
        });
        setEditingDoctorId(doc.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
        }
    };

    const handleDeleteDoctor = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete Dr. ${name}? This will also delete all of their upcoming appointments.`)) {
            const success = await deleteDoctor(id);
            if (success) {
                setDoctorUploadSuccess('Doctor profile deleted successfully!');
                setTimeout(() => setDoctorUploadSuccess(false), 3000);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="doctors-edit-view glass-panel"
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1.5rem' }}
        >
            <div className="add-doctor-section">
                <h3>{editingDoctorId ? 'Edit Doctor' : 'Add New Doctor'}</h3>
                {doctorUploadSuccess ? (
                    <div className="success-state text-center" style={{ padding: '2rem' }}>
                        <CheckCircle size={48} className="text-primary" style={{ margin: '0 auto 1rem' }} />
                        <h4>{doctorUploadSuccess}</h4>
                    </div>
                ) : (
                    <form onSubmit={handleDoctorSubmit} className="upload-form" style={{ marginTop: '1rem' }}>
                        <div className="form-row">
                            <div className="input-group">
                                <label className="input-label">Doctor Name</label>
                                <input
                                    type="text" required className="input-field"
                                    placeholder="e.g. Dr. Sarah Smith"
                                    value={newDoctor.name}
                                    onChange={e => setNewDoctor({ ...newDoctor, name: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Specialty</label>
                                <input
                                    type="text" required className="input-field"
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
                                    type="text" required className="input-field"
                                    placeholder="e.g. 10 Years"
                                    value={newDoctor.experience}
                                    onChange={e => setNewDoctor({ ...newDoctor, experience: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Photo {isUploading && <span style={{ fontSize: '0.8rem', color: 'var(--primary)', marginLeft: '8px' }}>(Uploading...)</span>}</label>
                                <input
                                    type="file" accept="image/*" className="input-field"
                                    style={{ padding: '0.5rem' }}
                                    disabled={isUploading}
                                    onChange={e => handleImageUpload(e, (url) => setNewDoctor(prev => ({ ...prev, image_base64: url })))}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="input-group">
                                <label className="input-label">Availability Start Time</label>
                                <input
                                    type="text" className="input-field" list="time-options"
                                    placeholder="e.g. 06:00 PM"
                                    value={newDoctor.availability_start}
                                    onChange={e => setNewDoctor({ ...newDoctor, availability_start: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Availability End Time</label>
                                <input
                                    type="text" className="input-field" list="time-options"
                                    placeholder="e.g. 10:00 PM"
                                    value={newDoctor.availability_end}
                                    onChange={e => setNewDoctor({ ...newDoctor, availability_end: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="input-label">About</label>
                            <textarea
                                required className="input-field" rows="3"
                                placeholder="Briefly describe the doctor..."
                                value={newDoctor.about}
                                onChange={e => setNewDoctor({ ...newDoctor, about: e.target.value })}
                            ></textarea>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ borderRadius: '30px', display: 'flex', alignItems: 'center' }}>
                                {editingDoctorId ? <><Save size={18} style={{ marginRight: '6px' }} /> Update Profile</> : <><Users size={18} style={{ marginRight: '6px' }} /> Add Doctor</>}
                            </button>
                            {editingDoctorId && (
                                <button type="button" className="btn btn-outline" onClick={() => { setEditingDoctorId(null); setNewDoctor({ name: '', specialty: '', experience: 'Experienced', about: '', image_base64: '', availability_start: '06:00 PM', availability_end: '10:00 PM' }); }} style={{ borderRadius: '30px' }}>
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
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Photo</th>
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
                                            loading="lazy"
                                        />
                                    </td>
                                    <td><strong>{doc.name}</strong></td>
                                    <td>{doc.specialty}</td>
                                    <td>
                                        {editingAvailId === doc.id ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                                    <input
                                                        type="text" list="time-options" value={availStart}
                                                        onChange={e => setAvailStart(e.target.value)}
                                                        style={{ width: '100px', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}
                                                    />
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>to</span>
                                                    <input
                                                        type="text" list="time-options" value={availEnd}
                                                        onChange={e => setAvailEnd(e.target.value)}
                                                        style={{ width: '100px', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}
                                                    />
                                                </div>
                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                    <button className="btn-icon accept" onClick={() => handleAvailSave(doc.id)}><CheckCircle size={14} /></button>
                                                    <button className="btn-icon reject" onClick={() => setEditingAvailId(null)}><X size={14} /></button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span className="availability-badge">
                                                    <Clock size={12} /> {doc.availability_start} - {doc.availability_end}
                                                </span>
                                                <button
                                                    className="btn-icon accept" onClick={() => handleAvailEdit(doc)}
                                                    style={{ width: '26px', height: '26px', background: '#e0f2fe', color: 'var(--primary)', border: '1px solid #bae6fd' }}
                                                >
                                                    <Edit2 size={12} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-icon accept" onClick={() => handleEditDoctor(doc)} title="Edit"><Edit2 size={16} /></button>
                                            <div style={{ position: 'relative', overflow: 'hidden', width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <input
                                                    type="file" accept="image/*"
                                                    onChange={(e) => handleImageUpload(e, (base64) => updateDoctorImage(doc.id, base64))}
                                                    style={{ position: 'absolute', opacity: 0, scale: 2, cursor: 'pointer' }}
                                                />
                                                <Paperclip size={16} className="text-muted" />
                                            </div>
                                            <button className="btn-icon reject" onClick={() => handleDeleteDoctor(doc.id, doc.name)} title="Delete"><Trash2 size={16} /></button>
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
    );
});

export default DoctorsTab;

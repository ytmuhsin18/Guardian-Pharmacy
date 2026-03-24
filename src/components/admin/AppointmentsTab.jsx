import React, { memo, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, X, Hash, Edit2, Search } from 'lucide-react';

const AppointmentsTab = memo(({ appointments, updateAppointmentStatus, updateAppointmentToken }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingTokenId, setEditingTokenId] = useState(null);
    const [tokenValue, setTokenValue] = useState('');

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

    const filteredAppointments = useMemo(() => {
        if (!searchTerm) return appointments;
        const lowTerm = searchTerm.toLowerCase();
        return appointments.filter(apt => 
            (apt.patientName && apt.patientName.toLowerCase().includes(lowTerm)) ||
            (apt.phone && apt.phone.includes(searchTerm)) ||
            (apt.doctorName && apt.doctorName.toLowerCase().includes(lowTerm))
        );
    }, [appointments, searchTerm]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="appointments-view"
        >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                <div className="admin-search-wrapper" style={{ width: '100%', maxWidth: '350px' }}>
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        className="admin-search-input"
                        placeholder="Search by Patient Name or Mobile..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredAppointments.length === 0 ? (
                <div className="empty-state glass-panel">
                    {searchTerm ? (
                        <>
                            <Search size={48} className="text-muted" />
                            <h3>No results found</h3>
                            <p>No appointments match "{searchTerm}"</p>
                        </>
                    ) : (
                        <>
                            <Clock size={48} className="text-muted" />
                            <h3>No Appointments Yet</h3>
                            <p>When patients book home visits, they will appear here.</p>
                        </>
                    )}
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
                            {filteredAppointments.map(apt => (
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
                                                    autoFocus
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
    );
});

export default AppointmentsTab;

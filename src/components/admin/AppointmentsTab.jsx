import React, { memo, useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, X, Hash, Edit2, Search, Filter } from 'lucide-react';

const AppointmentsTab = memo(({ appointments, updateAppointmentStatus, updateAppointmentToken }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDoctor, setFilterDoctor] = useState(
        () => localStorage.getItem('admin_apt_filter_doctor') || 'all'
    );
    const [editingTokenId, setEditingTokenId] = useState(null);
    const [tokenValue, setTokenValue] = useState('');

    // Save filter to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('admin_apt_filter_doctor', filterDoctor);
    }, [filterDoctor]);

    // Get unique doctor names for the filter dropdown
    const doctorOptions = useMemo(() => {
        const names = [...new Set(appointments.map(a => a.doctorName).filter(Boolean))];
        return names.sort();
    }, [appointments]);

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
        return appointments.filter(apt => {
            const lowTerm = searchTerm.toLowerCase();
            const matchesSearch = !searchTerm ||
                (apt.patientName && apt.patientName.toLowerCase().includes(lowTerm)) ||
                (apt.phone && apt.phone.includes(searchTerm)) ||
                (apt.doctorName && apt.doctorName.toLowerCase().includes(lowTerm));
            const matchesDoctor = filterDoctor === 'all' || apt.doctorName === filterDoctor;
            return matchesSearch && matchesDoctor;
        });
    }, [appointments, searchTerm, filterDoctor]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="appointments-view"
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
                {/* Doctor Filter Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Filter size={16} style={{ color: 'var(--text-muted)' }} />
                    <select
                        value={filterDoctor}
                        onChange={(e) => setFilterDoctor(e.target.value)}
                        style={{
                            padding: '10px 16px',
                            borderRadius: '12px',
                            border: '1.5px solid var(--border-color)',
                            background: 'white',
                            fontSize: '0.88rem',
                            fontWeight: 600,
                            color: 'var(--text-main)',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            minWidth: '200px',
                            outline: 'none',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        }}
                    >
                        <option value="all">All Doctors</option>
                        {doctorOptions.map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                    {filterDoctor !== 'all' && (
                        <button
                            onClick={() => setFilterDoctor('all')}
                            style={{
                                background: '#fee2e2',
                                color: '#ef4444',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '6px 12px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                fontFamily: 'inherit'
                            }}
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Search */}
                <div className="admin-search-wrapper" style={{ width: '100%', maxWidth: '320px' }}>
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        className="admin-search-input"
                        placeholder="Search patient or mobile..."
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
                                <th className="nowrap-cell">Date</th>
                                <th className="nowrap-cell">Time/Slot</th>
                                <th className="nowrap-cell">Contact</th>
                                <th className="nowrap-cell">Token #</th>
                                <th className="nowrap-cell">Status</th>
                                <th className="nowrap-cell">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.map(apt => (
                                <tr key={apt.id}>
                                    <td><strong>{apt.patientName}</strong></td>
                                    <td>{apt.doctorName}</td>
                                    <td className="nowrap-cell">
                                        <div className="date-time-cell">
                                            <span>{apt.date}</span>
                                        </div>
                                    </td>
                                    <td className="nowrap-cell">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Clock size={14} style={{ color: '#0d9488' }} />
                                            <span style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.9rem' }}>{apt.time || 'Not specified'}</span>
                                        </div>
                                    </td>
                                    <td className="nowrap-cell">{apt.phone}</td>
                                    <td className="nowrap-cell">
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
                                    <td className="nowrap-cell">
                                        <span className={`status-badge ${apt.status.toLowerCase()}`}>
                                            {apt.status}
                                        </span>
                                    </td>
                                    <td className="nowrap-cell">
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

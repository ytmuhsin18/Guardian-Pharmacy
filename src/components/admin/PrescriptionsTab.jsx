import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Paperclip, CheckCircle, X } from 'lucide-react';

const PrescriptionsTab = memo(({ prescriptions, updatePrescriptionStatus }) => {
    return (
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
    );
});

export default PrescriptionsTab;

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle, X } from 'lucide-react';

const OrdersTab = memo(({ orders, updateOrderStatus }) => {
    return (
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
    );
});

export default OrdersTab;

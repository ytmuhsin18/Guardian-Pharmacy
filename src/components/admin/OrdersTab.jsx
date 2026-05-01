import React, { memo, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle, X, Search, Truck, Banknote, CreditCard } from 'lucide-react';
import OrderPrintSlip from './OrderPrintSlip';

const OrdersTab = memo(({ orders, updateOrderStatus, medicines = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOrders = useMemo(() => {
        if (!searchTerm.trim()) return orders;
        const lowSearch = searchTerm.toLowerCase();
        return orders.filter(order =>
            (order.customer_name || '').toLowerCase().includes(lowSearch) ||
            (order.phone || '').includes(lowSearch) ||
            (order.whatsapp || '').includes(lowSearch)
        );
    }, [orders, searchTerm]);

    const getItemImage = (item) => {
        if (item.image) return item.image;
        if (medicines.length > 0) {
            const med = medicines.find(m => m.id === item.id);
            return med?.image_base64 || med?.images?.[0];
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="appointments-view"
        >
            {/* Search Bar Container */}
            <div className="search-bar-premium" style={{ marginBottom: '2rem' }}>
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    placeholder="Search by name, phone or address..."
                    className="input-field"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredOrders.length === 0 ? (
                <div className="empty-state glass-panel">
                    <Package size={48} className="text-muted" />
                    <h3>{searchTerm ? 'No matching orders found' : 'No Orders Yet'}</h3>
                    <p>{searchTerm ? 'Try a different name or number.' : 'When customers place orders, they will appear here.'}</p>
                </div>
            ) : (
                <div className="appointments-table-wrapper glass-panel" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Customer Details</th>
                                <th>Items Ordered</th>
                                <th className="nowrap-cell">Total</th>
                                <th className="nowrap-cell">Status</th>
                                <th className="nowrap-cell">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order.id} className="order-row-premium">
                                    <td className="customer-info-cell">
                                        <span className="customer-name-meta">{order.customer_name}</span>
                                        <div className="customer-contact-meta">
                                            <span>{order.phone}</span>
                                            {order.whatsapp && <span style={{ color: '#059669', opacity: 0.8 }}>WA: {order.whatsapp}</span>}
                                        </div>
                                        <div className="customer-address-meta" title={`${order.address}, ${order.pincode}`}>
                                            {order.address}, {order.pincode}
                                        </div>
                                    </td>
                                    <td className="items-ordered-cell">
                                        <div className="order-items-list">
                                            {(order.items || []).map((item, idx) => {
                                                const img = getItemImage(item);
                                                return (
                                                    <div key={idx} className="order-item-card">
                                                        {img ? (
                                                            <img
                                                                src={img}
                                                                alt={item.name}
                                                                className="order-item-img"
                                                            />
                                                        ) : (
                                                            <div className="order-item-placeholder">
                                                                <Package size={18} />
                                                            </div>
                                                        )}
                                                        <div className="order-item-details">
                                                            <span className="order-item-name" title={item.name}>{item.name}</span>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <span className="order-item-qty">Qty: {item.quantity}</span>
                                                                {item.selectedSize && (
                                                                    <span style={{
                                                                        fontSize: '0.7rem',
                                                                        background: '#f1f5f9',
                                                                        color: '#475569',
                                                                        padding: '1px 6px',
                                                                        borderRadius: '4px',
                                                                        border: '1px solid #e2e8f0',
                                                                        fontWeight: 700
                                                                    }}>
                                                                        Size: {item.selectedSize}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </td>
                                    <td className="total-amount-cell">
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {(() => {
                                                const itemsTotal = (order.items || []).reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);
                                                const deliveryFee = Math.max(0, Number(order.total_amount) - itemsTotal);

                                                return (
                                                    <>
                                                        <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', gap: '8px' }}>
                                                            <span>Items:</span>
                                                            <span style={{ fontWeight: 600 }}>₹{itemsTotal.toFixed(2)}</span>
                                                        </div>
                                                        <div style={{ fontSize: '0.8rem', color: deliveryFee > 0 ? '#64748b' : '#10b981', display: 'flex', gap: '8px' }}>
                                                            <span>Delivery:</span>
                                                            <span style={{ fontWeight: 600 }}>{deliveryFee > 0 ? `₹${deliveryFee.toFixed(2)}` : 'FREE'}</span>
                                                        </div>
                                                        <div style={{
                                                            fontSize: '1.2rem', fontWeight: 800, color: '#1e293b',
                                                            borderTop: '1px solid #f1f5f9', paddingTop: '4px', marginTop: '2px'
                                                        }}>
                                                            ₹{Number(order.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                            {(() => {
                                                const pMethod = order.payment_method || order.paymentMethod || 'COD';
                                                const normalized = pMethod.toLowerCase();
                                                const isOnline = normalized === 'online' || normalized === 'prepaid';

                                                return (
                                                    <div style={{
                                                        display: 'flex', alignItems: 'center', gap: '6px',
                                                        fontSize: '0.75rem', color: isOnline ? '#0984e3' : '#059669',
                                                        background: isOnline ? '#eff6ff' : '#ecfdf5',
                                                        padding: '4px 10px', borderRadius: '8px', width: 'fit-content',
                                                        fontWeight: 800, textTransform: 'uppercase',
                                                        border: `1px solid ${isOnline ? '#dbeafe' : '#d1fae5'}`,
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                                        marginTop: '4px'
                                                    }}>
                                                        {isOnline ? <CreditCard size={12} /> : <Banknote size={12} />}
                                                        {isOnline ? 'ONLINE' : 'COD'}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </td>
                                    <td className="nowrap-cell">
                                        <span className={`status-pill-premium ${(order.status || 'pending').toLowerCase().replace(/\s+/g, '-')}`}>
                                            <span className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="nowrap-cell">
                                        <div className="action-btns-premium">
                                            {order.status === 'Pending' && (
                                                <>
                                                    <button
                                                        className="btn-action-premium confirm"
                                                        onClick={() => updateOrderStatus(order.id, 'Confirmed')}
                                                        title="Confirm Order"
                                                    >
                                                        <CheckCircle size={20} />
                                                    </button>
                                                    <button
                                                        className="btn-action-premium cancel"
                                                        onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                                                        title="Cancel Order"
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                </>
                                            )}
                                            {order.status === 'Cancel Requested' && (
                                                <>
                                                    <button
                                                        className="btn-action-premium confirm"
                                                        style={{ color: '#ef4444', borderColor: '#ef4444', background: '#fef2f2' }}
                                                        onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                                                        title="Approve Cancellation"
                                                    >
                                                        <CheckCircle size={20} />
                                                    </button>
                                                    <button
                                                        className="btn-action-premium cancel"
                                                        style={{ color: '#10b981', borderColor: '#10b981', background: '#ecfdf5' }}
                                                        onClick={() => updateOrderStatus(order.id, 'Pending')}
                                                        title="Reject Cancellation"
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                </>
                                            )}
                                            {order.status === 'Confirmed' && (
                                                <button
                                                    className="btn-action-premium confirm"
                                                    style={{ color: '#0984e3', borderColor: '#0984e3', background: '#eff6ff' }}
                                                    onClick={() => updateOrderStatus(order.id, 'Out for Delivery')}
                                                    title="Set Out for Delivery"
                                                >
                                                    <Truck size={20} />
                                                </button>
                                            )}
                                            {order.status === 'Out for Delivery' && (
                                                <button
                                                    className="btn-action-premium confirm"
                                                    style={{ color: '#059669', borderColor: '#059669', background: '#ecfdf5' }}
                                                    onClick={() => updateOrderStatus(order.id, 'Delivered')}
                                                    title="Mark as Delivered"
                                                >
                                                    <CheckCircle size={20} />
                                                </button>
                                            )}
                                        </div>
                                        {/* Print Order Slip */}
                                        <OrderPrintSlip order={order} />
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

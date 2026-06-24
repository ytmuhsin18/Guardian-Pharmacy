import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Package, IndianRupee, PieChart, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardTab = ({ orders = [], appointments = [] }) => {
    const navigate = useNavigate();

    // Calculate metrics
    const totalOrders = orders.length;

    const totalSales = orders
        .filter(o => o.status !== 'Cancelled' && o.status !== 'Cancel Requested')
        .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const completedOrders = orders.filter(o => o.status === 'Delivered').length;
    const pendingAppointments = appointments.filter(a => a.status === 'Pending').length;

    const stats = [
        {
            title: 'Total Sales',
            value: `₹${totalSales.toLocaleString('en-IN')}`,
            icon: IndianRupee,
            color: '#10b981',
            trend: '+12%',
            isPositive: true
        },
        {
            title: 'Pending Orders',
            value: pendingOrders,
            icon: Package,
            color: '#f59e0b',
            trend: '-2%',
            isPositive: false
        },
        {
            title: 'Pending Appointments',
            value: pendingAppointments,
            icon: Calendar,
            color: '#0d9488',
            trend: '+5%',
            isPositive: true
        },
        {
            title: 'Completed Orders',
            value: completedOrders,
            icon: CheckCircleIcon,
            color: '#6366f1',
            trend: '+8%',
            isPositive: true
        }
    ];

    // Helper for completed icon
    function CheckCircleIcon(props) {
        return (
            <svg
                {...props}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        );
    }

    return (
        <div className="dashboard-tab">
            <div className="stats-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2.5rem'
            }}>
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        className="stat-card glass-panel"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -5, boxShadow: '0 12px 24px rgba(0,0,0,0.08)' }}
                        style={{
                            background: 'white',
                            padding: '1.75rem',
                            borderRadius: '28px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.25rem'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{
                                background: `${stat.color}15`,
                                color: stat.color,
                                width: '48px',
                                height: '48px',
                                borderRadius: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <stat.icon size={22} />
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.8rem',
                                color: stat.isPositive ? '#10b981' : '#ef4444',
                                fontWeight: 800,
                                background: stat.isPositive ? '#f0fdf4' : '#fef2f2',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                border: `1px solid ${stat.isPositive ? '#dcfce7' : '#fee2e2'}`
                            }}>
                                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {stat.trend}
                            </div>
                        </div>
                        <div>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0, fontWeight: 700, letterSpacing: '0.01em' }}>{stat.title}</p>
                            <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#1e293b', margin: '4px 0 0 0', letterSpacing: '-0.02em' }}>{stat.value}</h2>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="dashboard-actions-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
            }}>
                <motion.div
                    className="action-card-premium"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    style={{
                        background: 'linear-gradient(135deg, #0d9488, #10b981)',
                        padding: '2rem',
                        borderRadius: '28px',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer'
                    }}
                    onClick={() => navigate('/admin/analytics')}
                >
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <PieChart size={40} style={{ marginBottom: '1.5rem', opacity: 0.9 }} />
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Monthly Analytics</h3>
                        <p style={{ opacity: 0.9, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                            View detailed sales performance, customer growth, and product trends for the current month.
                        </p>
                        <button style={{
                            background: 'white',
                            color: '#0d9488',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '14px',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            View Report <Calendar size={18} />
                        </button>
                    </div>
                    {/* Decorative Blobs */}
                    <div style={{
                        position: 'absolute', top: '-10%', right: '-10%',
                        width: '150px', height: '150px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)', filter: 'blur(30px)'
                    }}></div>
                    <div style={{
                        position: 'absolute', bottom: '-20%', left: '-5%',
                        width: '120px', height: '120px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.05)', filter: 'blur(20px)'
                    }}></div>
                </motion.div>

                {/* More cards can be added here */}
                <div className="glass-panel" style={{
                    padding: '2rem',
                    borderRadius: '28px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    background: 'white'
                }}>
                    <TrendingUp size={48} color="#64748b" style={{ marginBottom: '1rem', opacity: 0.3 }} />
                    <h4 style={{ color: '#64748b', margin: 0 }}>Advanced Insights</h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        Predictive analytics and customer behavior tracking coming soon.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DashboardTab;

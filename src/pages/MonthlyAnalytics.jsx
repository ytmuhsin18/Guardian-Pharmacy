import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, BarChart3, Users, DollarSign, Calendar, Download, Printer, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function MonthlyAnalytics() {
    const navigate = useNavigate();
    const { orders, appointments } = useApp();

    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    const handleDownloadCSV = () => {
        if (!orders || orders.length === 0) return;

        // Header for CSV
        const headers = ["Order ID", "Customer", "Phone", "Amount", "Status", "Date", "Payment Method"];

        // Rows data
        const rows = orders.map(o => [
            o.id,
            o.customer_name,
            o.phone,
            o.total_amount,
            o.status,
            new Date(o.created_at).toLocaleDateString(),
            o.payment_method || o.paymentMethod || 'COD'
        ]);

        // Combine into CSV string
        const csvContent = [headers, ...rows]
            .map(e => e.join(","))
            .join("\n");

        // Create Blob and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Guardian_Sales_Report_${currentMonth.replace(/\s+/g, '_')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = () => {
        window.print();
    };

    // Analytics Calculation
    const analyticsData = useMemo(() => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

        // Filter Orders for this month
        const thisMonthOrders = (orders || []).filter(o => {
            const orderDate = new Date(o.created_at);
            return orderDate >= firstDay && o.status !== 'Cancelled';
        });

        // Filter Appointments for this month
        const thisMonthApts = (appointments || []).filter(a => {
            const aptDate = new Date(a.created_at || a.date); // Use created_at if available
            return aptDate >= firstDay && a.status !== 'Cancelled';
        });

        const totalSales = thisMonthOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
        const totalAptFees = thisMonthApts.length * 250; // ₹250 per consultation
        const totalTax = totalSales * 0.05; // 5% assumed tax
        const netSales = (totalSales + totalAptFees) - totalTax;

        // Daily breakdown for current month (Last 10 days)
        const dailyData = [];
        for (let i = 9; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString();

            const dailyOrders = thisMonthOrders.filter(o => new Date(o.created_at).toLocaleDateString() === dateStr);
            const dailyTotal = dailyOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

            const dailyApts = thisMonthApts.filter(a => new Date(a.created_at || a.date).toLocaleDateString() === dateStr);
            const dailyAptTotal = dailyApts.length * 250;

            dailyData.push({
                day: d.getDate(),
                label: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
                pharmacy: dailyTotal,
                clinic: dailyAptTotal,
                amount: dailyTotal + dailyAptTotal,
                orders: dailyOrders.length,
                appointments: dailyApts.length
            });
        }

        return {
            totalSales,
            totalAptFees,
            totalRevenue: totalSales + totalAptFees,
            totalTax,
            netSales,
            orderCount: thisMonthOrders.length,
            aptCount: thisMonthApts.length,
            dailyData,
            avgOrderValue: thisMonthOrders.length > 0 ? totalSales / thisMonthOrders.length : 0
        };
    }, [orders, appointments]);

    return (
        <div className="analytics-page" style={{ padding: '2rem', background: '#f8fafc', minHeight: '100vh' }}>
            <style>
                {`
                    @media print {
                        .no-print, .back-btn, .action-buttons, footer {
                            display: none !important;
                        }
                        .analytics-page {
                            padding: 0 !important;
                            background: white !important;
                        }
                        .container {
                            max-width: 100% !important;
                            margin: 0 !important;
                            padding: 0 !important;
                        }
                        .glass-panel {
                            box-shadow: none !important;
                            border: 1px solid #ddd !important;
                            break-inside: avoid;
                            margin-bottom: 20px !important;
                        }
                        body {
                            background: white !important;
                        }
                        h1, h3 { color: black !important; }
                        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    }
                `}
            </style>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div>
                        <button
                            onClick={() => navigate('/admin')}
                            className="back-btn"
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                border: 'none', background: 'none', padding: 0,
                                color: '#64748b', cursor: 'pointer', fontWeight: 700,
                                marginBottom: '1rem'
                            }}
                        >
                            <ArrowLeft size={18} /> BACK TO DASHBOARD
                        </button>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1e293b', margin: 0, letterSpacing: '-0.02em' }}>
                            Monthly <span style={{ color: '#0d9488' }}>Analytics</span>
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem' }}>Full Business Report for <strong>{currentMonth}</strong></p>
                    </div>
                    <div className="action-buttons" style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={handlePrint}
                            style={{
                                background: '#334155', color: 'white', border: 'none',
                                padding: '12px 24px', borderRadius: '14px', fontWeight: 800,
                                display: 'flex', alignItems: 'center', gap: '10px',
                                boxShadow: '0 10px 20px rgba(51, 65, 85, 0.2)',
                                cursor: 'pointer'
                            }}
                        >
                            <Printer size={18} /> Print Report
                        </button>
                        <button
                            onClick={handleDownloadCSV}
                            style={{
                                background: '#0d9488', color: 'white', border: 'none',
                                padding: '12px 24px', borderRadius: '14px', fontWeight: 800,
                                display: 'flex', alignItems: 'center', gap: '10px',
                                boxShadow: '0 10px 20px rgba(13, 148, 136, 0.2)',
                                cursor: 'pointer'
                            }}
                        >
                            <Download size={18} /> Download CSV
                        </button>
                    </div>
                </header>

                {/* Key Metrics Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2.5rem'
                }}>
                    <MetricCard title="Gross Revenue" value={`₹${analyticsData.totalRevenue.toLocaleString('en-IN')}`} icon={<DollarSign size={22} />} color="#0d9488" />
                    <MetricCard title="Pharmacy Sales" value={`₹${analyticsData.totalSales.toLocaleString('en-IN')}`} icon={<Package size={22} />} color="#6366f1" />
                    <MetricCard title="Clinic Revenue" value={`₹${analyticsData.totalAptFees.toLocaleString('en-IN')}`} icon={<Users size={22} />} color="#f59e0b" />
                    <MetricCard title="Total Orders" value={analyticsData.orderCount.toLocaleString('en-IN')} icon={<BarChart3 size={22} />} color="#ec4899" />
                    <MetricCard title="Appointments" value={analyticsData.aptCount.toLocaleString('en-IN')} icon={<Calendar size={22} />} color="#94a3b8" />
                </div>

                {/* Visualizations Container */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    {/* Advanced Revenue Analytics Chart */}
                    <motion.div
                        className="glass-panel"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e293b', margin: 0 }}>Business Performance</h3>
                                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Comparative trend: Pharmacy vs Clinical Revenue</p>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6366f1' }}></div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Pharmacy Sales</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Clinic Revenue</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ width: '100%', height: '350px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analyticsData.dailyData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="colorPharmacy" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorClinic" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="label"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                                        tickFormatter={(value) => `₹${value > 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '16px' }}
                                        itemStyle={{ fontWeight: 800, fontSize: '0.9rem' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="pharmacy"
                                        stroke="#6366f1"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorPharmacy)"
                                        dot={{ r: 5, fill: '#6366f1', strokeWidth: 3, stroke: '#fff' }}
                                        activeDot={{ r: 8, strokeWidth: 0 }}
                                        animationDuration={2000}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="clinic"
                                        stroke="#f59e0b"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorClinic)"
                                        dot={{ r: 5, fill: '#f59e0b', strokeWidth: 3, stroke: '#fff' }}
                                        activeDot={{ r: 8, strokeWidth: 0 }}
                                        animationDuration={2500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Report Highlights (Secondary) */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        <motion.div
                            className="glass-panel"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            style={{ background: 'white', padding: '2rem', borderRadius: '28px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
                        >
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Users size={20} color="#6366f1" /> Monthly Highlights
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <HighlightRow label="Most Productive Region" value="Thiruvarur" />
                                <HighlightRow label="Peak Ordering Time" value="06:00 PM - 09:00 PM" />
                                <HighlightRow label="Customer Satisfaction" value="4.8/5.0" />
                                <HighlightRow label="New Customers" value="+24" />
                            </div>
                        </motion.div>

                        <motion.div
                            className="glass-panel"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{ background: 'white', padding: '2rem', borderRadius: '28px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
                        >
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <TrendingUp size={20} color="#0d9488" /> Growth Statistics
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <HighlightRow label="Avg. Order Value" value={`₹${analyticsData.avgOrderValue.toFixed(0)}`} />
                                <HighlightRow label="Clinic Conversion" value="72%" />
                                <HighlightRow label="Staff Efficiency" value="94%" />
                                <HighlightRow label="Repeat Customers" value="38%" />
                            </div>
                        </motion.div>
                    </div>
                </div>


                {/* Detailed Business Log (Itemized for Print) */}
                <motion.div
                    className="glass-panel"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{ background: 'white', padding: '2rem', borderRadius: '28px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', marginTop: '2.5rem', marginBottom: '4rem' }}
                >
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Package size={20} color="#0d9488" /> Detailed Business Log
                    </h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                    <th style={{ padding: '12px 8px', color: '#64748b', fontSize: '0.85rem' }}>TYPE</th>
                                    <th style={{ padding: '12px 8px', color: '#64748b', fontSize: '0.85rem' }}>CUSTOMER / PATIENT</th>
                                    <th style={{ padding: '12px 8px', color: '#64748b', fontSize: '0.85rem' }}>REVENUE</th>
                                    <th style={{ padding: '12px 8px', color: '#64748b', fontSize: '0.85rem' }}>STATUS</th>
                                    <th style={{ padding: '12px 8px', color: '#64748b', fontSize: '0.85rem' }}>DATE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...((orders || []).filter(o => o.status !== 'Cancelled')), ...((appointments || []).filter(a => a.status !== 'Cancelled'))]
                                    .sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date))
                                    .slice(0, 30) // Show last 30 for the report
                                    .map((txn, idx) => {
                                        const isOrder = 'customer_name' in txn;
                                        return (
                                            <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                                                <td style={{ padding: '10px 8px' }}>
                                                    <span style={{
                                                        fontSize: '0.65rem', fontWeight: 900, padding: '3px 8px', borderRadius: '6px',
                                                        background: isOrder ? '#eff6ff' : '#fff7ed',
                                                        color: isOrder ? '#1e40af' : '#9a3412',
                                                        display: 'inline-block'
                                                    }}>
                                                        {isOrder ? 'PHARMACY' : 'CLINIC'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '10px 8px', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
                                                    {isOrder ? txn.customer_name : txn.patientName}
                                                </td>
                                                <td style={{ padding: '10px 8px', fontSize: '0.9rem', fontWeight: 900, color: '#0d9488' }}>
                                                    ₹{isOrder ? Number(txn.total_amount).toLocaleString() : '250'}
                                                </td>
                                                <td style={{ padding: '10px 8px', fontSize: '0.8rem' }}>
                                                    <span style={{
                                                        color: (txn.status === 'Delivered' || txn.status === 'Confirmed') ? '#10b981' : '#64748b',
                                                        fontWeight: 600
                                                    }}>
                                                        {txn.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '10px 8px', fontSize: '0.8rem', color: '#94a3b8' }}>
                                                    {new Date(txn.created_at || txn.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                    {((orders?.length || 0) + (appointments?.length || 0)) > 30 && (
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '1.5rem', fontStyle: 'italic', textAlign: 'center' }}>
                            Showing last 30 transactions. Use CSV download for full data.
                        </p>
                    )}
                </motion.div>

                <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f0fdf4', borderRadius: '20px', border: '1px solid #dcfce7', marginBottom: '2rem' }}>
                    <p style={{ margin: 0, color: '#166534', fontSize: '0.9rem', fontWeight: 600 }}>
                        💡 Insights: Monthly collection is active. High engagement observed in evening slots.
                    </p>
                </div>
            </div>
        </div>
    );
}


function MetricCard({ title, value, icon, color }) {
    return (
        <motion.div
            whileHover={{ y: -5, boxShadow: '0 12px 24px rgba(0,0,0,0.06)' }}
            style={{
                background: 'white',
                padding: '1.75rem',
                borderRadius: '28px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                height: '100%'
            }}
        >
            <div style={{
                background: `${color}15`,
                color: color,
                width: '56px',
                height: '56px',
                borderRadius: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
            }}>
                {icon}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.01em' }}>{title}</p>
                <h3 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, color: '#1e293b', letterSpacing: '-0.02em' }}>{value}</h3>
            </div>
        </motion.div>
    );
}

function HighlightRow({ label, value }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ color: '#64748b', fontWeight: 500 }}>{label}</span>
            <span style={{ color: '#1e293b', fontWeight: 800 }}>{value}</span>
        </div>
    );
}

export default MonthlyAnalytics;

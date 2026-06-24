import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Pill, LogOut, Package, Calendar, Stethoscope, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './AdminDashboard.css';

// Import sub-components
import OrdersTab from '../components/admin/OrdersTab';
import AppointmentsTab from '../components/admin/AppointmentsTab';
import MedicinesTab from '../components/admin/MedicinesTab';
import DoctorsTab from '../components/admin/DoctorsTab';
import CustomersTab from '../components/admin/CustomersTab';
import DashboardTab from '../components/admin/DashboardTab';

function AdminDashboard() {
    const navigate = useNavigate();
    const {
        appointments, updateAppointmentStatus, updateAppointmentToken,
        orders, updateOrderStatus,
        medicines, addMedicine, bulkAddMedicines, updateMedicineData, deleteMedicine, toggleMedicineStock,
        doctors, addDoctor, updateDoctorAvailability, updateDoctorData, updateDoctorImage, deleteDoctor,
        registeredUsers
    } = useApp();

    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isAppInstalled, setIsAppInstalled] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);

        const checkInstalled = () => {
            if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
                setIsAppInstalled(true);
            }
        };
        checkInstalled();

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallApp = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setIsAppInstalled(true);
        }
    };

    const [activeTab, setActiveTab] = useState('dashboard');

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
                        className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <Package size={20} />
                        Orders
                        {orders.filter(o => o.status === 'Pending' || o.status === 'Cancel Requested').length > 0 && (
                            <span style={{
                                marginLeft: 'auto',
                                background: activeTab === 'orders' ? 'rgba(255,255,255,0.3)' : '#ef4444',
                                color: 'white',
                                borderRadius: '12px',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                padding: '1px 7px',
                                minWidth: '20px',
                                textAlign: 'center',
                                animation: 'pulse-badge 1.5s ease-in-out infinite'
                            }}>
                                {orders.filter(o => o.status === 'Pending' || o.status === 'Cancel Requested').length}
                            </span>
                        )}
                    </button>

                    <button
                        className={`admin-nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('appointments')}
                    >
                        <Calendar size={20} />
                        Appointments
                        {appointments.filter(a => a.status === 'Pending').length > 0 && (
                            <span style={{
                                marginLeft: 'auto',
                                background: activeTab === 'appointments' ? 'rgba(255,255,255,0.3)' : '#ef4444',
                                color: 'white',
                                borderRadius: '12px',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                padding: '1px 7px',
                                minWidth: '20px',
                                textAlign: 'center',
                                animation: 'pulse-badge 1.5s ease-in-out infinite'
                            }}>
                                {appointments.filter(a => a.status === 'Pending').length}
                            </span>
                        )}
                    </button>

                    <button
                        className={`admin-nav-item ${activeTab === 'customers' ? 'active' : ''}`}
                        onClick={() => setActiveTab('customers')}
                    >
                        <UserCheck size={20} />
                        Customers
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
                        <Stethoscope size={20} />
                        Manage Doctors
                    </button>

                    <button className="admin-nav-item text-danger" onClick={handleLogout} style={{ marginTop: 'auto' }}>
                        <LogOut size={20} />
                        Logout
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {/* Automatic Install Banner */}
                {!isAppInstalled && deferredPrompt && (
                    <motion.div
                        className="admin-install-banner"
                        initial={{ height: 0, opacity: 0, y: -20 }}
                        animate={{ height: 'auto', opacity: 1, y: 0 }}
                        style={{
                            background: 'linear-gradient(135deg, #0d9488, #10b981)',
                            padding: '1.25rem 1.75rem',
                            borderRadius: '24px',
                            marginBottom: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.25rem',
                            color: 'white',
                            boxShadow: '0 12px 30px rgba(13, 148, 136, 0.25)',
                            position: 'relative',
                            overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}
                    >
                        <div style={{
                            background: 'rgba(255,255,255,0.2)',
                            width: '48px',
                            height: '48px',
                            borderRadius: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <Package size={24} />
                        </div>
                        <div style={{ flexGrow: 1 }}>
                            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>Install Admin App</h4>
                            <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', opacity: 0.9, fontWeight: 500 }}>Launch the dashboard directly from your home screen for a faster, full-screen experience.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={handleInstallApp}
                                style={{
                                    background: 'white',
                                    color: '#0d9488',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '12px',
                                    fontWeight: 900,
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    transition: 'all 0.2s'
                                }}
                            >
                                INSTALL NOW
                            </button>
                        </div>
                    </motion.div>
                )}

                <header className="admin-header">
                    <h1 className="title">
                        {activeTab === 'dashboard' ? 'Admin Dashboard' :
                            activeTab === 'orders' ? 'Customer Orders' :
                                activeTab === 'appointments' ? 'Doctor Appointments' :
                                    activeTab === 'upload' ? 'Manage Medicines' :
                                        activeTab === 'customers' ? 'Registered Customers' : 'Edit Doctors'}
                    </h1>
                </header>

                <div className="admin-content">
                    {activeTab === 'dashboard' && (
                        <DashboardTab orders={orders} appointments={appointments} />
                    )}
                    {activeTab === 'orders' && (
                        <OrdersTab orders={orders} updateOrderStatus={updateOrderStatus} medicines={medicines} />
                    )}

                    {activeTab === 'appointments' && (
                        <AppointmentsTab
                            appointments={appointments}
                            updateAppointmentStatus={updateAppointmentStatus}
                            updateAppointmentToken={updateAppointmentToken}
                        />
                    )}

                    {activeTab === 'upload' && (
                        <MedicinesTab
                            medicines={medicines}
                            addMedicine={addMedicine}
                            bulkAddMedicines={bulkAddMedicines}
                            updateMedicineData={updateMedicineData}
                            deleteMedicine={deleteMedicine}
                            toggleMedicineStock={toggleMedicineStock}
                        />
                    )}

                    {activeTab === 'customers' && (
                        <CustomersTab users={registeredUsers} />
                    )}

                    {activeTab === 'doctors' && (
                        <DoctorsTab
                            doctors={doctors}
                            addDoctor={addDoctor}
                            updateDoctorData={updateDoctorData}
                            updateDoctorAvailability={updateDoctorAvailability}
                            updateDoctorImage={updateDoctorImage}
                            deleteDoctor={deleteDoctor}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;

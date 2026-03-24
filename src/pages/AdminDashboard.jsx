import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Pill, LogOut, Package, Paperclip } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './AdminDashboard.css';

// Import sub-components
import OrdersTab from '../components/admin/OrdersTab';
import AppointmentsTab from '../components/admin/AppointmentsTab';
import PrescriptionsTab from '../components/admin/PrescriptionsTab';
import MedicinesTab from '../components/admin/MedicinesTab';
import DoctorsTab from '../components/admin/DoctorsTab';

function AdminDashboard() {
    const navigate = useNavigate();
    const { 
        appointments, updateAppointmentStatus, updateAppointmentToken, 
        orders, updateOrderStatus, 
        prescriptions, updatePrescriptionStatus, 
        medicines, addMedicine, updateMedicineData, deleteMedicine, toggleMedicineStock,
        doctors, addDoctor, updateDoctorAvailability, updateDoctorData, updateDoctorImage, deleteDoctor
    } = useApp();
    
    const [activeTab, setActiveTab] = useState('orders');

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
                        className={`admin-nav-item ${activeTab === 'prescriptions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('prescriptions')}
                    >
                        <Paperclip size={20} />
                        Prescriptions
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

                    <button className="admin-nav-item text-danger mobile-logout-only" onClick={handleLogout}>
                        <LogOut size={20} />
                        Logout
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <h1 className="title">
                        {activeTab === 'orders' ? 'Customer Orders' : 
                         activeTab === 'appointments' ? 'Doctor Appointments' : 
                         activeTab === 'upload' ? 'Manage Medicines' : 'Edit Doctors'}
                    </h1>
                </header>

                <div className="admin-content">
                    {activeTab === 'orders' && (
                        <OrdersTab orders={orders} updateOrderStatus={updateOrderStatus} />
                    )}

                    {activeTab === 'appointments' && (
                        <AppointmentsTab 
                            appointments={appointments} 
                            updateAppointmentStatus={updateAppointmentStatus} 
                            updateAppointmentToken={updateAppointmentToken} 
                        />
                    )}

                    {activeTab === 'prescriptions' && (
                        <PrescriptionsTab 
                            prescriptions={prescriptions} 
                            updatePrescriptionStatus={updatePrescriptionStatus} 
                        />
                    )}

                    {activeTab === 'upload' && (
                        <MedicinesTab 
                            medicines={medicines} 
                            addMedicine={addMedicine} 
                            updateMedicineData={updateMedicineData} 
                            deleteMedicine={deleteMedicine}
                            toggleMedicineStock={toggleMedicineStock}
                        />
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

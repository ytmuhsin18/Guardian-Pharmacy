import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [medicines, setMedicines] = useState([]);

    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [orders, setOrders] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);

        const fetchMedicinesAsync = async () => {
            const res = await fetch('/api/medicines');
            if (!res.ok) throw new Error('API Error');
            const data = await res.json();
            if (data) setMedicines(data.map(m => mapMedicineToFrontend(m)));
        };

        const fetchDoctorsAsync = async () => {
            const res = await fetch('/api/doctors');
            if (!res.ok) throw new Error('API Error');
            const data = await res.json();
            if (data) setDoctors(data.map(d => mapDoctorToFrontend(d)));
        };

        const fetchAppointmentsAsync = async () => {
            const seventyTwoHoursAgo = new Date();
            seventyTwoHoursAgo.setHours(seventyTwoHoursAgo.getHours() - 72);

            const res = await fetch('/api/appointments');
            if (!res.ok) throw new Error('API Error');
            const data = await res.json();

            if (data) {
                // Filter locally first
                const currentAppointments = data.filter(apt => new Date(apt.created_at) > seventyTwoHoursAgo);

                setAppointments(currentAppointments.map(a => ({
                    ...a,
                    patientName: a.patientname,
                    doctorId: a.doctorid,
                    doctorName: a.doctorname,
                    token_number: a.token_number || null
                })));

                // Trigger delete if we found old records
                if (data.length > currentAppointments.length) {
                    cleanupOldData();
                }
            }
        };

        const fetchOrdersAsync = async () => {
            const seventyTwoHoursAgo = new Date();
            seventyTwoHoursAgo.setHours(seventyTwoHoursAgo.getHours() - 72);

            let res;
            try {
               res = await fetch('/api/orders');
            } catch(e) { console.error('fetch order err', e); return; }
            if (!res.ok) throw new Error('API Error');
            const rawData = await res.json();
            
            // Format items properly as jsonb text retrieval logic handles items::text
            const data = rawData.map(order => ({
                 ...order,
                 items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
            }));

            if (data) {
                // Filter orders locally to ensure UI is fresh immediately
                const currentOrders = data.filter(order => new Date(order.created_at) > seventyTwoHoursAgo);
                setOrders(currentOrders);

                // If we find orders older than 72 hours, trigger a background delete
                if (data.length > currentOrders.length) {
                    cleanupOldData();
                }
            }
        };

        const fetchPrescriptionsAsync = async () => {
            let res;
            try {
               res = await fetch('/api/prescriptions');
            } catch(e) { return; }
            if (!res.ok) return;
            const data = await res.json();
            if (data) {
                setPrescriptions(data.map(p => ({
                    ...p,
                    image_base64: null
                })));
            }
        };

        try {
            await Promise.allSettled([
                fetchMedicinesAsync(),
                fetchDoctorsAsync(),
                fetchAppointmentsAsync(),
                fetchOrdersAsync(),
                fetchPrescriptionsAsync()
            ]);
        } catch (globalError) {
            console.error("Critical error in concurrent fetchData:", globalError);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (medicine) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === medicine.id);
            if (existing) {
                return prev.map(item => item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...medicine, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === id);
            if (existing && existing.quantity > 1) {
                return prev.map(item => item.id === id ? { ...item, quantity: item.quantity - 1 } : item);
            }
            return prev.filter(item => item.id !== id);
        });
    };

    const clearCart = () => setCart([]);

    const addAppointment = async (appointment) => {
        const dbAppointment = {
            patientname: appointment.patientName,
            doctorid: appointment.doctorId,
            doctorname: appointment.doctorName,
            date: appointment.date,
            time: appointment.time || null,
            phone: appointment.phone,
            reason: appointment.reason,
            status: 'Pending'
        };
        const res = await fetch('/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dbAppointment)
        });
        const data = await res.json();
        
        if (data && data.length > 0) {
            const newApt = data[0];
            setAppointments(prev => [{
                ...newApt,
                patientName: newApt.patientname,
                doctorId: newApt.doctorid,
                doctorName: newApt.doctorname,
                token_number: newApt.token_number || null
            }, ...prev]);

            try {
                const myApts = JSON.parse(localStorage.getItem('my_guardian_appointments') || '[]');
                myApts.push(newApt.id);
                localStorage.setItem('my_guardian_appointments', JSON.stringify(myApts));
            } catch (e) {
                console.error("Local tracking failed", e);
            }
            return true;
        } else {
            console.error("Failed to add appointment");
            return false;
        }
    };

    const updateAppointmentStatus = async (id, status) => {
        const res = await fetch(`/api/appointments/${id}`, {
             method: 'PUT',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ status })
        });
        if (res.ok) {
            setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, status } : apt));
        } else {
            console.error("Failed to update status");
        }
    };

    const updateAppointmentToken = async (id, tokenNumber) => {
        const res = await fetch(`/api/appointments/${id}`, {
             method: 'PUT',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ token_number: tokenNumber })
        });
        if (res.ok) {
            setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, token_number: tokenNumber } : apt));
            return true;
        } else {
            console.error("Failed to update token");
            return false;
        }
    };

    const addOrder = async (orderDetails) => {
        const sanitizedItems = (orderDetails.items || []).map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            category: item.category
        }));

        const dbOrder = {
            customer_name: orderDetails.customer_name,
            phone: orderDetails.phone,
            whatsapp: orderDetails.whatsapp,
            address: orderDetails.address,
            pincode: orderDetails.pincode,
            email: orderDetails.email || null,
            items: sanitizedItems,
            total_amount: orderDetails.total_amount,
            status: 'Pending'
        };
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dbOrder)
        });
        const data = await res.json();
        
        if (res.ok && data && data.length > 0) {
            let orderToSave = data[0];
            // Format items properly as jsonb text retrieval logic handles items::text if applying backend response directly
            if(typeof orderToSave.items === 'string') {
               try { orderToSave.items = JSON.parse(orderToSave.items); } catch(e){}
            } else if (!orderToSave.items) {
               orderToSave.items = sanitizedItems;
            }
            
            setOrders(prev => [data[0], ...prev]);

            try {
                const myOrders = JSON.parse(localStorage.getItem('my_guardian_orders') || '[]');
                myOrders.push(data[0].id);
                localStorage.setItem('my_guardian_orders', JSON.stringify(myOrders));
            } catch (e) {
                console.error("Local tracking failed", e);
            }

            return true;
        } else {
            console.error("Failed to add order");
            return false;
        }
    };

    const updateOrderStatus = async (id, status) => {
        const res = await fetch(`/api/orders/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (res.ok) {
            setOrders(prev => prev.map(order => order.id === id ? { ...order, status } : order));
        } else {
            console.error("Failed to update status");
        }
    };

    const cleanupOldData = async () => {
        try {
            await fetch('/api/orders/cleanup', { method: 'DELETE' });
            await fetch('/api/appointments/cleanup', { method: 'DELETE' });
            console.log("Old data (72h+) cleaned up successfully");
        } catch (e) {
            console.error("Cleanup error:", e);
        }
    };

    const uploadPrescription = async (imageBase64) => {
        const res = await fetch('/api/prescriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image_base64: imageBase64, status: 'Pending' })
        });
        const data = await res.json();
        
        if (res.ok && data && data.length > 0) {
            setPrescriptions(prev => [data[0], ...prev]);
            return true;
        } else {
            console.error("Failed to upload prescription");
            return false;
        }
    };

    const updatePrescriptionStatus = async (id, status) => {
        const res = await fetch(`/api/prescriptions/${id}`, {
             method: 'PUT',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ status })
        });
        if (res.ok) {
            setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, status } : p));
        } else {
            console.error("Failed to update prescription status");
        }
    };

    const addMedicine = async (medicine) => {
        const dbMedicine = {
            name: medicine.name,
            combination: medicine.combination || null,
            category: medicine.category,
            condition: medicine.condition || 'All',
            price: parseFloat(medicine.price) || 0,
            discount: medicine.discount ? parseFloat(medicine.discount) : 0,
            description: medicine.description || null,
            instock: medicine.inStock !== undefined ? medicine.inStock : true,
            image_base64: medicine.images ? JSON.stringify(medicine.images) : (medicine.image_base64 || null)
        };

        const res = await fetch('/api/medicines', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dbMedicine)
        });
        if (!res.ok) return false;
        const data = await res.json();

        if (data && data.length > 0) {
            setMedicines(prev => [mapMedicineToFrontend(data[0]), ...prev]);
            return true;
        }
        return false;
    };

    const bulkAddMedicines = async (medicinesList) => {
        const dbMedicines = medicinesList.map(med => ({
            name: med.name,
            combination: med.combination || null,
            category: med.category || 'Pharmacy',
            condition: med.condition || 'All',
            price: parseFloat(med.price) || 0,
            discount: med.discount ? parseFloat(med.discount) : 0,
            description: med.description || null,
            instock: med.inStock !== undefined ? med.inStock : true,
            image_base64: med.images ? JSON.stringify(med.images) : (med.image_base64 || null)
        }));

        const chunkSize = 500;
        let successCount = 0;
        for (let i = 0; i < dbMedicines.length; i += chunkSize) {
            const chunk = dbMedicines.slice(i, i + chunkSize);
            const res = await fetch('/api/medicines/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(chunk)
            });
            if (res.ok) {
                 const data = await res.json();
                 if(data.success) successCount += chunk.length;
            }
        }

        if (successCount > 0) {
            await fetchData();
            return true;
        }
        return false;
    };

    const ensureBase64Prefix = (img) => {
        if (!img || typeof img !== 'string') return null;
        const cleaned = img.trim();
        if (cleaned === 'null' || cleaned === 'undefined' || cleaned === '' || cleaned === '[]') return null;

        if (cleaned.startsWith('data:image/') || cleaned.startsWith('http') || cleaned.startsWith('blob:') || cleaned.startsWith('https:')) {
            return cleaned;
        }
        return `data:image/png;base64,${cleaned}`;
    };

    const mapMedicineToFrontend = (m) => {
        let parsedImages = [];
        if (m.image_base64) {
            try {
                if (m.image_base64.startsWith('[') && m.image_base64.endsWith(']')) {
                    const parsed = JSON.parse(m.image_base64);
                    parsedImages = Array.isArray(parsed) ? parsed : [m.image_base64];
                } else {
                    parsedImages = [m.image_base64];
                }
            } catch (e) {
                parsedImages = [m.image_base64];
            }
        }

        const processedImages = parsedImages.map(img => ensureBase64Prefix(img)).filter(Boolean);

        return {
            ...m,
            name: m.name || 'Unknown',
            category: m.category || 'Pharmacy',
            combination: m.combination || '',
            inStock: m.instock !== false && m.instock !== null,
            images: processedImages,
            image_base64: processedImages.length > 0 ? processedImages[0] : null
        };
    };

    const mapDoctorToFrontend = (d) => {
        const mappedName = d.name || d.Name || d.doctorName || d.doctorname || 'Doctor';
        return {
            ...d,
            name: mappedName,
            availability_start: d.availability_start || '06:00 PM',
            availability_end: d.availability_end || '10:00 PM',
            image_base64: ensureBase64Prefix(d.image_base64)
        };
    };

    const updateMedicineData = async (id, updatedData) => {
        const dbUpdate = {
            name: updatedData.name,
            combination: updatedData.combination || null,
            category: updatedData.category,
            price: parseFloat(updatedData.price) || 0,
            discount: updatedData.discount ? parseFloat(updatedData.discount) : 0,
            description: updatedData.description || null,
            instock: updatedData.inStock !== undefined ? updatedData.inStock : true,
            image_base64: updatedData.images ? JSON.stringify(updatedData.images) : (updatedData.image_base64 || null)
        };
        const res = await fetch(`/api/medicines/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dbUpdate)
        });
        const data = await res.json();
        if (res.ok && data) {
            setMedicines(prev => prev.map(med => med.id === id ? mapMedicineToFrontend(data[0]) : med));
            return true;
        } else {
            console.error("Failed to update medicine");
            return false;
        }
    };

    const toggleMedicineStock = async (id, currentStatus) => {
        const newStatus = !currentStatus;
        const res = await fetch(`/api/medicines/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ instock: newStatus })
        });
        const data = await res.json();
        if (res.ok && data) {
            setMedicines(prev => prev.map(med => med.id === id ? mapMedicineToFrontend(data[0]) : med));
            return true;
        } else {
            console.error("Failed to toggle stock status");
            return false;
        }
    };

    const updateMedicineImage = async (id, base64Image) => {
        const res = await fetch(`/api/medicines/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image_base64: base64Image })
        });
        const data = await res.json();
        if (res.ok && data) {
            setMedicines(prev => prev.map(med => med.id === id ? mapMedicineToFrontend(data[0]) : med));
        }
    };

    const deleteMedicine = async (id) => {
        const res = await fetch(`/api/medicines/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setMedicines(prev => prev.filter(med => med.id !== id));
            return true;
        } else {
            console.error("Failed to delete medicine");
            return false;
        }
    };

    const fetchMedicineImage = async (id) => {
        try {
            const res = await fetch(`/api/medicines/${id}/image`);
            const data = await res.json();

            if (res.ok && data) {
                const processed = mapMedicineToFrontend(data);
                setMedicines(prev => prev.map(med =>
                    med.id === id ? { ...med, image_base64: processed.image_base64, images: processed.images } : med
                ));
                return processed.image_base64;
            }
        } catch (e) {
            console.error("Error fetching medicine image:", e);
        }
        return null;
    };

    const fetchPrescriptionImage = async (id) => {
        try {
            const res = await fetch(`/api/prescriptions/${id}/image`);
            const data = await res.json();

            if (res.ok && data && data.image_base64) {
                const processedImage = ensureBase64Prefix(data.image_base64);
                setPrescriptions(prev => prev.map(p =>
                    p.id === id ? { ...p, image_base64: processedImage } : p
                ));
                return processedImage;
            }
        } catch (e) {
            console.error("Error fetching prescription image:", e);
        }
        return null;
    };

    const addDoctor = async (doctor) => {
        const dbDoctor = {
            name: doctor.name,
            specialty: doctor.specialty,
            experience: doctor.experience,
            about: doctor.about,
            image_base64: doctor.image_base64 || null,
            availability_start: doctor.availability_start || '06:00 PM',
            availability_end: doctor.availability_end || '10:00 PM'
        };
        const res = await fetch('/api/doctors', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(dbDoctor)
        });
        const data = await res.json();
        if (res.ok && data) {
            setDoctors(prev => [...prev, mapDoctorToFrontend(data[0])]);
            return true;
        } else {
            console.error("Failed to add doctor");
            return false;
        }
    };

    const updateDoctorImage = async (id, base64Image) => {
        const res = await fetch(`/api/doctors/${id}`, {
             method: 'PUT',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ image_base64: base64Image })
        });
        const data = await res.json();
        if (res.ok && data) {
            setDoctors(prev => prev.map(doc => doc.id === id ? mapDoctorToFrontend(data[0]) : doc));
        } else {
            console.error("Failed to update doctor image");
        }
    };

    const updateDoctorAvailability = async (id, start, end) => {
        const res = await fetch(`/api/doctors/${id}`, {
             method: 'PUT',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ availability_start: start, availability_end: end })
        });
        if (res.ok) {
            setDoctors(prev => prev.map(doc => doc.id === id ? { ...doc, availability_start: start, availability_end: end } : doc));
            return true;
        } else {
            console.error("Failed to update doctor availability");
            return false;
        }
    };

    const updateDoctorData = async (id, updatedData) => {
        const dbUpdate = {
            name: updatedData.name,
            specialty: updatedData.specialty,
            experience: updatedData.experience,
            about: updatedData.about,
            image_base64: updatedData.image_base64 || null,
            availability_start: updatedData.availability_start,
            availability_end: updatedData.availability_end
        };
        const res = await fetch(`/api/doctors/${id}`, {
             method: 'PUT',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(dbUpdate)
        });
        const data = await res.json();
        if (res.ok && data) {
            setDoctors(prev => prev.map(doc => doc.id === id ? mapDoctorToFrontend(data[0]) : doc));
            return true;
        } else {
            console.error("Failed to update doctor details");
            return false;
        }
    };

    const fetchDoctorImage = async (id) => {
        try {
            const res = await fetch(`/api/doctors/${id}/image`);
            const data = await res.json();

            if (res.ok && data && data.image_base64) {
                const processed = mapDoctorToFrontend(data);
                setDoctors(prev => prev.map(doc =>
                    doc.id === id ? { ...doc, image_base64: processed.image_base64 } : doc
                ));
                return processed.image_base64;
            }
        } catch (e) {
            console.error("Error fetching doctor image:", e);
        }
        return null;
    };

    const deleteDoctor = async (id) => {
        const res = await fetch(`/api/doctors/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setDoctors(prev => prev.filter(doc => doc.id !== id));
            return true;
        } else {
            console.error("Failed to delete doctor");
            return false;
        }
    };

    return (
        <AppContext.Provider value={{
            medicines,
            addMedicine,
            bulkAddMedicines,
            updateMedicineImage,
            updateMedicineData,
            deleteMedicine,
            toggleMedicineStock,
            fetchMedicineImage,

            doctors,
            addDoctor,
            updateDoctorImage,
            updateDoctorAvailability,
            updateDoctorData,
            deleteDoctor,
            fetchDoctorImage,
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            isCartOpen,
            setIsCartOpen,
            totalItems,
            cartTotal,
            appointments,
            addAppointment,
            updateAppointmentStatus,
            updateAppointmentToken,
            orders,
            addOrder,
            updateOrderStatus,
            cleanupOldData,
            prescriptions,
            uploadPrescription,
            updatePrescriptionStatus,
            fetchPrescriptionImage,
            loading,
            fetchData
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}

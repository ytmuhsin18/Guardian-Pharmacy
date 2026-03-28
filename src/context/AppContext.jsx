import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
            const { data, error } = await supabase
                .from('medicines')
                .select('id, name, combination, category, condition, price, discount, description, instock')
                .order('id', { ascending: false })
                .limit(50);
            if (error) throw error;
            if (data) setMedicines(data.map(m => mapMedicineToFrontend(m)));
        };

        const fetchDoctorsAsync = async () => {
            const { data, error } = await supabase
                .from('doctors')
                .select('id, name, specialty, experience, about, availability_start, availability_end')
                .order('id', { ascending: true });
            if (error) throw error;
            if (data) setDoctors(data.map(d => mapDoctorToFrontend(d)));
        };

        const fetchAppointmentsAsync = async () => {
            const { data, error } = await supabase
                .from('appointments')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            if (data) {
                setAppointments(data.map(a => ({
                    ...a,
                    patientName: a.patientname,
                    doctorId: a.doctorid,
                    doctorName: a.doctorname,
                    token_number: a.token_number || null
                })));
            }
        };

        const fetchOrdersAsync = async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('id, customer_name, phone, whatsapp, address, pincode, email, total_amount, status, created_at, items')
                .order('created_at', { ascending: false });
            if (error) throw error;
            if (data) setOrders(data);
        };

        const fetchPrescriptionsAsync = async () => {
            const { data, error } = await supabase
                .from('prescriptions')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) {
                if (error.code === 'PGRST116' || error.code === '42P01' || error.message?.includes('not find')) {
                    console.warn("Prescriptions table missing");
                } else {
                    throw error;
                }
            } else if (data) {
                setPrescriptions(data.map(p => ({
                    ...p,
                    image_base64: ensureBase64Prefix(p.image_base64)
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
        const { data, error } = await supabase.from('appointments').insert([dbAppointment]).select();
        if (data && !error) {
            const newApt = data[0];
            setAppointments(prev => [{
                ...newApt,
                patientName: newApt.patientname,
                doctorId: newApt.doctorid,
                doctorName: newApt.doctorname,
                token_number: newApt.token_number || null
            }, ...prev]);

            // Save appointment ID to localStorage to track for notifications
            try {
                const myApts = JSON.parse(localStorage.getItem('my_guardian_appointments') || '[]');
                myApts.push(newApt.id);
                localStorage.setItem('my_guardian_appointments', JSON.stringify(myApts));
            } catch (e) {
                console.error("Local tracking failed", e);
            }
            return true;
        } else {
            console.error("Failed to add appointment", error);
        }
    };

    const updateAppointmentStatus = async (id, status) => {
        const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
        if (!error) {
            setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, status } : apt));
        } else {
            console.error("Failed to update status", error);
        }
    };

    const updateAppointmentToken = async (id, tokenNumber) => {
        const { error } = await supabase.from('appointments').update({ token_number: tokenNumber }).eq('id', id);
        if (!error) {
            setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, token_number: tokenNumber } : apt));
            return true;
        } else {
            console.error("Failed to update token", error);
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
        const { data, error } = await supabase.from('orders').insert([dbOrder]).select();
        if (data && !error) {
            setOrders(prev => [data[0], ...prev]);

            // Save order ID to localStorage to track for notifications
            try {
                const myOrders = JSON.parse(localStorage.getItem('my_guardian_orders') || '[]');
                myOrders.push(data[0].id);
                localStorage.setItem('my_guardian_orders', JSON.stringify(myOrders));
            } catch (e) {
                console.error("Local tracking failed", e);
            }

            return true;
        } else {
            console.error("Failed to add order", error);
            return false;
        }
    };

    const updateOrderStatus = async (id, status) => {
        const { error } = await supabase.from('orders').update({ status }).eq('id', id);
        if (!error) {
            setOrders(prev => prev.map(order => order.id === id ? { ...order, status } : order));
        } else {
            console.error("Failed to update status", error);
        }
    };

    const uploadPrescription = async (imageBase64) => {
        const { data, error } = await supabase.from('prescriptions').insert([{
            image_base64: imageBase64,
            status: 'Pending'
        }]).select();

        if (data && !error) {
            setPrescriptions(prev => [data[0], ...prev]);
            return true;
        } else {
            console.error("Failed to upload prescription", error);
            return false;
        }
    };

    const updatePrescriptionStatus = async (id, status) => {
        const { error } = await supabase.from('prescriptions').update({ status }).eq('id', id);
        if (!error) {
            setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, status } : p));
        } else {
            console.error("Failed to update prescription status", error);
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

        const { data, error } = await supabase.from('medicines').insert([dbMedicine]).select();
        if (error) return false;

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

        // Chunk processing for 5000+ items
        const chunkSize = 500;
        let successCount = 0;
        for (let i = 0; i < dbMedicines.length; i += chunkSize) {
            const chunk = dbMedicines.slice(i, i + chunkSize);
            const { data, error } = await supabase.from('medicines').insert(chunk).select();
            if (data) successCount += data.length;
            if (error) console.error(`Chunk error at ${i}:`, error);
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

        if (cleaned.startsWith('data:image/') || cleaned.startsWith('http') || cleaned.startsWith('blob:')) {
            return cleaned;
        }
        // If it looks like base64 but misses prefix
        return `data:image/png;base64,${cleaned}`;
    };

    const mapMedicineToFrontend = (m) => {
        let parsedImages = [];
        if (m.image_base64) {
            try {
                // Check if it's a JSON array of images
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

        // Ensure all images are valid base64 with prefix
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
        return {
            ...d,
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
        const { data, error } = await supabase.from('medicines').update(dbUpdate).eq('id', id).select();
        if (!error && data) {
            setMedicines(prev => prev.map(med => med.id === id ? mapMedicineToFrontend(data[0]) : med));
            return true;
        } else {
            console.error("Failed to update medicine", error);
            return false;
        }
    };

    const toggleMedicineStock = async (id, currentStatus) => {
        const newStatus = !currentStatus;
        const { data, error } = await supabase.from('medicines').update({ instock: newStatus }).eq('id', id).select();
        if (!error && data) {
            setMedicines(prev => prev.map(med => med.id === id ? mapMedicineToFrontend(data[0]) : med));
            return true;
        } else {
            console.error("Failed to toggle stock status", error);
            return false;
        }
    };

    const updateMedicineImage = async (id, base64Image) => {
        const { data, error } = await supabase.from('medicines').update({ image_base64: base64Image }).eq('id', id).select();
        if (!error && data) {
            setMedicines(prev => prev.map(med => med.id === id ? mapMedicineToFrontend(data[0]) : med));
        }
    };

    const deleteMedicine = async (id) => {
        const { error } = await supabase.from('medicines').delete().eq('id', id);
        if (!error) {
            setMedicines(prev => prev.filter(med => med.id !== id));
            return true;
        } else {
            console.error("Failed to delete medicine", error);
            return false;
        }
    };

    const fetchMedicineImage = async (id) => {
        try {
            const { data, error } = await supabase
                .from('medicines')
                .select('image_base64')
                .eq('id', id)
                .single();

            if (!error && data) {
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
        const { data, error } = await supabase.from('doctors').insert([dbDoctor]).select();
        if (data && !error) {
            setDoctors(prev => [...prev, mapDoctorToFrontend(data[0])]);
            return true;
        } else {
            console.error("Failed to add doctor", error);
            return false;
        }
    };

    const updateDoctorImage = async (id, base64Image) => {
        const { data, error } = await supabase.from('doctors').update({ image_base64: base64Image }).eq('id', id).select();
        if (!error && data) {
            setDoctors(prev => prev.map(doc => doc.id === id ? mapDoctorToFrontend(data[0]) : doc));
        } else {
            console.error("Failed to update doctor image", error);
        }
    };

    const updateDoctorAvailability = async (id, start, end) => {
        const { error } = await supabase.from('doctors').update({ availability_start: start, availability_end: end }).eq('id', id);
        if (!error) {
            setDoctors(prev => prev.map(doc => doc.id === id ? { ...doc, availability_start: start, availability_end: end } : doc));
            return true;
        } else {
            console.error("Failed to update doctor availability", error);
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
        const { data, error } = await supabase.from('doctors').update(dbUpdate).eq('id', id).select();
        if (!error && data) {
            setDoctors(prev => prev.map(doc => doc.id === id ? mapDoctorToFrontend(data[0]) : doc));
            return true;
        } else {
            console.error("Failed to update doctor details", error);
            return false;
        }
    };

    const fetchDoctorImage = async (id) => {
        try {
            const { data, error } = await supabase
                .from('doctors')
                .select('image_base64')
                .eq('id', id)
                .single();

            if (!error && data) {
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
        const { error } = await supabase.from('doctors').delete().eq('id', id);
        if (!error) {
            setDoctors(prev => prev.filter(doc => doc.id !== id));
            return true;
        } else {
            console.error("Failed to delete doctor", error);
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
            prescriptions,
            uploadPrescription,
            updatePrescriptionStatus,
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

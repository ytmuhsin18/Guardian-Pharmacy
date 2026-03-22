import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [medicines, setMedicines] = useState([]);
    const [labTests, setLabTests] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [orders, setOrders] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch medicines
            const { data: medsData, error: medsError } = await supabase.from('medicines').select('*').order('id', { ascending: true });
            if (medsError) console.error("Error fetching medicines:", medsError);
            if (medsData) {
                setMedicines(medsData.map(m => {
                    let parsedImages = [];
                    if (m.image_base64) {
                        try {
                            const parsed = JSON.parse(m.image_base64);
                            parsedImages = Array.isArray(parsed) ? parsed : [m.image_base64];
                        } catch (e) {
                            parsedImages = [m.image_base64];
                        }
                    }
                    return { ...m, inStock: m.instock, images: parsedImages };
                }));
            }

            // Fetch lab tests
            const { data: testsData, error: testsError } = await supabase.from('lab_tests').select('*').order('id', { ascending: true });
            if (testsError) console.error("Error fetching lab tests:", testsError);
            if (testsData) {
                setLabTests(testsData.map(t => ({ ...t, originalPrice: t.originalprice, testsIncluded: t.testsincluded })));
            }

            // Fetch doctors
            const { data: docsData, error: docsError } = await supabase.from('doctors').select('*').order('id', { ascending: true });
            if (docsError) console.error("Error fetching doctors:", docsError);
            if (docsData) {
                setDoctors(docsData.map(d => ({
                    ...d,
                    availability_start: d.availability_start || '06:00 PM',
                    availability_end: d.availability_end || '10:00 PM'
                })));
            }

            // Fetch appointments
            const { data: aptsData, error: aptsError } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });
            if (aptsError) console.error("Error fetching appointments:", aptsError);
            if (aptsData) {
                setAppointments(aptsData.map(a => ({
                    ...a,
                    patientName: a.patientname,
                    doctorId: a.doctorid,
                    doctorName: a.doctorname,
                    token_number: a.token_number || null
                })));
            }

            // Fetch orders
            const { data: ordersData, error: ordersError } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
            if (ordersError) console.error("Error fetching orders:", ordersError);
            if (ordersData) {
                setOrders(ordersData);
            }
            // Fetch prescriptions
            const { data: presData, error: presError } = await supabase.from('prescriptions').select('*').order('created_at', { ascending: false });
            if (presError) console.error("Error fetching prescriptions:", presError);
            if (presData) {
                setPrescriptions(presData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
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
        const dbOrder = {
            customer_name: orderDetails.customer_name,
            phone: orderDetails.phone,
            whatsapp: orderDetails.whatsapp,
            address: orderDetails.address,
            pincode: orderDetails.pincode,
            email: orderDetails.email || null,
            items: orderDetails.items,
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

        console.log("Inserting medicine:", dbMedicine);
        const { data, error } = await supabase.from('medicines').insert([dbMedicine]).select();

        if (error) {
            console.error("Failed to add medicine - DB Error:", error);
            return false;
        }

        if (data && data.length > 0) {
            const newMed = data[0];
            let parsedImages = [];
            if (newMed.image_base64) {
                try {
                    const parsed = JSON.parse(newMed.image_base64);
                    parsedImages = Array.isArray(parsed) ? parsed : [newMed.image_base64];
                } catch (e) {
                    parsedImages = [newMed.image_base64];
                }
            }
            setMedicines(prev => [...prev, { ...newMed, inStock: newMed.instock, images: parsedImages }]);
            console.log("Medicine added successfully:", newMed);
            return true;
        }

        return false;
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
        const { error } = await supabase.from('medicines').update(dbUpdate).eq('id', id);
        if (!error) {
            setMedicines(prev => prev.map(med => med.id === id ? { ...med, ...updatedData, inStock: updatedData.inStock } : med));
            return true;
        } else {
            console.error("Failed to update medicine", error);
            return false;
        }
    };

    const toggleMedicineStock = async (id, currentStatus) => {
        const newStatus = !currentStatus;
        const { error } = await supabase.from('medicines').update({ instock: newStatus }).eq('id', id);
        if (!error) {
            setMedicines(prev => prev.map(med => med.id === id ? { ...med, inStock: newStatus } : med));
            return true;
        } else {
            console.error("Failed to toggle stock status", error);
            return false;
        }
    };

    const updateMedicineImage = async (id, base64Image) => {
        const { error } = await supabase.from('medicines').update({ image_base64: base64Image }).eq('id', id);
        if (!error) {
            setMedicines(prev => prev.map(med => med.id === id ? { ...med, image_base64: base64Image } : med));
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
            setDoctors(prev => [...prev, {
                ...data[0],
                availability_start: data[0].availability_start || '06:00 PM',
                availability_end: data[0].availability_end || '10:00 PM'
            }]);
            return true;
        } else {
            console.error("Failed to add doctor", error);
            return false;
        }
    };

    const updateDoctorImage = async (id, base64Image) => {
        const { error } = await supabase.from('doctors').update({ image_base64: base64Image }).eq('id', id);
        if (!error) {
            setDoctors(prev => prev.map(doc => doc.id === id ? { ...doc, image_base64: base64Image } : doc));
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
        const { error } = await supabase.from('doctors').update(dbUpdate).eq('id', id);
        if (!error) {
            setDoctors(prev => prev.map(doc => doc.id === id ? { ...doc, ...updatedData } : doc));
            return true;
        } else {
            console.error("Failed to update doctor details", error);
            return false;
        }
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
            updateMedicineImage,
            updateMedicineData,
            deleteMedicine,
            toggleMedicineStock,
            labTests,
            doctors,
            addDoctor,
            updateDoctorImage,
            updateDoctorAvailability,
            updateDoctorData,
            deleteDoctor,
            cart,
            addToCart,
            removeFromCart,
            clearCart,
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

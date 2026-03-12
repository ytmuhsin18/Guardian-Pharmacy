import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [medicines, setMedicines] = useState([]);
    const [labTests, setLabTests] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch medicines
            const { data: medsData } = await supabase.from('medicines').select('*').order('id', { ascending: true });
            if (medsData) {
                setMedicines(medsData.map(m => ({ ...m, inStock: m.instock })));
            }

            // Fetch lab tests
            const { data: testsData } = await supabase.from('lab_tests').select('*').order('id', { ascending: true });
            if (testsData) {
                setLabTests(testsData.map(t => ({ ...t, originalPrice: t.originalprice, testsIncluded: t.testsincluded })));
            }

            // Fetch doctors
            const { data: docsData } = await supabase.from('doctors').select('*').order('id', { ascending: true });
            if (docsData) setDoctors(docsData);

            // Fetch appointments
            const { data: aptsData } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });
            if (aptsData) {
                setAppointments(aptsData.map(a => ({ ...a, patientName: a.patientname, doctorId: a.doctorid, doctorName: a.doctorname })));
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
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => setCart([]);

    const addAppointment = async (appointment) => {
        const dbAppointment = {
            patientname: appointment.patientName,
            doctorid: appointment.doctorId,
            doctorname: appointment.doctorName,
            date: appointment.date,
            time: appointment.time,
            phone: appointment.phone,
            reason: appointment.reason,
            status: 'Pending'
        };
        const { data, error } = await supabase.from('appointments').insert([dbAppointment]).select();
        if (data && !error) {
            const newApt = data[0];
            setAppointments(prev => [{ ...newApt, patientName: newApt.patientname, doctorId: newApt.doctorid, doctorName: newApt.doctorname }, ...prev]);
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

    const addMedicine = async (medicine) => {
        const dbMedicine = {
            name: medicine.name,
            category: medicine.category,
            condition: medicine.condition || 'All',
            price: medicine.price,
            description: medicine.description,
            instock: medicine.inStock,
            image_base64: medicine.image_base64
        };
        const { data, error } = await supabase.from('medicines').insert([dbMedicine]).select();
        if (data && !error) {
            const newMed = data[0];
            setMedicines(prev => [...prev, { ...newMed, inStock: newMed.instock }]);
        } else {
            console.error("Failed to add medicine", error);
        }
    };

    const updateMedicineImage = async (id, base64Image) => {
        const { error } = await supabase.from('medicines').update({ image_base64: base64Image }).eq('id', id);
        if (!error) {
            setMedicines(prev => prev.map(med => med.id === id ? { ...med, image_base64: base64Image } : med));
        }
    };

    const addDoctor = async (doctor) => {
        const { data, error } = await supabase.from('doctors').insert([doctor]).select();
        if (data && !error) {
            setDoctors(prev => [...prev, data[0]]);
        } else {
            console.error("Failed to add doctor", error);
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

    return (
        <AppContext.Provider value={{
            medicines,
            addMedicine,
            updateMedicineImage,
            labTests,
            doctors,
            addDoctor,
            updateDoctorImage,
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            appointments,
            addAppointment,
            updateAppointmentStatus,
            loading
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}

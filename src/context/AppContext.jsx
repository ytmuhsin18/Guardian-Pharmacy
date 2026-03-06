import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

const initialMedicines = [
    { id: 1, name: 'Paracetamol 500mg', category: 'Fever & Pain', condition: 'Fever', price: 2.50, description: 'Effective pain relief and fever reducer.', inStock: true },
    { id: 2, name: 'Amoxicillin 250mg', category: 'Antibiotics', condition: 'General', price: 15.00, description: 'Treats bacterial infections. Prescription required.', inStock: true },
    { id: 3, name: 'Cetirizine 10mg', category: 'Allergy', condition: 'Allergy', price: 5.20, description: 'Relief from allergy symptoms like sneezing.', inStock: true },
    { id: 4, name: 'Vitamin C 1000mg', category: 'Supplements', condition: 'Immunity', price: 12.00, description: 'Immunity booster dietary supplement.', inStock: true },
    { id: 5, name: 'Omeprazole 20mg', category: 'Digestion', condition: 'Acidity', price: 8.50, description: 'Reduces stomach acid, treats heartburn.', inStock: false },
    { id: 6, name: 'Ibuprofen 400mg', category: 'Fever & Pain', condition: 'Pain', price: 4.00, description: 'Anti-inflammatory painkiller.', inStock: true },
    { id: 7, name: 'Metformin 500mg', category: 'Diabetes', condition: 'Diabetes', price: 6.50, description: 'Helps control blood sugar levels.', inStock: true },
    { id: 8, name: 'Thyroxine 50mcg', category: 'Thyroid', condition: 'Thyroid', price: 9.00, description: 'Thyroid hormone replacement therapy.', inStock: true },
    { id: 9, name: 'Aspirin 75mg', category: 'Heart', condition: 'Heart', price: 3.50, description: 'Low dose for heart health.', inStock: true },
];

const initialLabTests = [
    { id: 101, name: 'Complete Blood Count (CBC)', category: 'Blood Studies', condition: 'General', price: 15.00, originalPrice: 20.00, discount: '25%', testsIncluded: 30 },
    { id: 102, name: 'HbA1c Test', category: 'Diabetes', condition: 'Diabetes', price: 25.00, originalPrice: 35.00, discount: '28%', testsIncluded: 3 },
    { id: 103, name: 'Thyroid Profile (T3, T4, TSH)', category: 'Thyroid', condition: 'Thyroid', price: 30.00, originalPrice: 50.00, discount: '40%', testsIncluded: 3 },
    { id: 104, name: 'Lipid Profile', category: 'Heart', condition: 'Heart', price: 22.00, originalPrice: 30.00, discount: '26%', testsIncluded: 8 },
    { id: 105, name: 'Liver Function Test', category: 'Liver', condition: 'Liver', price: 28.00, originalPrice: 40.00, discount: '30%', testsIncluded: 11 },
    { id: 106, name: 'Kidney Function Test', category: 'Kidney', condition: 'Kidney', price: 26.00, originalPrice: 38.00, discount: '31%', testsIncluded: 10 },
    { id: 107, name: 'Fasting Blood Sugar (FBS)', category: 'Diabetes', condition: 'Diabetes', price: 8.00, originalPrice: 15.00, discount: '46%', testsIncluded: 1 },
    { id: 108, name: 'Vitamin D Total', category: 'Vitamin', condition: 'Immunity', price: 35.00, originalPrice: 60.00, discount: '41%', testsIncluded: 1 }
];

export function AppProvider({ children }) {
    const [medicines, setMedicines] = useState(initialMedicines);
    const [labTests, setLabTests] = useState(initialLabTests);
    const [cart, setCart] = useState([]);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        // Load data from local storage or use defaults
        const storedMedicines = localStorage.getItem('guardian_medicines');
        if (storedMedicines) {
            setMedicines(JSON.parse(storedMedicines));
        } else {
            setMedicines(initialMedicines);
            localStorage.setItem('guardian_medicines', JSON.stringify(initialMedicines));
        }

        const storedAppointments = localStorage.getItem('guardian_appointments');
        if (storedAppointments) {
            setAppointments(JSON.parse(storedAppointments));
        }
    }, []);

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

    const addAppointment = (appointment) => {
        const updated = [...appointments, { ...appointment, id: Date.now(), status: 'Pending' }];
        setAppointments(updated);
        localStorage.setItem('guardian_appointments', JSON.stringify(updated));
    };

    const updateAppointmentStatus = (id, status) => {
        const updated = appointments.map(apt => apt.id === id ? { ...apt, status } : apt);
        setAppointments(updated);
        localStorage.setItem('guardian_appointments', JSON.stringify(updated));
    };

    const addMedicine = (medicine) => {
        setMedicines([...medicines, { ...medicine, id: Date.now() }]);
    };

    return (
        <AppContext.Provider value={{
            medicines,
            addMedicine,
            labTests,
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            appointments,
            addAppointment,
            updateAppointmentStatus
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}

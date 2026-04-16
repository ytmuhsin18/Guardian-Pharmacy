import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './CustomerNotification.css';

function CustomerNotification() {
    const { toasts } = useApp();
    const [notifications, setNotifications] = useState([]);

    // Check orders and appointments every 8 seconds
    useEffect(() => {
        let isMounted = true;
        const intervalId = setInterval(async () => {
            if (!isMounted) return;

            // Check Orders
            await checkUpdates('my_guardian_orders', 'notified_guardian_orders', 'orders', 'Order');

            // Check Appointments
            await checkUpdates('my_guardian_appointments', 'notified_guardian_appointments', 'appointments', 'Appointment');

        }, 8000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, []);

    const checkUpdates = async (myItemsKey, notifiedItemsKey, tableName, entityName) => {
        const myItemsJSON = localStorage.getItem(myItemsKey);
        if (!myItemsJSON) return;

        let myItemIds = [];
        try {
            myItemIds = JSON.parse(myItemsJSON);
        } catch (e) {
            return;
        }

        if (myItemIds.length === 0) return;

        const notifiedItemsJSON = localStorage.getItem(notifiedItemsKey) || '[]';
        let notifiedItems = [];
        try {
            notifiedItems = JSON.parse(notifiedItemsJSON);
        } catch (e) { }

        const itemsToCheck = myItemIds.filter(id => !notifiedItems.includes(id));
        if (itemsToCheck.length === 0) return;

        try {
            const response = await fetch(`/api/${tableName}/statusCheck`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: itemsToCheck })
            });

            if (!response.ok) {
                console.error(`Error fetching ${tableName} status`);
                return;
            }
            
            const data = await response.json();

            if (data && data.length > 0) {
                let anyNotified = false;
                data.forEach(item => {
                    if (item.status !== 'Pending') {
                        showNotification(item, entityName);
                        notifiedItems.push(item.id);
                        anyNotified = true;
                    }
                });

                if (anyNotified) {
                    localStorage.setItem(notifiedItemsKey, JSON.stringify(notifiedItems));
                }
            }
        } catch (error) {
            console.error("Poller error:", error);
        }
    };

    const showNotification = (item, entityName) => {
        const newNotif = {
            id: Date.now() + Math.random(),
            orderId: item.id,
            status: item.status,
            message: item.status === 'Confirmed' ? `Your ${entityName} was Accepted!` : `Your ${entityName} was Cancelled.`,
            isSuccess: item.status === 'Confirmed'
        };

        setNotifications(prev => [...prev, newNotif]);

        // Auto-remove after 6 seconds
        setTimeout(() => {
            removeNotification(newNotif.id);
        }, 6000);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const allItems = [
        ...notifications.map(n => ({ ...n, type: 'order' })),
        ...toasts.map(t => ({ ...t, type: 'toast' }))
    ];

    if (allItems.length === 0) return null;

    return (
        <div className="customer-notifications-container">
            <AnimatePresence mode="popLayout">
                {allItems.map(item => {
                    const isOrder = item.type === 'order';
                    const id = item.id;
                    const isSuccess = isOrder ? item.isSuccess : item.type !== 'error';
                    const icon = isSuccess ? <CheckCircle size={28} /> : <X size={28} />;
                    const title = isOrder ? 'Order Update' : 'Notice';
                    const message = isOrder ? item.message : item.message;

                    return (
                        <motion.div
                            key={id}
                            layout
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 50, scale: 0.9 }}
                            className={`notification-popup glass-panel ${isSuccess ? 'success' : 'error'}`}
                        >
                            <div className="notification-icon">
                                {icon}
                            </div>
                            <div className="notification-content">
                                <h4>{title}</h4>
                                <p>{message}</p>
                            </div>
                            {isOrder && (
                                <button className="notification-close" onClick={() => removeNotification(id)}>
                                    <X size={18} />
                                </button>
                            )}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}

export default CustomerNotification;

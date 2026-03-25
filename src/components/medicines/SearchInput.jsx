import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SearchInput = ({ searchTerm, setSearchTerm, placeholders = ["Search..."] }) => {
    const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [speed, setSpeed] = useState(120);

    useEffect(() => {
        const handleType = () => {
            const i = currentPlaceholderIndex % placeholders.length;
            const fullText = placeholders[i];

            if (isDeleting) {
                setCurrentText(fullText.substring(0, currentText.length - 1));
                setSpeed(40);
            } else {
                setCurrentText(fullText.substring(0, currentText.length + 1));
                setSpeed(120);
            }

            if (!isDeleting && currentText === fullText) {
                setTimeout(() => setIsDeleting(true), 1200);
            } else if (isDeleting && currentText === "") {
                setIsDeleting(false);
                setCurrentPlaceholderIndex(i + 1);
                setSpeed(400);
            }
        };

        const timer = setTimeout(handleType, speed);
        return () => clearTimeout(timer);
    }, [currentText, isDeleting, currentPlaceholderIndex, speed, placeholders]);

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <input
                type="text"
                className="input-field search-input"
                placeholder={searchTerm ? "" : currentText}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {!searchTerm && (
                <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: 'absolute',
                        left: `calc(3rem + ${currentText.length * 8.5}px)`,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '2px',
                        height: '24px',
                        background: 'var(--primary)',
                        pointerEvents: 'none',
                        zIndex: 20,
                        visibility: currentText ? 'visible' : 'hidden'
                    }}
                />
            )}
        </div>
    );
};

export default SearchInput;

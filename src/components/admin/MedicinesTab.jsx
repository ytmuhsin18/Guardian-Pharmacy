import React, { memo, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Pill, CheckCircle, Save, X, Search, ToggleRight, ToggleLeft, Edit2, Trash2, Paperclip, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { uploadToCloudinary } from '../../lib/cloudinary';

const MedicineTableRow = memo(({ med, onEdit, onDelete, onToggleStock }) => {
    const { fetchMedicineImage } = useApp();
    const [imageSrc, setImageSrc] = React.useState(
        (Array.isArray(med.images) && med.images.length > 0) ? med.images[0] : med.image_base64
    );
    const [isVisible, setIsVisible] = React.useState(false);
    const rowRef = React.useRef(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (rowRef.current) {
            observer.observe(rowRef.current);
        }

        return () => observer.disconnect();
    }, []);

    React.useEffect(() => {
        if (isVisible && !imageSrc) {
            fetchMedicineImage(med.id).then(base64 => {
                if (base64) setImageSrc(base64);
            });
        }
    }, [isVisible, med.id, imageSrc, fetchMedicineImage]);

    return (
        <tr ref={rowRef}>
            <td>
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt={med.name}
                        style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px', background: 'white', border: '1px solid #e2e8f0' }}
                        loading="lazy"
                    />
                ) : (
                    <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                        <Pill size={20} color="#94a3b8" />
                    </div>
                )}
            </td>
            <td>
                <strong>{med.name}</strong><br />
                {med.combination && <span className="text-muted text-sm">{med.combination}</span>}
            </td>
            <td>{med.category}</td>
            <td>
                ₹{med.price}
                {med.discount > 0 && <span style={{ marginLeft: '8px', color: '#ea580c', fontSize: '0.8rem', fontWeight: 'bold' }}>-{Math.round(med.discount)}%</span>}
            </td>
            <td>
                <button
                    className={`stock-toggle-btn ${med.inStock ? 'in-stock' : 'out-of-stock'}`}
                    onClick={() => onToggleStock(med.id, med.inStock)}
                    title={med.inStock ? 'Click to mark Out of Stock' : 'Click to mark In Stock'}
                >
                    {med.inStock ? (
                        <><ToggleRight size={20} /> In Stock</>
                    ) : (
                        <><ToggleLeft size={20} /> Out of Stock</>
                    )}
                </button>
            </td>
            <td>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        className="btn-icon accept"
                        onClick={() => onEdit(med)}
                        title="Edit Medicine"
                        style={{ background: '#e0f2fe', color: 'var(--primary)', border: '1px solid #bae6fd' }}
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        className="btn-icon reject"
                        onClick={() => onDelete(med.id, med.name)}
                        title="Delete Medicine"
                        style={{ background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca' }}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
});

const MedicinesTab = memo(({ medicines, addMedicine, updateMedicineData, deleteMedicine, toggleMedicineStock }) => {
    const [newMedicine, setNewMedicine] = useState({
        name: '', combination: '', category: '', mrp: '', price: '', discount: '', description: '', stockQuantity: '', images: [], availableSizes: []
    });
    const [editingMedicineId, setEditingMedicineId] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Auto-sync global price with first size for Ortho products
    React.useEffect(() => {
        if (newMedicine.category === 'Ortho' && newMedicine.availableSizes.length > 0) {
            const firstSize = newMedicine.availableSizes[0];
            if (firstSize.mrp !== newMedicine.mrp || firstSize.price !== newMedicine.price) {
                // Only sync if they were empty or we just added/removed a size
                // We actually want the global to ALWAYS match the first size for listing purposes
                setNewMedicine(prev => ({
                    ...prev,
                    mrp: firstSize.mrp,
                    price: firstSize.price,
                    // Re-calculate discount for global consistency
                    discount: (firstSize.mrp > 0 && firstSize.price > 0) 
                        ? (((parseFloat(firstSize.mrp) - parseFloat(firstSize.price)) / parseFloat(firstSize.mrp)) * 100).toFixed(2)
                        : prev.discount
                }));
            }
        }
    }, [newMedicine.availableSizes, newMedicine.category]);

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setIsUploading(true);
            try {
                const uploadPromises = files.map(file => uploadToCloudinary(file));
                const uploadedUrls = await Promise.all(uploadPromises);

                setNewMedicine(prev => ({
                    ...prev,
                    images: [...prev.images, ...uploadedUrls]
                }));
            } catch (error) {
                console.error("Upload failed:", error);
                alert("Failed to upload image(s). Make sure you have created an Unsigned Upload Preset named 'guardian_pharma_uploads' in Cloudinary Settings.");
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handlePricingChange = (field, value) => {
        setNewMedicine(prev => {
            const updated = { ...prev, [field]: value };
            
            // Allow empty values to be typed without immediately forcing to 0/NaN
            if (value === '') return updated;

            const mrp = parseFloat(field === 'mrp' ? value : updated.mrp) || 0;
            const discount = parseFloat(field === 'discount' ? value : updated.discount) || 0;
            const price = parseFloat(field === 'price' ? value : updated.price) || 0;
            
            if (field === 'mrp' || field === 'discount') {
                updated.price = (mrp - (mrp * discount / 100)).toFixed(2);
            } else if (field === 'price') {
                if (mrp > 0) {
                    updated.discount = (((mrp - price) / mrp) * 100).toFixed(2);
                } else {
                    updated.discount = 0;
                }
            }
            return updated;
        });
    };

    const handleMedicineSubmit = async (e) => {
        e.preventDefault();

        const submissionData = {
            name: newMedicine.name,
            combination: newMedicine.combination || null,
            category: newMedicine.category,
            price: parseFloat(newMedicine.price),
            discount: newMedicine.discount ? parseFloat(newMedicine.discount) : 0,
            description: newMedicine.description || null,
            inStock: parseInt(newMedicine.stockQuantity) > 0,
            images: newMedicine.images || [],
            availableSizes: newMedicine.availableSizes || []
        };

        let success;
        if (editingMedicineId) {
            success = await updateMedicineData(editingMedicineId, submissionData);
            if (success) setUploadSuccess('Medicine updated successfully!');
        } else {
            success = await addMedicine(submissionData);
            if (success) setUploadSuccess('Medicine added successfully!');
        }

        if (!success) {
            setUploadSuccess('Error! Check console for details.');
        }

        setNewMedicine({ name: '', combination: '', category: '', mrp: '', price: '', discount: '', description: '', stockQuantity: '', images: [], availableSizes: [] });
        setEditingMedicineId(null);

        setTimeout(() => {
            setUploadSuccess(false);
        }, 2500);
    };

    const handleEditMedicine = (med) => {
        const calculatedMrp = med.discount > 0 ? (med.price / (1 - (med.discount / 100))).toFixed(2) : med.price;

        setNewMedicine({
            name: med.name,
            combination: med.combination || '',
            category: med.category,
            mrp: calculatedMrp,
            price: med.price,
            discount: med.discount || '',
            description: med.description || '',
            stockQuantity: med.stockQuantity || (med.inStock ? 100 : 0),
            images: Array.isArray(med.images) ? med.images : (med.image_base64 ? [med.image_base64] : []),
            availableSizes: med.availableSizes || []
        });
        setEditingMedicineId(med.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setNewMedicine({ name: '', combination: '', category: '', mrp: '', price: '', discount: '', description: '', stockQuantity: '', images: [], availableSizes: [] });
        setEditingMedicineId(null);
    };

    const handleDeleteMedicine = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            const success = await deleteMedicine(id);
            if (success) {
                setUploadSuccess('Medicine deleted successfully!');
                setTimeout(() => setUploadSuccess(false), 2500);
            }
        }
    };

    const filteredMedicines = useMemo(() => {
        return medicines.filter(m =>
            (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (m.combination && m.combination.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (m.category || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [medicines, searchTerm]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="upload-view"
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
            <div className="upload-form-container glass-panel" style={{ padding: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>{editingMedicineId ? 'Edit Medicine' : 'Add New Medicine'}</h2>
                {uploadSuccess && uploadSuccess.includes('Error') ? (
                    <div className="error-state text-center" style={{ padding: '3rem' }}>
                        <X size={64} style={{ color: '#ef4444', margin: '0 auto 1rem' }} />
                        <h3>{uploadSuccess}</h3>
                        <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setUploadSuccess(false)}>Try Again</button>
                    </div>
                ) : uploadSuccess ? (
                    <div className="success-state text-center" style={{ padding: '3rem' }}>
                        <CheckCircle size={64} className="text-primary" style={{ margin: '0 auto 1rem' }} />
                        <h3>{uploadSuccess}</h3>
                        <p className="text-muted">The product is now available in the store.</p>
                    </div>
                ) : (
                    <form onSubmit={handleMedicineSubmit} className="upload-form">
                        <div className="form-row">
                            <div className="input-group">
                                <label className="input-label" style={{ fontWeight: 600, color: '#334155' }}>Medicine Name <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    placeholder="e.g. Paracetamol 500mg"
                                    value={newMedicine.name}
                                    onChange={e => setNewMedicine({ ...newMedicine, name: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label" style={{ fontWeight: 600, color: '#334155' }}>Category <span className="text-danger">*</span></label>
                                <select
                                    required
                                    className="input-field"
                                    value={newMedicine.category}
                                    onChange={e => setNewMedicine({ ...newMedicine, category: e.target.value })}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Fever & Pain">Fever & Pain</option>
                                    <option value="Antibiotics">Antibiotics</option>
                                    <option value="Allergy">Allergy</option>
                                    <option value="Supplements">Supplements</option>
                                    <option value="Digestion">Digestion</option>
                                    <option value="First Aid">First Aid</option>
                                    <option value="Baby Care">Baby Care</option>
                                    <option value="Adult Care">Adult Care</option>
                                    <option value="Pharmacy">Pharmacy</option>
                                    <option value="Skin Care">Skin Care</option>
                                    <option value="Vitamins">Vitamins</option>
                                    <option value="Personal Care">Personal Care</option>
                                    <option value="Ayurvedic">Ayurvedic</option>
                                    <option value="Pain Relief">Pain Relief</option>
                                    <option value="Healthcare Devices">Healthcare Devices</option>
                                    <option value="Home Care">Home Care</option>
                                    <option value="Sexual Wellness">Sexual Wellness</option>
                                    <option value="Maternity Care">Maternity Care</option>
                                    <option value="Surgical Products">Surgical Products</option>
                                    <option value="Ortho">Ortho</option>
                                    <option value="Physiotherapy">Physiotherapy</option>
                                    <option value="Dental care">Dental care</option>
                                    <option value="Mother Care">Mother Care</option>
                                    <option value="Quit Smoking">Quit Smoking</option>
                                </select>
                            </div>
                        </div>

                        {newMedicine.category === 'Ortho' && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{ 
                                    background: '#f8fafc', 
                                    padding: '1.5rem', 
                                    borderRadius: '16px', 
                                    border: '1px solid #e2e8f0',
                                    marginBottom: '1.5rem'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                                    <Activity size={18} color="#0d9488" />
                                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Size-specific Pricing</h4>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '1.5rem' }}>
                                    {['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'UNI'].map(size => {
                                        const existing = newMedicine.availableSizes.find(s => s.size === size);
                                        return (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => {
                                                    const current = newMedicine.availableSizes;
                                                    if (existing) {
                                                        setNewMedicine({ ...newMedicine, availableSizes: current.filter(s => s.size !== size) });
                                                    } else {
                                                        setNewMedicine({ 
                                                            ...newMedicine, 
                                                            availableSizes: [...current, { size, mrp: newMedicine.mrp || '', price: newMedicine.price || '' }] 
                                                        });
                                                    }
                                                }}
                                                style={{
                                                    minWidth: '54px',
                                                    height: '42px',
                                                    borderRadius: '10px',
                                                    border: existing ? '2px solid #0d9488' : '1px solid #cbd5e1',
                                                    background: existing ? '#0d9488' : 'white',
                                                    color: existing ? 'white' : '#64748b',
                                                    fontWeight: 800,
                                                    fontSize: '0.9rem',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                                }}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>

                                {newMedicine.availableSizes.length > 0 && (
                                    <div className="size-prices-grid" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '15px', padding: '0 8px', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                            <span>Size</span>
                                            <span>MRP (₹)</span>
                                            <span>Selling Price (₹)</span>
                                        </div>
                                        {newMedicine.availableSizes.map((s, idx) => (
                                            <motion.div 
                                                key={s.size}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '15px', alignItems: 'center' }}
                                            >
                                                <span style={{ fontWeight: 800, color: '#0d9488', fontSize: '1rem' }}>{s.size}</span>
                                                <input 
                                                    type="number"
                                                    className="input-field" 
                                                    placeholder="MRP"
                                                    value={s.mrp}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const updated = [...newMedicine.availableSizes];
                                                        updated[idx].mrp = val;
                                                        
                                                        // If this is the first size, sync to global MRP
                                                        const updateObj = { ...newMedicine, availableSizes: updated };
                                                        if (idx === 0) {
                                                            updateObj.mrp = val;
                                                            // Also recalculate global price based on current global discount
                                                            const disc = parseFloat(newMedicine.discount) || 0;
                                                            const m = parseFloat(val) || 0;
                                                            updateObj.price = (m - (m * disc / 100)).toFixed(2);
                                                        }
                                                        setNewMedicine(updateObj);
                                                    }}
                                                    style={{ height: '38px', borderRadius: '8px', fontSize: '0.9rem' }}
                                                />
                                                <input 
                                                    type="number"
                                                    className="input-field" 
                                                    placeholder="Price"
                                                    value={s.price}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const updated = [...newMedicine.availableSizes];
                                                        updated[idx].price = val;
                                                        
                                                        // If this is the first size, sync to global Price
                                                        const updateObj = { ...newMedicine, availableSizes: updated };
                                                        if (idx === 0) {
                                                            updateObj.price = val;
                                                            // Also recalculate global discount based on current global MRP
                                                            const m = parseFloat(newMedicine.mrp) || 0;
                                                            const p = parseFloat(val) || 0;
                                                            if (m > 0) {
                                                                updateObj.discount = (((m - p) / m) * 100).toFixed(2);
                                                            }
                                                        }
                                                        setNewMedicine(updateObj);
                                                    }}
                                                    style={{ height: '38px', borderRadius: '8px', fontSize: '0.9rem' }}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        <div className="form-row" style={{ display: (newMedicine.category === 'Ortho' && newMedicine.availableSizes.length > 0) ? 'none' : 'flex' }}>
                            <div className="input-group">
                                <label className="input-label" style={{ fontWeight: 600, color: '#334155' }}>Actual Price / MRP (₹) <span className="text-danger">*</span></label>
                                <input
                                    type="number"
                                    required={!(newMedicine.category === 'Ortho' && newMedicine.availableSizes.length > 0)}
                                    min="0" step="0.01"
                                    className="input-field"
                                    placeholder="e.g. 10.00"
                                    value={newMedicine.mrp}
                                    onChange={e => handlePricingChange('mrp', e.target.value)}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label" style={{ fontWeight: 600, color: '#334155' }}>Sales Discount (%)</label>
                                <input
                                    type="number"
                                    min="0" max="100" step="0.01"
                                    className="input-field"
                                    placeholder="e.g. 10"
                                    value={newMedicine.discount}
                                    onChange={e => handlePricingChange('discount', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-row" style={{ display: (newMedicine.category === 'Ortho' && newMedicine.availableSizes.length > 0) ? 'none' : 'flex' }}>
                            <div className="input-group">
                                <label className="input-label" style={{ fontWeight: 600, color: '#334155' }}>Final Selling Price (₹) <span className="text-danger">*</span></label>
                                <div style={{ 
                                    background: '#f0fdf4', 
                                    border: '1px solid #bbf7d0', 
                                    borderRadius: 'var(--border-radius-sm)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: '42px',
                                    padding: '0 1rem',
                                }}>
                                    <span style={{ fontWeight: '800', color: '#15803d', fontSize: '1.2rem', marginRight: '6px' }}>₹</span>
                                    <input
                                        type="number"
                                        required={!(newMedicine.category === 'Ortho' && newMedicine.availableSizes.length > 0)}
                                        min="0" step="0.01"
                                        placeholder="0.00"
                                        value={newMedicine.price}
                                        onChange={e => handlePricingChange('price', e.target.value)}
                                        style={{
                                            border: 'none',
                                            background: 'transparent',
                                            fontWeight: '800',
                                            color: '#15803d',
                                            fontSize: '1.2rem',
                                            width: '100%',
                                            outline: 'none',
                                            padding: 0
                                        }}
                                    />
                                </div>
                                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                                    (Enter manually or auto-calculated)
                                </span>
                            </div>

                            <div className="input-group">
                                <label className="input-label" style={{ fontWeight: 600, color: '#334155' }}>Stock Quantity <span className="text-danger">*</span></label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    className="input-field"
                                    placeholder="e.g. 50"
                                    value={newMedicine.stockQuantity}
                                    onChange={e => setNewMedicine({ ...newMedicine, stockQuantity: e.target.value })}
                                />
                            </div>
                        </div>

                        {(newMedicine.category === 'Ortho' && newMedicine.availableSizes.length > 0) && (
                            <div className="input-group">
                                <label className="input-label" style={{ fontWeight: 600, color: '#334155' }}>Stock Quantity <span className="text-danger">*</span></label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    className="input-field"
                                    placeholder="e.g. 50"
                                    value={newMedicine.stockQuantity}
                                    onChange={e => setNewMedicine({ ...newMedicine, stockQuantity: e.target.value })}
                                />
                            </div>
                        )}

                        <div className="input-group">
                            <label className="input-label" style={{ fontWeight: 600, color: '#334155' }}>Combination / Composition</label>
                            <textarea
                                className="input-field"
                                rows="2"
                                placeholder="e.g. Paracetamol + Caffeine"
                                value={newMedicine.combination}
                                onChange={e => setNewMedicine({ ...newMedicine, combination: e.target.value })}
                                style={{ resize: 'vertical' }}
                            ></textarea>
                        </div>

                        <div className="input-group">
                            <label className="input-label" style={{ fontWeight: 600, color: '#334155' }}>Medicine Images</label>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', background: 'white' }}>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    id="med-image"
                                    style={{ display: 'none' }}
                                    onChange={handleImageUpload}
                                />
                                <label htmlFor="med-image" style={{ background: '#f1f5f9', padding: '0.65rem 1rem', borderRight: '1px solid var(--border-color)', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem', color: '#334155', borderTopLeftRadius: 'var(--border-radius-sm)', borderBottomLeftRadius: 'var(--border-radius-sm)' }}>
                                    Choose File
                                </label>
                                <span style={{ padding: '0 1rem', color: '#64748b', fontSize: '0.9rem' }}>
                                    {isUploading ? 'Uploading...' : (newMedicine.images.length > 0 ? `${newMedicine.images.length} Image(s) selected` : 'No file chosen')}
                                </span>
                            </div>
                            {newMedicine.images.length > 0 && (
                                <div style={{ marginTop: '15px', display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                                    {newMedicine.images.map((img, idx) => (
                                        <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                                            <img src={img} alt={`Preview ${idx}`} style={{ width: '100px', height: '100px', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--border-color)', padding: '5px', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updatedImages = [...newMedicine.images];
                                                    updatedImages.splice(idx, 1);
                                                    setNewMedicine({ ...newMedicine, images: updatedImages });
                                                }}
                                                style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white', cursor: 'pointer', zIndex: 2 }}
                                                title="Delete Image"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="input-group">
                            <label className="input-label" style={{ fontWeight: 600, color: '#334155' }}>Description</label>
                            <textarea
                                className="input-field"
                                rows="5"
                                placeholder="Briefly describe the medicine, dosage, and uses..."
                                value={newMedicine.description}
                                onChange={e => setNewMedicine({ ...newMedicine, description: e.target.value })}
                                style={{ resize: 'vertical' }}
                            ></textarea>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '30px', display: 'flex', alignItems: 'center' }}>
                                {editingMedicineId ? (
                                    <><Save size={18} style={{ marginRight: '6px' }} /> Update Product</>
                                ) : (
                                    <><Paperclip size={18} style={{ transform: 'rotate(-45deg)', marginRight: '6px' }} /> Upload Product to Store</>
                                )}
                            </button>

                            {editingMedicineId && (
                                <button type="button" className="btn btn-outline" onClick={cancelEdit} style={{ borderRadius: '30px', display: 'flex', alignItems: 'center' }}>
                                    <X size={18} style={{ marginRight: '6px' }} /> Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>
                )}
            </div>

            <div className="manage-medicines-container glass-panel" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0 }}>Manage Existing Medicines ({filteredMedicines.length})</h3>
                    <div className="admin-search-wrapper">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            className="admin-search-input"
                            placeholder="Search medicines..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="medicines-scroll-wrapper">
                    <div className="appointments-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name / Comb.</th>
                                    <th>Category</th>
                                    <th>Price / Disc.</th>
                                    <th>Stock Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMedicines.map(med => (
                                    <MedicineTableRow
                                        key={med.id}
                                        med={med}
                                        onEdit={handleEditMedicine}
                                        onDelete={handleDeleteMedicine}
                                        onToggleStock={toggleMedicineStock}
                                    />
                                ))}
                                {filteredMedicines.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center text-muted" style={{ padding: '2rem' }}>No medicines found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

export default MedicinesTab;

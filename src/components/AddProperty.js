import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProperty = () => {
    const [formData, setFormData] = useState({
        title: '', price: '', location: '', bhk: '', propertyType: 'Flat',
        area: '', areaUnit: 'sq.ft.', floor: '', description: '', postedBy: 'Owner', imageUrl: '',
        sellerName: '', sellerPhone: '',
        facing: 'North', isCorner: 'No',
        road: ''
    });

    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const [userOtp, setUserOtp] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    const navigate = useNavigate();

    const toProperCase = (str) => {
        return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const form = e.target.form;
            const index = Array.prototype.indexOf.call(form, e.target);
            if (form.elements[index + 1]) {
                form.elements[index + 1].focus();
            }
        }
    };

    const handleOtpKeyDown = (e, nextId) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nextId === 'submit') {
                handleVerifyAndPost();
            } else {
                document.getElementById(nextId).focus();
            }
        }
    };

    const handleFile = (e) => {
        const reader = new FileReader();
        reader.onloadend = () => setFormData({ ...formData, imageUrl: reader.result });
        if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
    };

    const handlePreSubmit = (e) => {
        e.preventDefault();
        if (formData.sellerPhone.length < 10) return alert("Enter valid 10-digit mobile number");
        setShowOtpPopup(true);
    };

    const handleVerifyAndPost = () => {
        if (userOtp === "1234") {
            setIsPosting(true);
            const uniqueId = "JMD-" + Math.floor(1000 + Math.random() * 9000); // Branded ID
            const finalData = {
                ...formData,
                propertyId: uniqueId,
                postedAt: new Date().toISOString()
            };

            axios.post('http://127.0.0.1:5000/api/properties', finalData)
                .then(() => {
                    alert(`Property Posted Successfully! ID: ${uniqueId}`);
                    navigate('/');
                })
                .catch((err) => {
                    console.error(err);
                    alert("Server Error! Check if Node.js is running and Atlas IP is whitelisted.");
                    setIsPosting(false);
                });
        } else {
            alert("Invalid OTP! Please enter 1234");
        }
    };

    return (
        <div style={styles.container}>
            <button onClick={() => navigate('/')} style={styles.backBtn}>← Back</button>
            <h2 style={{ textAlign: 'center', color: '#0078db' }}>Post Property (JMD Properties)</h2>

            <form onSubmit={handlePreSubmit} style={styles.form}>
                <div style={styles.row}>
                    <select style={styles.input} tabIndex="1" onKeyDown={handleKeyDown} value={formData.postedBy} onChange={e => setFormData({ ...formData, postedBy: e.target.value })}>
                        <option value="Owner">I am Owner</option>
                        <option value="Agent">I am Agent</option>
                    </select>
                    <select style={styles.input} tabIndex="2" onKeyDown={handleKeyDown} value={formData.propertyType} onChange={e => setFormData({ ...formData, propertyType: e.target.value })}>
                        <option value="Flat">Flat/Apartment</option>
                        <option value="Plot">Residential Plot</option>
                        <option value="House">Independent House</option>
                        <option value="Commercial">Commercial</option>
                    </select>
                </div>

                <input style={styles.input} tabIndex="3" placeholder="Property Title (e.g. Luxury 3BHK in Rohini)" onKeyDown={handleKeyDown} onBlur={(e) => setFormData({ ...formData, title: toProperCase(e.target.value) })} onChange={e => setFormData({ ...formData, title: e.target.value })} value={formData.title} required />

                <div style={styles.row}>
                    {/* FIXED PRICE INPUT */}
                    <input style={styles.input} tabIndex="4" type="number" placeholder="Price (Numeric)" onKeyDown={handleKeyDown} value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                    <input style={styles.input} tabIndex="5" placeholder="Location" onKeyDown={handleKeyDown} onBlur={(e) => setFormData({ ...formData, location: toProperCase(e.target.value) })} onChange={e => setFormData({ ...formData, location: e.target.value })} value={formData.location} required />
                </div>

                <div style={{ ...styles.row, flexWrap: 'wrap' }}>
                    {formData.propertyType !== 'Plot' && (
                        /* FIXED BHK INPUT */
                        <input style={{ ...styles.input, flex: '1 1 100px' }} tabIndex="6" placeholder="BHK" onKeyDown={handleKeyDown} value={formData.bhk} onChange={e => setFormData({ ...formData, bhk: e.target.value })} />
                    )}
                    <input style={{ ...styles.input, flex: '1 1 120px' }} tabIndex="7" type="number" placeholder="Area" onKeyDown={handleKeyDown} value={formData.area} onChange={e => setFormData({ ...formData, area: e.target.value })} required />
                    <select style={{ ...styles.input, flex: '0.5 1 80px' }} tabIndex="7" value={formData.areaUnit} onChange={e => setFormData({ ...formData, areaUnit: e.target.value })}>
                        <option value="sq.ft.">Sq. Ft.</option>
                        <option value="sq.mt.">Sq. Mt.</option>
                        <option value="sq.yd.">Sq. Yd.</option>
                    </select>
                    {formData.propertyType !== 'Plot' && (
                        /* FIXED FLOOR INPUT */
                        <input style={{ ...styles.input, flex: '1 1 100px' }} tabIndex="8" placeholder="Floor" onKeyDown={handleKeyDown} value={formData.floor} onChange={e => setFormData({ ...formData, floor: e.target.value })} />
                    )}
                </div>

                <div style={{ ...styles.row, background: '#f9f9f9', padding: '10px', borderRadius: '8px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center', flex: '1 1 150px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Road:</span>
                        <input style={{ ...styles.input, padding: '5px' }} placeholder="e.g. 12m" onKeyDown={handleKeyDown} onChange={e => setFormData({ ...formData, road: e.target.value })} value={formData.road} />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Facing:</span>
                        {['North', 'South', 'East', 'West'].map(dir => (
                            <label key={dir} style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                                <input type="radio" name="facing" value={dir} checked={formData.facing === dir} onChange={() => setFormData({ ...formData, facing: dir })} /> {dir}
                            </label>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginLeft: 'auto' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Corner:</span>
                        <label style={{ fontSize: '0.85rem', cursor: 'pointer' }}><input type="radio" name="corner" value="Yes" checked={formData.isCorner === 'Yes'} onChange={() => setFormData({ ...formData, isCorner: 'Yes' })} /> Yes</label>
                        <label style={{ fontSize: '0.85rem', cursor: 'pointer' }}><input type="radio" name="corner" value="No" checked={formData.isCorner === 'No'} onChange={() => setFormData({ ...formData, isCorner: 'No' })} /> No</label>
                    </div>
                </div>

                <textarea style={{ ...styles.input, height: '80px' }} tabIndex="9" placeholder="Detailed Summary" onKeyDown={handleKeyDown} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>

                <div style={styles.field}>
                    <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Select Photo: </label>
                    <input type="file" tabIndex="10" onChange={handleFile} style={{ marginLeft: '10px' }} />
                </div>

                <div style={styles.sellerSection}>
                    <input style={styles.input} tabIndex="11" placeholder="Your Name" onKeyDown={handleKeyDown} onBlur={(e) => setFormData({ ...formData, sellerName: toProperCase(e.target.value) })} onChange={e => setFormData({ ...formData, sellerName: e.target.value })} value={formData.sellerName} required />
                    <input style={styles.input} tabIndex="12" placeholder="Mobile" onKeyDown={handleKeyDown} value={formData.sellerPhone} onChange={e => setFormData({ ...formData, sellerPhone: e.target.value })} required />
                </div>

                <button type="submit" tabIndex="13" style={styles.submitBtn}>Post Property Free</button>
            </form>

            {showOtpPopup && (
                <div style={styles.overlay}>
                    <div style={styles.otpCard}>
                        <h3 style={{ margin: '0 0 10px 0' }}>Verify Mobile</h3>
                        <p style={{ fontSize: '0.85rem', color: '#666' }}>Enter OTP sent to {formData.sellerPhone}</p>
                        <input
                            id="otpInput"
                            type="text" placeholder="1234" style={styles.otpInput}
                            autoFocus maxLength="4"
                            onKeyDown={(e) => handleOtpKeyDown(e, 'otpSubmitBtn')}
                            onChange={(e) => setUserOtp(e.target.value)}
                        />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => setShowOtpPopup(false)} style={styles.cancelBtn}>Cancel</button>
                            <button
                                id="otpSubmitBtn"
                                onClick={handleVerifyAndPost}
                                disabled={isPosting}
                                style={styles.verifyBtn}
                            >
                                {isPosting ? "Posting..." : "Confirm & Post"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ... Styles remain exactly as you provided ...
const styles = {
    container: { maxWidth: '650px', margin: '20px auto', padding: '25px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', position: 'relative' },
    backBtn: { background: 'none', border: 'none', color: '#0078db', cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' },
    row: { display: 'flex', gap: '10px', alignItems: 'center' },
    input: { flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.95rem', minWidth: '0' },
    field: { display: 'flex', alignItems: 'center', padding: '5px' },
    sellerSection: { padding: '15px', background: '#f0f7ff', borderRadius: '8px', display: 'flex', gap: '10px' },
    submitBtn: { padding: '15px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', marginTop: '10px' },
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    otpCard: { background: '#fff', padding: '30px', borderRadius: '12px', textAlign: 'center', width: '300px' },
    otpInput: { width: '100%', padding: '10px', fontSize: '1.5rem', textAlign: 'center', borderRadius: '6px', border: '2px solid #0078db', marginBottom: '20px' },
    verifyBtn: { flex: 1, padding: '12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
    cancelBtn: { flex: 1, padding: '12px', background: '#eee', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' }
};

export default AddProperty;
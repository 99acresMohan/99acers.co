import React, { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Thank you, ${formData.name}! We have received your inquiry.`);
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div style={styles.container}>
            <h2>Contact Us</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input style={styles.input} type="text" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                <input style={styles.input} type="email" placeholder="Your Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                <textarea style={styles.input} placeholder="Message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required />
                <button type="submit" style={styles.button}>Send Message</button>
            </form>
        </div>
    );
};

const styles = {
    container: { padding: '50px', textAlign: 'center' },
    form: { display: 'flex', flexDirection: 'column', maxWidth: '400px', margin: '0 auto', gap: '15px' },
    input: { padding: '10px', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ccc' },
    button: { padding: '10px', backgroundColor: '#0078db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default Contact;
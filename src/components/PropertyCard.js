// src/components/PropertyCard.js
import { MapPin, IndianRupee } from 'lucide-react';

export const PropertyCard = ({ title, price, location }) => (
    <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', margin: '10px' }}>
        <h3 style={{ color: '#003580' }}>{title}</h3>
        <p><MapPin size={16} /> {location}</p>
        <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
            <IndianRupee size={18} /> {price}
        </div>
    </div>
);
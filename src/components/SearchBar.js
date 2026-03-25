// src/components/SearchBar.js
export const SearchBar = () => (
    <div style={{ background: '#f4f4f4', padding: '20px', display: 'flex', gap: '10px' }}>
        <input type="text" placeholder="Search Locality (e.g. Rohini Sector 34)" style={{ flex: 2, padding: '10px' }} />
        <select style={{ flex: 1 }}>
            <option>Residential</option>
            <option>Commercial</option>
        </select>
        <button style={{ background: '#d8232a', color: 'white', border: 'none', padding: '10px 20px' }}>Search</button>
    </div>
);
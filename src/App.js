import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 1. Import AppContent
import AppContent from './components/AppContent';

import TopBar from './components/TopBar';
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import EMICalculator from './components/EMICalculator';
import TaxGuide from './components/TaxGuide';
import Login from './components/Login';
import AddProperty from './components/AddProperty';

function App() {
    return (
        <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>

            {/* TopBar stays visible on every page */}
            <TopBar />

            <Routes>
                {/* 2. PASTE APPCONTENT HERE: This is now your Home Page */}
                <Route path="/" element={<AppContent />} />

                {/* Other Pages */}
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/emi-calculator" element={<EMICalculator />} />
                <Route path="/tax-guide" element={<TaxGuide />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<AddProperty />} />
            </Routes>

            <footer style={{ textAlign: 'center', padding: '20px', color: '#888', fontSize: '0.8rem' }}>
                © 2026 JMD Properties - Rohini, Delhi
            </footer>
        </div>
    );
}

export default App;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropertyTile from './PropertyTile'; // ✅ Correct path

const AppContent = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  
  // Array of your 10 images (Replace these with your actual local paths or URLs)
  const bannerImages = [
    '/delhi-hero.jpg',
    '/delhi-hero2.jpg',
    '/delhi-hero3.jpg',
    '/delhi-hero4.jpg',
    '/delhi-hero5.jpg',
    '/delhi-hero6.jpg',
    '/delhi-hero7.jpg',
    '/delhi-hero8.jpg',
    '/delhi-hero9.jpg',
    '/delhi-hero1.jpg'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex((prevIndex) => 
        prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // 5000ms = 5 Seconds

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, [bannerImages.length]);
  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdminLoggedIn');
    setIsAdmin(adminStatus === 'true');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    window.location.reload(); 
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/properties')
      .then(res => {
        setProperties(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Connection Error to Port 5000");
        setLoading(false);
      });
  }, []);

  return (
    <div style={styles.pageWrapper}>
      
      {/* 1. THE TOP BANNER (REPAIRED: NO OVERLAY, SHARP IMAGE) */}
      <div style={styles.hero}>
        {bannerImages.map((img, index) => (
          <img 
            key={index}
            src={img} 
            alt={`Banner ${index}`} 
            style={{
              ...styles.heroImg,
              opacity: currentImgIndex === index ? 1 : 0, // Only show active image
              transition: 'opacity 1s ease-in-out' // Smooth fade transition
            }} 
          />
        ))}
        
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>JMD Properties Delhi NCR</h1>
          <p style={styles.heroSubtitle}>Premium Residences • Commercial Hubs • Verified Leads</p>
        </div>
      </div>

      {/* 2. THE MAIN 25/75 LAYOUT */}
      <div style={styles.mainLayout}>
        
        {/* LEFT PANEL (25%) */}
        <div style={styles.leftPanel}>
          <div style={styles.sidebar}>
            <button onClick={() => navigate('/admin')} style={styles.postBtn}>
              <span style={{ marginRight: '10px' }}>➕</span> Post Your Property
            </button>
            
            <div style={styles.menuBox}>
              <div style={styles.menuHeader}>MAIN MENU</div>
              <div onClick={() => navigate('/')} style={styles.menuItem}>🏠 Home / Listings</div>
              <div onClick={() => navigate('/about')} style={styles.menuItem}>ℹ️ About Us</div>
              <div onClick={() => navigate('/contact')} style={styles.menuItem}>📞 Contact Us</div>
              
              <hr style={styles.divider} />
              
              <div style={styles.menuHeader}>ADMIN CONTROLS</div>
              {isAdmin ? (
                <>
                  <div onClick={() => navigate('/admin/logs')} style={styles.menuItem}>📋 Visitor Lead Logs</div>
                  <div onClick={() => navigate('/admin')} style={styles.menuItem}>⚙️ Manage Properties</div>
                  <div onClick={handleLogout} style={{...styles.menuItem, color: '#dc3545', fontWeight: 'bold'}}>
                    🚪 Logout Admin
                  </div>
                </>
              ) : (
                <div onClick={() => navigate('/login')} style={styles.menuItem}>🔑 Admin Login</div>
              )}
            </div>

            <div style={styles.promoCard}>
                <p style={styles.promoLabel}>MARKET INFO</p>
                <p style={styles.promoText}>UER-II connectivity is boosting property rates in North Delhi by 15%.</p>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT (75%) */}
        <div style={styles.rightContent}>
          <div style={styles.contentHeader}>
            <h2 style={{margin: 0}}>Properties for Sale</h2>
            <div style={styles.countBadge}>{properties.length} Properties Available</div>
          </div>

          {loading ? (
            <div style={styles.statusMsg}>Fetching latest properties...</div>
          ) : properties.length > 0 ? (
            <div style={styles.listContainer}>
              {properties.map(item => (
                <PropertyTile key={item._id} property={item} />
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <h3>No Properties Found</h3>
              <p>Start by adding a property using the "Post Your Property" button.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const styles = {
 pageWrapper: { backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'Segoe UI, Roboto, Arial' },
  
  hero: { 
    position: 'relative',
    height: '350px', 
    width: '100%',
    overflow: 'hidden',
    display: 'flex', 
    alignItems: 'flex-end', 
    justifyContent: 'flex-end', 
    backgroundColor: '#000' // Black background helps during the fade transition
  },
  heroImg: {
    position: 'absolute', 
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 1
  },
  heroContent: { 
    position: 'relative',
    textAlign: 'right', 
    padding: '20px 40px', 
    zIndex: 2
  },
  heroTitle: { 
    fontSize: '2.8rem', 
    fontWeight: '800', 
    margin: 0,
    color: 'white',
    textShadow: '2px 2px 10px rgba(0,0,0,1)' 
  },
  heroSubtitle: { 
    fontSize: '1.2rem', 
    fontWeight: '600',
    color: 'white',
    marginTop: '0px',
    textShadow: '2px 2px 8px rgba(0,0,0,1)' 
  },
  
  mainLayout: { display: 'flex', maxWidth: '1300px', margin: '0 auto', padding: '30px 20px' },
  leftPanel: { width: '25%', position: 'sticky', top: '20px', height: 'fit-content' },
  sidebar: { background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
  postBtn: { width: '100%', padding: '15px', background: '#0078db', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px', fontSize: '1rem' },
  
  menuBox: { textAlign: 'left' },
  menuHeader: { fontSize: '0.7rem', color: '#888', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '10px', marginTop: '15px' },
  menuItem: { padding: '12px 10px', color: '#333', cursor: 'pointer', fontSize: '0.95rem', borderRadius: '6px', transition: '0.2s' },
  divider: { border: '0', borderTop: '1px solid #eee', margin: '15px 0' },
  
  promoCard: { marginTop: '25px', padding: '15px', background: '#fff9e6', borderRadius: '8px', border: '1px solid #ffeeba' },
  promoLabel: { fontSize: '0.65rem', fontWeight: 'bold', color: '#856404', margin: 0 },
  promoText: { fontSize: '0.85rem', color: '#533f03', margin: '5px 0 0 0' },

  rightContent: { width: '75%', marginLeft: '35px' },
  contentHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  countBadge: { background: '#fff', padding: '5px 15px', borderRadius: '20px', fontSize: '0.85rem', color: '#666', border: '1px solid #ddd' },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '20px' },
  
  statusMsg: { textAlign: 'center', padding: '40px', color: '#666' },
  emptyState: { textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '12px', border: '1px dashed #ccc' }
};

export default AppContent;
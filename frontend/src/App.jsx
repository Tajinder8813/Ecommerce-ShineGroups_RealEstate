import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import PropertyGrid from './components/PropertyGrid';
import PropertyDetails from './components/PropertyDetails';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import BusinessBanner from './components/BusinessBanner';
import Login from './pages/Login';
import api from './api/axios';
import { Star, MapPin, Clock, Phone, MessageCircle } from 'lucide-react';
import About from './pages/About';
import Services from './pages/Services';
import AdminDashboard from './pages/AdminDashboard'; 
import './App.css';


function App() {
  
  const [user, setUser] = useState({
    isAuthenticated: !!localStorage.getItem('token'),
    role: localStorage.getItem('role') || 'user'
  });
  
  const location = useLocation();
  const shineData = {
    name: "Shine Group",
    specializesIn:"Real Estate Builders & Construction Company",
    tagline: "Building Trust Since 2010",
    highlight: "Premium residential colonies and commercial hubs in the heart of Phagwara.",
    rating: "5.0",
    yearsInBusiness: "16",
    location: "Guru Hargobind Nagar, Phagwara",
    openTime: "10:00 AM",
    phone: "+917340930407"
  };
  // Keep state synced across login events
  useEffect(() => {
    const checkAuth = () => {
        setUser({
        isAuthenticated: !!localStorage.getItem('token'),
        role: localStorage.getItem('role') || 'user'
      });
    };
    window.addEventListener('storage', checkAuth);
    window.addEventListener('authChange', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
      setUser({
      isAuthenticated: false,
      role: null
    });
    window.dispatchEvent(new Event('authChange'));
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${shineData.phone.replace('+', '')}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${shineData.phone}`;
  };

  // Hide the corporate layout completely if we are viewing the independent workspace panel
  const hideLayout =
    location.pathname === '/admin';

 return (
    <div className="app-wrapper">
      {!hideLayout && (<Navbar
            isAuthenticated={user.isAuthenticated}
            onLogout={handleLogout}
          />
      )}
      <main className="main-content">
        <Routes>
          {/* Hide standard marketplace navbar if an admin is logged into the console */}
           
          <Route path="/" element={
            <>
              <BusinessBanner 
                data={shineData} 
              />
              <PropertyGrid />
            </>
          } />
          <Route 
            path="/admin" 
            element={
              user.isAuthenticated && user.role === 'admin' ? 
              (<AdminDashboard onLogout={handleLogout} />) 
              :(
                // If not admin, silently bounce them back to login or home
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route path='/login' element = {<Login data ={shineData}/>}/>
          <Route path="/properties" element={<PropertyGrid />} />
          <Route path="/about" element={
            <About 
              isAuthenticated={user.isAuthenticated} 
              data={shineData} 
            />
          }/>
          <Route path="/services" element={
            <Services 
              isAuthenticated={user.isAuthenticated} 
              data = {shineData}
            />
          }/>
          <Route path="/property/:id" element={<PropertyDetails data = {shineData} />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/forgot-password"
                 element={<ForgotPassword />}
          />
          {/* Dashboard Route Protected Guardrail */}
          <Route path="/dashboard" element={
            user.isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hideLayout && (
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-grid">
              
              {/* Column 1: Company Brand */}
              <div className="footer-col">
                <h3 className="footer-brand-name">
                  {shineData.name}
                </h3>
                <h4 style={{color: 'var(--green)', marginTop: '-10px'}}>
                  {shineData.specializesIn}</h4>              
                <div className="footer-rating-row">
                  <div className="rating-pill">
                    <Star size={14} fill="white" /> {shineData.rating}
                  </div>
                  <span className="experience-text">
                    {shineData.yearsInBusiness} Years of Excellence
                  </span>
                </div>              
                <p className="footer-description">
                  {shineData.highlight}
                </p>
              </div>

              {/* Column 2: Contact */}
              <div className="footer-col">
                <h4>Visit Our Office</h4>
                <div className="contact-item">
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shineData.name + " " + shineData.location)}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="contact-item map-link"
                    style={{ textDecoration: 'none', color: 'inherit', display: 'flex', gap: '12px' }}
                  >
                    <MapPin size={18} />
                    <span>{shineData.location}</span>
                  </a>
                  
                </div>
                <div className="contact-item">
                  <Clock size={18} />
                  <span>Open: {shineData.openTime} - 7:00 PM</span>
                </div>
              </div>

              {/* Column 3: Actions */}
              <div className="footer-col">
                <h4>Get In Touch</h4>
                <div className="footer-btns">
                  <button className="btn-call" onClick={handleCall}>
                    <Phone size={16} /> Call Now
                  </button>
                  <button className="btn-wa" onClick={handleWhatsApp}>
                    <MessageCircle size={16} /> WhatsApp
                  </button>
                </div>
              </div>

            </div>

            <div className="footer-bottom">
              © {new Date().getFullYear()} {shineData.name}. All rights reserved.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
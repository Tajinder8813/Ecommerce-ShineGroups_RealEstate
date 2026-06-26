import React, {useState} from 'react';
import { Menu, X,  Home, Info, Phone, Building2, User, LogIn, List, ListCheckIcon, ListCheck, UserPlus, LogOut, LayoutDashboard } from 'lucide-react';
import './Navbar.css';
import logoImg from '../assets/logo_extracted.png';
import { useNavigate, Link, NavLink } from 'react-router-dom';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => setIsOpen(!isOpen);
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo" >
          <img src={logoImg} alt="SHINE Group Logo" className='navbar-logo-img' />
          <span className="brand-name">SHINE <span className="brand-sub">Group</span></span>
        </Link>
        {/* Desktop Links */}
        <ul className="nav-links">
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/Properties">Marketplace</NavLink></li>
          <li><NavLink to="/Services">Services </NavLink></li>
          <li><NavLink to="/about">About Us</NavLink></li>
        </ul>

        <div className="nav-auth">
          {/* Hamburger Icon for Mobile Toggling */}
          <button className="menu-toggle" onClick={toggleMenu}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button> 
          {/* User Authentication Actions */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', gap: '10px' }}>            
              <button className="login-btn" onClick={() => navigate('/dashboard')} style={{ background: '#f1f5f9', color: '#1e293b' }}>
                <LayoutDashboard size={18} /> Dashboard
              </button>
              <button className="login-btn" onClick={() => { onLogout(); navigate('/'); }} style={{ background: '#fef2f2', color: '#ef4444' }}>
                <LogOut size={18} /> Logout
              </button>
            </div>
          ): (
            <>            
            <button className="login-btn" onClick={() => { setIsOpen(false); navigate('/login'); }}>
              <LogIn size={18} /> Login
            </button>
            <button className="join-btn " onClick={() => navigate('/register')}>
              <UserPlus size={18} /> Join Us
            </button>
            </>
          )}
        </div>
      </div>
      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${isOpen ? 'active' : ''}`}>
        <ul className="mobile-nav-links">
          <li><NavLink to="/" end onClick={toggleMenu}><Home  size={20}/>Home</NavLink></li>
          <li><NavLink to="/Properties" onClick={toggleMenu}><Building2 size={20}/> Marketplace </NavLink></li>
          <li><NavLink to="/Services" onClick={toggleMenu}><List size={20}/>Services </NavLink></li>
          <li><NavLink to="/about" onClick={toggleMenu}><Info size={20}/> About Us</NavLink></li>
          <hr style={{ borderColor: 'rgba(255,255,255,0.1)', width: '80%' }} />
          {isAuthenticated ? (
            <>
            <button className="login-btn " onClick={() =>{ setIsOpen(false); navigate('/dashboard'); }} style={{ width: '100%', background: '#f1f5f9', color: '#1e293b' }}>
              <LogIn size={18} /> Dashboard
            </button>          
            <button className="join-btn" className="login-btn" onClick={() => { setIsOpen(false); onLogout(); navigate('/'); }} style={{ width: '100%', background: '#fef2f2', color: '#ef4444' }}><UserPlus size={18} /> 
              <LogOut size={18} /> Logout
            </button>    
          </>     
          ): (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
              <button className="login-btn" onClick={() => { toggleMenu(); navigate('/login'); }} style={{ width: '80%' }}>
                <LogIn size={18} /> Login
              </button>
              <button className="join-btn" onClick={() => navigate('/register')}><UserPlus size={18} /> 
              Join Us
              </button>
            </div>
          )} 
        </ul>
      </div>
    </nav>
  );
};
export default Navbar;
import React from 'react';
import { Star, MapPin, Clock, ShieldCheck, ArrowRight, MessageSquare } from 'lucide-react';
import './BusinessBanner.css';
import logoImg from '../assets/logo_extracted.png';

const BusinessBanner = ({ data }) => {
  

  const handleScrollToProperties = () => {
    window.scrollTo({ top: 800, behavior: 'smooth' });
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${data.phone.replace('+', '')}?text=I'd like to talk to an expert about Shine Associates properties.`, '_blank');
  };

  return (
    <header className="business-banner">
      {/* Decorative Background Element */}
      <div className="banner-decoration"></div>

      <div className="banner-content">
        <div className="banner-logo-wrapper">
            <img src={logoImg} alt="SHINE Group Logo" className='banner-main-logo' />
        </div>
        {/*Tagline & Name */}
        <p className='banner-tagline'>{data.tagline}         </p>
        <h1 className="banner-title"> {data.name} </h1>

        {/*Property Highlight */}
        <h3><p className="banner-highlight">{data.specializesIn}</p></h3>
        <p className="banner-highlight">     {data.highlight}         </p>
        
        {/* Trust Signals Bar */}
        <div className="trust-bar">
          <span className="trust-item">
            <Star size={18} fill="#fbbf24" /> 
            <strong className="rating-text">
              {data.rating} Rating
            </strong>
          </span>
          <span className="trust-item">
            <ShieldCheck size={18} color="#d4af37" /> 
            {data.yearsInBusiness} Years Excellence
          </span>
          <span className="trust-item">
            <MapPin size={18} /> 
            {data.location}
          </span>
          <span className="trust-item">
            <Clock size={18} /> 
            Opens {data.openTime}
          </span>
        </div>

        {/* Actions Buttons */}
        <div className="banner-actions">
          <button onClick={handleScrollToProperties} className="btn-primary-gold"  >
            View Properties 
            <ArrowRight size={20} />
          </button>
          
          <button  onClick={handleWhatsApp}  className= "btn-secondary-outline" >
            <MessageSquare size={20} /> 
            Talk to Expert
          </button>
        </div>
      </div>
    </header>
  );
};

export default BusinessBanner;
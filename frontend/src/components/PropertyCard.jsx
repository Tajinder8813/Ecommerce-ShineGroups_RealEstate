import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Maximize2, ShieldCheck } from 'lucide-react';
import './PropertyCard.css';


const CATEGORY_IMAGES = {
    "Residential": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000",
    "Commercial": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000",
    "Agricultural": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000",
    "Plot": "https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=1000"
  };


const PropertyCard = ({ property }) => {  
  

  return (
    <div className="property-card">
      <div className="card-image">
        {/* If property.image_url exists use it, otherwise use a default building image */}
        <img 
          src={property.image_url || CATEGORY_IMAGES[property.category] || CATEGORY_IMAGES["Plot"]} 
          alt={property.title} 
          className="property-img-actual"
        />
        <div className="verified-badge">
          <ShieldCheck size={14} /> Verified Listing
        </div>
        <span className="category-tag">{property.category}</span>
      </div>

      <div className="card-content">
        <h3 className="property-title">{property.title}</h3>
        <div className="property-location">
          <MapPin size={16} /> <span>{property.location}</span>
        </div>

        <div className="property-specs">
          <div className="spec-item">
            <Maximize2 size={16} />
            <span>{property.display_size} <span className="unit">{property.size_unit}</span></span>
          </div>
        </div>

        <div className="card-footer">
          <div className="price-box">
            <span className="price-label">Investment</span>
            <span className="price-value">₹{property.price.toLocaleString('en-IN')}</span>
          </div>
          <Link to={`/property/${property.id}`} className="view-btn">View Details</Link>   
                
        </div>
      </div>
      
    </div>
  );
};

export default PropertyCard;
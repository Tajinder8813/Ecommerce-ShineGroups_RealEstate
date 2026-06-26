import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, MapPin, Ruler, Tag } from 'lucide-react';
import './PropertyDetails.css';
import InquiryModal from '../components/InquiryModal';

const CATEGORY_IMAGES = {
  "Residential": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000",
  "Commercial": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000",
  "Agricultural": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000",
  "Plot": "https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=1000"
  };

const PropertyDetails = ({data}) => {
  const { id } = useParams(); // Gets the ID from the URL
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    api.get(`/properties/${id}`)
      .then(res => {
        setProperty(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="loader">Loading Details...</div>;
  if (!property) return <div className="error">Property not found.</div>;

  return (
    <div className="details-page" >
      <button onClick={() => navigate(-1)} className="back-btn">
        <ArrowLeft  /> Back to Listings
      </button>

      <div className="details-container">
         <img className="details-img"
          src={property.image_url || CATEGORY_IMAGES[property.category] || CATEGORY_IMAGES["Plot"]} 
          alt={property.title} 
          style={{ width: '100%', height: '400px', objectFit: 'cover' }}
        />        
        <div className="details-info">
          <h1>{property.title}</h1>
          <p className="details-price">
            {new Intl.NumberFormat('en-IN', 
                {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0
                }).format(property.price)
            }
          </p>
          <div className="details-specs">
             <span><MapPin/> {property.location}</span>
             <span><Ruler /> {property.display_size} {property.size_unit}</span>
          </div>
          <p className="details-desc">{property.description}</p>
          {/* Add a contact button here specifically for this property */}
          <div className="details-actions">
            <button 
                className="btn-primary" 
                onClick={() => window.open(`https://wa.me/${data.phone.replace('+', '')}?text=I'm interested in ${property.title}`, '_blank')}
            >Enquire via WhatsApp
            </button>
            {/* Make sure your Inquiry button triggers the state toggle onClick */}
          <button 
            className="btn-primary" 
            onClick={() => setIsModalOpen(true)}
          >
            Send us an Inquiry
          </button> 
            </div>
        </div>
      </div>
      {/* Render the modal safely overlaying the layout if triggered */}
      {isModalOpen && (
        <InquiryModal 
          property={property} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default PropertyDetails;
import React, { useState } from 'react';
import api from '../api/axios';
import './InquiryModal.css';

const InquiryModal = ({ property, onClose }) => {
  const [formData, setFormData] = useState({
    buyer_name: '',
    buyer_email: '',
    buyer_phone: '',
    message: `Hi, I am interested in "${property.title}" located in ${property.location}. Please get back to me.`
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Prepare payload matching schemas.InquiryCreate
    const payload = {
      ...formData,
      property_id: property.id,
      seller_id: property.owner_id // Links the lead directly to the seller who added it
    };

    api.post('/inquiries/', payload)
      .then(response => {
        setSuccess(true);
        setLoading(false);
      })
      .catch(err => {
        console.error("Inquiry submission error:", err);
        setError("Failed to send inquiry. Please try again later.");
        setLoading(false);
      });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>
        
        {success ? (
          <div className="modal-success-state">
            <div className="success-icon">✓</div>
            <h3>Inquiry Sent Successfully!</h3>
            <p>The Shine Group representative/owner will reach out to you shortly.</p>
            <button className="form-button-search" onClick={onClose}>
              Close Window
            </button>
          </div>
        ) : (
          <>
            <h3>Inquire About Property</h3>
            <p className="modal-property-subtitle">
              📍 {property.title} - {property.location}
            </p>
            
            {error && <p className="modal-error-msg">{error}</p>}

            <form onSubmit={handleSubmit} className="inquiry-form-layout">
              <div className="input-group">
                <label >Full Name</label>
                <input type="text" 
                      name="buyer_name" 
                      value={formData.buyer_name} 
                      onChange={handleChange} required 
                      placeholder="Your Name" 
                />
              </div>

              <div className="input-group">
                <label >Email Address</label>
                <input type="email" 
                name="buyer_email" 
                value={formData.buyer_email}
                onChange={handleChange} required 
                placeholder="name@example.com" 
              />
              </div>

              <div className="input-group">
                <label >Phone Number</label>
                <input type="tel" 
                  name="buyer_phone" 
                  value={formData.buyer_phone} 
                  onChange={handleChange} required 
                  placeholder="Your Mobile Number"  
                />
              </div>

              <div className="input-group">
                <label >Message (Optional)</label>
                <textarea name="message" 
                          value={formData.message} 
                          onChange={handleChange} 
                          rows="4" 
                          className="form-input" 
                          style={{ height: 'auto', resize: 'none' }}
                ></textarea>
              </div>

              <button type="submit" 
                      disabled={loading} 
                      className="form-button-search" 
                      style={{ width: '100%', marginTop: '10px' }}
              >
                {loading ? "Sending Request..." : "Submit Inquiry"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default InquiryModal;
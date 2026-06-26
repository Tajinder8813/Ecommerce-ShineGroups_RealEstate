import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, ArrowLeft, Building2, Phone, Mail, MessageSquare } from 'lucide-react';
import api from '../api/axios';
import Profile from './Profile';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [error, setError] = useState(null);
  const [sellerName, setSellerName] = useState('Partner');
  // Form Modals Management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState(null);

  // Unified Form Fields State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    category: 'Residential',
    display_size: '',
    size_unit: 'marla',
    image_url: ''
  });

  // Fetch individual seller properties catalog listings means 
  // Pull initial records from FastAPI
  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/properties/me');
      const data = response.data;
      setProperties(data);
      setError(null);
    } catch (err) {
        setError(
              err.response?.data?.detail ||
              "Unable to connect to the Shine Associates server."
            );    
      }   
  };
  // Pull live client inquiries from your FastAPI backend /inquiries/me endpoint
  const fetchInquiries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/inquiries/me');
      const data = response.data;
      setInquiries(data);
      }
     catch (err) {
      console.error("Failed to synchronize user inquiries inbox table.", err);
    }
  };

  useEffect(() => {
    const updateSellerName = () => {
      const storedName = localStorage.getItem('username');

      if (storedName && storedName !== 'undefined' && storedName !== 'null') {
        setSellerName(storedName);
      } else {
        setSellerName('Partner');
      }
    };

    window.addEventListener('authChange', updateSellerName);

    return () => {
      window.removeEventListener('authChange', updateSellerName);
    };
  }, []);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Session expired or unauthorized. Please log in.");
      navigate('/login');
      return;
    }
    const storedName = localStorage.getItem('username');
    if (storedName && storedName !== 'undefined' && storedName !== 'null') {
      setSellerName(storedName);
    }else {
      setSellerName('Partner');
    }
    // Joint catalog baseline sync
    const loadDashboardData = async () => {
      setLoading(true);
      await Promise.all([fetchProperties(), fetchInquiries()]);
      setLoading(false);
    };
    loadDashboardData();
  }, [navigate]);   

  // Open empty form for adding new item
  const openAddModal = () => {
    setEditingPropertyId(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      location: '',
      category: 'Residential',
      display_size: '',
      size_unit: 'marla',
      image_url: ''
    });
    setIsFormOpen(true);
  };

  // Open filled form for editing existing item
  const openEditModal = (item) => {
    setEditingPropertyId(item.id);
    setFormData({
      title: item.title,
      description: item.description || '',
      price: item.price,
      location: item.location,
      category: item.category,
      display_size: item.display_size,
      size_unit: item.size_unit,
      image_url: item.image_url || ''
    });
    setIsFormOpen(true);
  };

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Create or Update Submission Handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Fetch the exact security token saved during login
    const token = localStorage.getItem('token');
    // Quick check: If the token disappeared, bounce them out
    if (!token) {
    alert("Your session has expired. Please log in again.");
    navigate('/login');
    return;
    }
    // Prepare values matching schema types
    const payload = {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      location: formData.location,
      category: formData.category,
      display_size: parseFloat(formData.display_size),
      size_unit: formData.size_unit,
      image_url: formData.image_url || null // Set to null for empty string image_url for future
    };

    try {
      //  Make the API Call with security headers attached
        if (editingPropertyId) {
          await api.put(`/properties/${editingPropertyId}`, payload);
          alert("Listing updated successfully!");
        } else {
          await api.post('/properties/', payload);
          alert("New listing added to database!");
        }
        setIsFormOpen(false);
        setActiveTab('listings');// Automatically open listings tab to see changes
        fetchProperties(); // Refresh current catalog view
      } 
    catch (err) {
        alert(
          err.response?.data?.detail ||
          "Network link dropped during data sync operation."
        );
    }
  };

  // Delete Handler
  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm("Remove this property listing from the Shine Group database permanently?")) 
      return;
    try {
      await api.delete(`/properties/${propertyId}`);

      alert("Listing deleted successfully!");

      setProperties(
        properties.filter(p => p.id !== propertyId)
      );
    } catch (err) {
        alert(
          err.response?.data?.detail ||
          "Server link lost."
        );
    }
  };

  if (loading && properties.length === 0) {
    return (
              <div className="dashboard-loading">
                <h3>Synchronizing records...</h3>
              </div>
            );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header-panel">
        <div>
          <h1 className="main-title">Seller's Workspace</h1>
          <p className="sub-title">
            Manage your SHINE Group real estate catalog and incoming leads.
          </p>
        </div>
        {/* Seller Information Avatar Badge */}
        <div className="dashboard-user-profile-badge" >
          <div className="seller-meta-container" >
            <div className='user-icon-div' >
              <User size={16} color="white" />
            </div>
            <span className='user-name' >{sellerName}</span>
          </div>
          
          <button onClick={() => { onLogout(); navigate('/'); }} className="btn-logout" >
            <LogOut size={16} /> Exit Workspace
          </button>
        </div>
      </div>

      {error && <div className="error-banner">⚠️ {error}</div>}
      {/*CONDITIONAL VIEW RENDERING: Form View Page vs Dashboard Main View */}
      {/* Input Form Component Modal */}
      {isFormOpen ? (        
        <div className="modal-box">
          <button onClick={() => setIsFormOpen(false)} className="btn-back-dashboard" >
              <ArrowLeft size={20} className='arrow-back'/> 
              Back to Dashboard
          </button>
          <h2>
            <Building2 size={22} color="var(--green)" />
            {editingPropertyId ? '✏️ Edit Property Record' : '🏢 Add New Property Listing'}
          </h2>
          <form onSubmit={handleFormSubmit} className="modal-form">              
            <div className="form-field">
              <label>Property Title</label>
              <input type="text" 
                     name="title" 
                     value={formData.title} 
                     onChange={handleInputChange} 
                     placeholder="e.g., 3 Kanal Plot near Model Town" required 
              />
            </div>
            <div className="form-row-double">
              <div className="form-field">
                <label>Category Type</label>
                <select name="category" 
                        value={formData.category} 
                        onChange={handleInputChange}
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Agricultural">Agricultural</option>
                  <option value="Plot">Plot</option>
                </select>
              </div>
              <div className="form-field">
                <label>Price (INR)</label>
                <input type="number" 
                      name="price" 
                      value={formData.price} 
                      onChange={handleInputChange} 
                      placeholder="e.g., 4500000" required 
                />
              </div>
            </div>
            <div className="form-row-triple">
              <div className="form-field">
                <label>Size Value</label>
                <input type="number" 
                        step="any" 
                        name="display_size" 
                        value={formData.display_size} 
                        onChange={handleInputChange} 
                        placeholder="e.g., 3" required 
                />
              </div>
              <div className="form-field">
                <label>Unit</label>
                <select name="size_unit" 
                        value={formData.size_unit} 
                        onChange={handleInputChange}
                >
                  <option value="marla">marla</option>
                  <option value="kanal">kanal</option>
                  <option value="killa">killa</option>
                  <option value="sqft">sqft</option>
                </select>
              </div>
              <div className="form-field">
                <label>Location Town/City</label>
                <input type="text" 
                       name="location" 
                       value={formData.location} 
                       onChange={handleInputChange} 
                       placeholder="e.g., Phagwara" required 
                />
              </div>
            </div>
            {/*
            <div className="form-field">
              <label>Image URL Path</label>
              <input type="text" 
                     name="image_url" 
                     value={formData.image_url} 
                     onChange={handleInputChange} 
                     placeholder="Leave blank or add direct link" 
              />
            </div>
            */}
            <div className="form-field">
              <label>Detailed Project Description</label>
              <textarea name="description" 
                        value={formData.description} 
                        onChange={handleInputChange} 
                        rows="3" 
                        placeholder="Provide extra property specifications..."
              ></textarea>
            </div>
            <div className="modal-buttons-row">
              <button type="button" 
                      onClick={() => setIsFormOpen(false)} 
                      className="btn-cancel-modal"
              >
                Cancel
              </button>
              <button type="submit" className="btn-save-modal">
                Save Properties
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {/* Navigation Tabs bar */}
          <div className="dashboard-tabs-bar">
            {['overview', 'listings', 'leads', 'profile'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-link ${activeTab === tab ? 'active' : ''}`}
              >                
              {tab === 'leads' ? `leads (${inquiries.length})` : tab}
              </button>
            ))}
          </div>
          {/* View Panels */}

          <div className="dashboard-view-content">
            {activeTab === 'overview' && (
              <div className="tab-pane-animate">
                <div className="overview-grid">
                  <div className="overview-card accent-green-top">
                    <h4>Total Active Listings</h4>
                    <p className="overview-value">
                      {String(properties.length).padStart(2, '0')}
                    </p>
                  </div>
                  <div className="overview-card accent-green-top">
                    <h4>Customer Inquiries</h4>
                    <p className="overview-value">
                      {String(inquiries.length).padStart(2, '0')}
                    </p>
                  </div>
                  <div className="overview-card accent-grey-top">
                    <h4>Years of Excellence</h4>
                    <p className="overview-value">16</p>
                  </div>
                </div>

                <div className="actions-panel">
                  <h3>Quick Actions</h3>
                  <div className="actions-btn-group">
                    <button onClick={openAddModal} className="btn-primary-action">
                      + Add New Property Listing
                    </button>
                    <button onClick={() => setActiveTab('listings')} 
                            className="btn-secondary-action"
                    >
                      Manage Complete Catalog
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'listings' && (
              <div className="tab-pane-animate template-card">
                <div className="card-header-row">
                  <h3>Your Active Real Estate Catalog</h3>
                  <button onClick={openAddModal} className="btn-add-inline">
                    + Add New Property
                  </button>
                </div>
                
                {properties.length === 0 ? (
                <p className="placeholder-text">
                  No active properties found in your database table.
                </p>
                ) : (
                  <div className="listings-vertical-stack">
                    {properties.map((item) => (
                      <div key={item.id} className="dashboard-property-row">
                        <div className="property-row-info">
                          <strong className="property-row-title">{item.title}</strong>
                          <div className="property-row-meta">
                            📍 {item.location} | 
                            🏷️ {item.category} | 
                            📐 {item.display_size} {item.size_unit} ({item.size_sqft} SqFt)
                          </div>
                          <div className="property-row-price">
                            ₹{item.price?.toLocaleString('en-IN') || '0'} 
                          </div>
                        </div>
                        <div className="property-row-actions">
                          <button onClick={() => openEditModal(item)} 
                                  className="btn-edit"
                          >
                            Edit
                          </button>
                          <button onClick={() => handleDeleteProperty(item.id)} 
                                  className="btn-delete">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'leads' && (
              <div className="tab-pane-animate template-card">
                <h3>Recent Client Contact Requests</h3>
                {inquiries.length === 0 ? (
                  <p className="placeholder-text" >
                    Your server database is operating successfully. 
                    Since no customer lead tables exist in your models yet, 
                    this section remains in mock mode.
                  </p>
                ) : (
                  <div className="listings-vertical-stack" >
                    {inquiries.map((lead) => (
                      <div key={lead.id} className="dashboard-property-row" >
                        <div className="property-row-info">
                          <strong className="property-row-title" >
                            {lead.buyer_name}
                          </strong>
                          <div  className="lead-contact-row">
                            <span className='lead-contact-item' >
                              <Mail size={14} /> {lead.buyer_email}
                            </span>
                            <span className='lead-contact-item'>
                              <Phone size={14} /> {lead.buyer_phone}
                            </span>
                          </div>
                          {lead.message && (
                            <div  className='lead-message-row' >
                              <MessageSquare size={20} className='lead-message-icon' />
                              <span className='lead-message-item'>"{lead.message}"</span>
                            </div>
                          )}
                          <div className='lead-footer-row' >
                            Received: {new Date(lead.created_at).toLocaleString('en-IN')} | 
                            Property ID: #{lead.property_id}
                          </div>
                        </div>
                        <div className="property-row-actions">
                          <a href={`tel:${lead.buyer_phone}`} 
                             className="btn-edit " 
                          >
                            Call Client
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'profile' && (
              <div className="tab-pane-animate template-card">
                <Profile />
              </div>
            )}
          </div>
        </>        
        )}
    </div>
  );
};

export default Dashboard;


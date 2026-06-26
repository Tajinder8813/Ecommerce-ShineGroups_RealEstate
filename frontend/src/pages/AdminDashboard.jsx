import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  LayoutDashboard, Building2, MessageSquare, Users, 
  LogOut, Plus, Trash2, Edit3, X, User
} from 'lucide-react';
import Profile from './Profile';
import './AdminDashboard.css';

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- LIVE DATABASES CORE STATES ---
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  // --- FORM STRUCTURAL STATE (ALIGNED TO YOUR PYDANTIC SCHEMA) ---
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '',
    location: '', 
    price: '', 
    category: 'Residential', // Maps to CategoryEnum ("Residential", "Commercial", etc.)
    display_size: '',        // Maps to PropertyBase float field
    size_unit: 'marla',      // Maps to UnitEnum ("sqft", "marla", etc.)
    image_url: ''
  });

  // --- REFRESH DATA FROM FASTAPI & MYSQL ---
  const fetchSystemData = async () => {
    setLoading(true);
    try {
      const [propsRes, usersRes, inquiriesRes] = await Promise.all([
        api.get('/properties/'),
        api.get('/admin/users'),
        api.get('/admin/inquiries')
      ]);

      setProperties(propsRes.data);
      setUsers(usersRes.data);
      setInquiries(inquiriesRes.data);
    } catch (err) {
      console.error("Administrative Sync Failure:", err.response?.data || err);
      alert("Failed to pull system data from core database tables.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemData();
  }, []);

  // --- MODAL DISPATCH HANDLERS ---
  const handleOpenAddModal = () => {
    setEditingProperty(null);
    setFormData({ 
      title: '', 
      description: '',
      location: '', 
      price: '', 
      category: 'Residential', 
      display_size: '', 
      size_unit: 'marla',
      image_url: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (property) => {
    setEditingProperty(property);
    setFormData({ 
      title: property.title, 
      description: property.description || '',
      location: property.location, 
      price: property.price, 
      category: property.category, 
      display_size: property.display_size, 
      size_unit: property.size_unit,
      image_url: property.image_url || ''
    });
    setIsModalOpen(true);
  };

  // --- ACTIONS SYSTEM OVERRIDES ---
  const handleDeleteProperty = async (id) => {
    if (window.confirm("Are you sure you want to completely delete this listing from the database?")) {
      try {
        await api.delete(`/admin/properties/${id}`);
        setProperties(properties.filter(p => p.id !== id));
      } catch (err) {
        alert("Server rejected property erasure override.");
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Purge this user profile context permanently? This cannot be undone.")) {
      try {
        await api.delete(`/admin/users/${id}`);
        setUsers(users.filter(u => u.id !== id));
      } catch (err) {
        alert(err.response?.data?.detail || "Could not eliminate user row reference.");
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Matches PropertyCreate schema specifications
      const payload = {
        title: formData.title,
        description: formData.description || null,
        price: parseFloat(formData.price),
        location: formData.location,
        category: formData.category,               
        display_size: parseFloat(formData.display_size), 
        size_unit: formData.size_unit,             
        image_url: formData.image_url || null
      };

      if (editingProperty) {
        const res = await api.put(`/properties/${editingProperty.id}`, payload);
        setProperties(properties.map(p => p.id === editingProperty.id ? res.data : p));
      } else {
        const res = await api.post('/properties/', payload);
        setProperties([...properties, res.data]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Pydantic Validation Error Details:", err.response?.data);
      alert("Validation rejected form structure. Check browser logs.");
    }
  };

  // Dynamically extract user subsets based on the 'role' column inside MySQL
  const sellerProfiles = users.filter(u => u.role === 'seller');

  const getSellerName = (property) => {
    const targetOwnerId = property.owner_id;
    if (!targetOwnerId) 
      return "System / Unassigned";
    const matchedSeller = users.find(u => String(u.id) === String(targetOwnerId));
    return matchedSeller ? matchedSeller.full_name : `Owner ID: ${targetOwnerId}`;
    
  };

  if (loading) {
    return <div className="admin-loading-screen">Synchronizing data tables with MySQL Core Engine...</div>;
  }

  return (
    <div className="admin-dashboard-layout">
      {/* TOP STRIP NAVIGATION NAVBAR */}
      <header className="admin-top-navbar">
        <div className="admin-brand">
          <span className="brand-name">
            SHINE 
            <span className="brand-sub">
              Group Admin
            </span>
          </span>
        </div>
        <div className="admin-user-profile">
          <span className="welcome-tag">
            Welcome, <strong>Admin</strong>
          </span>
          <button className="admin-logout-btn" onClick={onLogout}>
            <LogOut size={16} /> 
            Logout
          </button>
        </div>
      </header>

      <div className="admin-body-container">
        {/* LEFT SIDEBAR BAR CONTROL SYSTEM */}
        <aside className="admin-sidebar">
          <ul className="sidebar-links-wrapper">
            <li>
              <button className={`side-btn ${activeTab === 'overview' ? 'active' : ''}`} 
                      onClick={() => setActiveTab('overview')}
              >
                <LayoutDashboard size={18} /> 
                Overview Dashboard
              </button>
            </li>
            <li>
              <button className={`side-btn ${activeTab === 'properties' ? 'active' : ''}`} 
                      onClick={() => setActiveTab('properties')}
              >
                <Building2 size={18} /> 
                Properties List ({properties.length})
              </button>
            </li>
            <li>
              <button className={`side-btn ${activeTab === 'inquiries' ? 'active' : ''}`} 
                      onClick={() => setActiveTab('inquiries')}
              >
                <MessageSquare size={18} /> 
                Inquiries ({inquiries.length})
              </button>
            </li>
            <li>
              <button className={`side-btn ${activeTab === 'sellers' ? 'active' : ''}`} 
                      onClick={() => setActiveTab('sellers')}
              >
                <Users size={18} /> 
                System Users
              </button>
            </li>
            <li>
              <button className={`side-btn ${activeTab === 'profile' ? 'active' : ''}`} 
                      onClick={() => setActiveTab('profile')}
              >
                <User size={18} /> 
                My Profile Settings
              </button>
            </li>
          </ul>
        </aside>

        {/* DISPLAY FRAMEWORK WORKSPACE */}
        <main className="admin-main-workspace">
          
          {/* TAB 1: METRICS OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="workspace-view">
              <h2>Operational Overview</h2>
              <div className="stats-metric-row">
                <div className="metric-card">
                  <div className="m-icon">
                    <Building2 color="var(--accent-green)"/>
                  </div>
                  <div>
                    <h3>{properties.length}</h3>
                    <p>Total Listings</p>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="m-icon">
                    <MessageSquare color="#3b82f6"/>
                  </div>
                  <div>
                    <h3>{inquiries.length}</h3>
                    <p>Active Leads</p>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="m-icon">
                    <Users color="#eab308"/>
                  </div>
                  <div>
                    <h3>{sellerProfiles.length}</h3>
                    <p>Registered Sellers</p>
                    </div>
                  </div>
              </div>
            </div>
          )}
          {/* TAB 2: PROPERTIES MANAGEMENT */}
          {activeTab === 'properties' && (
            <div className="workspace-view">
              <div className="workspace-header-actions">
                <h2>Properties Directory</h2>
                <button className="btn-add-action" 
                        onClick={handleOpenAddModal}
                >
                  <Plus size={16} /> 
                  Add New Listing
                </button>
              </div>

              <div className="table-responsive-container">
                <table className="admin-data-table">
                  <thead>
                    <tr><th>Asset/Title</th>
                        <th>Seller Identity</th>
                        <th>Location</th>
                        <th>Sizing Field</th>
                        <th>Price (INR)</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map(p => (
                      <tr key={p.id}>
                        <td><strong>{p.title}</strong></td>
                        <td >{getSellerName(p)}</td>
                        <td>{p.location}</td>
                        <td>{p.display_size} 
                          <span className="text-muted">{p.size_unit}</span>
                        </td>
                        <td>₹{p.price?.toLocaleString('en-IN')}</td>
                        <td>
                          <span className={`badge-pill ${p.category?.toLowerCase()}`}>
                            {p.category}
                          </span>
                        </td>
                        <td>
                          <div className="action-button-group">
                            <button className="action-icon-btn edit" 
                                onClick={() => handleOpenEditModal(p)}
                            >
                              <Edit3 size={14}/>
                            </button>
                            <button className="action-icon-btn delete" 
                                    onClick={() => handleDeleteProperty(p.id)}
                            >
                              <Trash2 size={14}/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: INQUIRIES ALIGNED WITH INQUIRYOUT SCHEMA */}
          {activeTab === 'inquiries' && (
            <div className="workspace-view">
              <h2>Incoming Property Inquiries</h2>
              <div className="table-responsive-container">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Client Name</th>
                      <th>Email Address</th>
                      <th>Contact Number</th>
                      <th>Message Brief</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map(i => (
                      <tr key={i.id}>
                        <td><strong>{i.buyer_name}</strong></td>
                        <td>{i.buyer_email}</td>
                        <td>{i.buyer_phone}</td>
                        <td><p className="truncated-table-text">
                              {i.message || "No text written."}
                            </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: SYSTEM USER ACCOUNTS PROFILES */}
          {activeTab === 'sellers' && (
            <div className="workspace-view">
              <h2>Registered Authorization Accounts Console</h2>
              <div className="table-responsive-container">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>User Full Name</th>
                      <th>Email Address</th>
                      <th>Privilege Status Role</th>
                      <th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td><strong>{u.full_name}</strong></td>
                        <td>{u.email}</td>
                        <td><span className={`status-pill ${u.role}`}>
                                {u.role}
                            </span>
                        </td>
                        <td>
                          <button 
                            className="action-icon-btn delete" 
                            disabled={u.role === 'admin'}
                            onClick={() => handleDeleteUser(u.id)}
                          >
                            <Trash2 size={14}/>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* TAB 5: PROFILE PANEL VIEW (MATCHES DASHBOARD STRUCTURE) */}
          {activeTab === 'profile' && (
            <div className="workspace-view ">
              <Profile />
            </div>
          )}
        </main>
      </div>

      {/* DYNAMIC MODAL BOX INPUT WINDOW */}
      {isModalOpen && (
        <div className="modal-overlay-backdrop">
          <div className="modal-form-window">
            <div className="modal-header">
              <h3>{editingProperty ? 'Modify Property Record' : 'Publish New Asset Listing'}</h3>
              <button className="close-modal-btn" 
                      onClick={() => setIsModalOpen(false)}
              >
                <X size={20}/>
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="modal-inputs-form">
              <div className="input-field-group">
                <label>Property Name / Asset Title</label>
                <input type="text" 
                        value={formData.title} required 
                        onChange={e => setFormData({...formData, title: e.target.value})} 
                        placeholder="e.g. Luxury Penthouse Suite" 
                />
              </div>
              <div className="input-field-group">
                <label>Description (Optional)</label>
                <input type="text" 
                      value={formData.description} 
                      onChange={e => setFormData({...formData, description: e.target.value})} 
                      placeholder="Key details about the property..." 
                />
              </div>
              <div className="input-field-group">
                <label>Exact Location Structure</label>
                <input type="text" 
                        value={formData.location} required 
                        onChange={e => setFormData({...formData, location: e.target.value})} 
                        placeholder="e.g. Urban Estate, Phase 2" 
                />
              </div>

              <div className="form-row-split">
                <div className="input-field-group">
                  <label>Price (INR Amount)</label>
                  <input type="number" 
                         value={formData.price} required 
                         onChange={e => setFormData({...formData, price: e.target.value})} 
                         placeholder="e.g. 7500000" 
                  />
                </div>
                <div className="input-field-group">
                  <label>Sector Category Classification</label>
                  <select value={formData.category} 
                          onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Agricultural">Agricultural</option>
                    <option value="Plot">Plot</option>
                  </select>
                </div>
              </div>

              <div className="form-row-split">
                <div className="input-field-group">
                  <label>Display Size Value</label>
                  <input type="number" 
                          step="any" 
                          value={formData.display_size} required 
                          onChange={e => setFormData({...formData, display_size: e.target.value})} 
                          placeholder="e.g. 5, 10, 1500" 
                  />
                </div>
                <div className="input-field-group">
                  <label>Dimension Unit</label>
                  <select value={formData.size_unit} 
                          onChange={e => setFormData({...formData, size_unit: e.target.value})}
                  >
                    <option value="marla">Marla</option>
                    <option value="sqft">SqFt</option>
                    <option value="kanal">Kanal</option>
                    <option value="killa">Killa</option>
                  </select>
                </div>
              </div>
              {/*
              <div className="input-field-group">
                <label>Image URL (Optional)</label>
                <input type="text" 
                        value={formData.image_url} 
                        onChange={e => setFormData({...formData, image_url: e.target.value})} 
                        placeholder="https://example.com/image.jpg" 
                />
              </div>
              */}
              <button 
                type="submit" 
                className="form-submit-btn-accent"
              >
                  Save Changes / Commit Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

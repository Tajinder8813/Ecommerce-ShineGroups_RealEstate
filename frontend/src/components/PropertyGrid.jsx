import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import PropertyCard from './PropertyCard';
import './PropertyGrid.css';

const PropertyGrid = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  // Filter State Setup
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    min_price: '',
    max_price: '',
    unit: 'marla', // Default to Punjab standard
    min_size: '',
    max_size: ''
  });
  // Fetch initial unfiltered properties on page load
  useEffect(() => {
    fetchGlobalProperties();
  }, []);
  const fetchGlobalProperties = () => {
    setLoading(true);
    api.get('/properties/')
      .then(response => {
        setProperties(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching properties:", error);
        setLoading(false);
      });
  };
  // Filter input change handler
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  // Axios request targeting your backend search endpoint
  const handleApplyFilters = (e) => {
    e.preventDefault();
    setLoading(true);
    // Build query params dynamically (removes empty fields so backend doesn't break)
    const queryParams = {};
    if (filters.category) queryParams.category = filters.category;
    if (filters.location) queryParams.location = filters.location;
    if (filters.min_price) queryParams.min_price = filters.min_price;
    if (filters.max_price) queryParams.max_price = filters.max_price;
    if (filters.unit) queryParams.unit = filters.unit;
    if (filters.min_size) queryParams.min_size = filters.min_size;
    if (filters.max_size) queryParams.max_size = filters.max_size;
    api.get('/properties/search', { params: queryParams })
      .then(response => {
        setProperties(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Filter request failed:", error);
        setLoading(false);
      });
  };
  // Reset Filters button handler
  const handleResetFilters = () => {
    setFilters({
      category: '',
      location: '',
      min_price: '',
      max_price: '',
      unit: 'marla',
      min_size: '',
      max_size: ''
    });
    fetchGlobalProperties();
  };
  
  if (loading) {
    return (
    <div className="loading-state">
      <p>Searching for Shine Group properties...</p>
    </div>
    );
  }
  return (
    <section className="property-section">
      <div className="section-header">
        <h2>Latest Listings</h2>
        <p>Premium properties curated by Shine Group</p>
      </div>

      {/* 5. Clean, Scannable Filter UI Component */}
      <form onSubmit={handleApplyFilters} className="property-filter-form" >
        <div >
          <label className="form-label" >Location</label>
          <input className="form-input" type="text" name="location" value={filters.location} onChange={handleFilterChange} placeholder="e.g. Phagwara" />
        </div>
        
        <div>
          <label className="form-label">Category</label>
          <select name="category" value={filters.category} onChange={handleFilterChange} className="form-select">
            <option value="">All Types</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
            <option value="Plot">Plot</option>
          </select>
        </div>

        <div>
          <label className="form-label">Min Price (₹)</label>
            <select name="min_price" value={filters.min_price} onChange={handleFilterChange} className="form-select">
              <option value="">No Min</option>
              <option value="500000">₹5 Lakh</option>
              <option value="1000000">₹10 Lakh</option>
              <option value="2000000">₹20 Lakh</option>
              <option value="5000000">₹50 Lakh</option>
              <option value="10000000">₹1 Crore</option>
            </select>        
        </div>

        <div>
          <label className="form-label">Max Price (₹)</label>
          <select name="max_price" value={filters.max_price} onChange={handleFilterChange} className="form-select">
            <option value="">No Max</option>
            <option value="1000000">₹10 Lakh</option>
            <option value="2000000">₹20 Lakh</option>
            <option value="5000000">₹50 Lakh</option>
            <option value="10000000">₹1 Crore</option>
            <option value="20000000">₹2 Crore</option>
            <option value="50000000">₹5 Crore</option>
          </select>          
        </div>

        <div>
          <label className="form-label">Unit Type</label>
          <select name="unit" value={filters.unit} onChange={handleFilterChange} className="form-select">
            <option value="sqft">SqFt</option>
            <option value="marla">Marla</option>
            <option value="kanal">Kanal</option>
            <option value="killa">Killa</option>
            
          </select>
        </div>

        <div>
          <label className="form-label">Min Size</label>
          <input className="form-input " type="number" name="min_size" value={filters.min_size} onChange={handleFilterChange} placeholder="Min Size" />
        </div>

        {/* Action Button Row */}
        <div className="form-actions" >
          <button className="form-button-search" type="submit" >
            Search
          </button>
          
          <button className="form-button-reset" type="button" onClick={handleResetFilters} >
            Reset
          </button>
        </div>
      </form>

      {/* Grid rendering section */}
      {loading ? (
        <div className="loading-state">
          <p>Searching for Shine Group properties...</p>
        </div>
      ) : (
        <div className="property-grid">
          {properties.length > 0 ? (
            properties.map(item => (
              <PropertyCard key={item.id} property={item} />
            ))
          ) : (
            <p className="no-data">No properties found matching your selection.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default PropertyGrid;
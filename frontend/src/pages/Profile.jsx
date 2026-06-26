import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Phone } from 'lucide-react';
import api from '../api/axios';
import ForgotPassword from './ForgotPassword';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [mobNumber, setMobNumber] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Session expired. Please login again.');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/users/me');

        const data = response.data;

        setProfileData(data);
        setFullName(data.full_name || '');
        setMobNumber(data.mob_number || '');
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          localStorage.removeItem('role');

          window.location.href = '/login';
        } else {
          setError('Failed to fetch profile details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');
    setSaving(true);


    try {
      const response = await api.put('/users/profile', {
        full_name: fullName,
        mob_number: mobNumber
      });

      const data = response.data;

      setProfileData(data);
      setEditMode(false);

      setMessage('Profile updated successfully!');

      localStorage.setItem('username', data.full_name);

      window.dispatchEvent(new Event('authChange'));
    } catch (err) {
      if (
        err.response &&
        err.response.data &&
        Array.isArray(err.response.data.detail)
      ) {
        setError(err.response.data.detail[0].msg);
      } else {
        setError(
          err.response?.data?.detail ||
          'Could not update profile.'
        );
      }
    }finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        Loading profile details...
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>User Account Profile</h2>
        <p>Manage your personal information.</p>
      </div>

      {message && (
        <div className="profile-alert success">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="profile-alert error">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleUpdateProfile} className="profile-form">
        
        {/* =========================================================
            CONDITIONAL FORM LAYOUT (Based on editMode)
           ========================================================= */}
        {editMode ? (
          /* --- EDITING STATE --- */
          <>
            <div>
              <div className="profile-row">
                <User size={22} className="profile-icon" />
                <div className="profile-info">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="profile-row">
                <Phone size={22} className="profile-icon" />
                <div className="profile-info">
                  <label>Mobile Number</label>
                  <input
                    type="text"
                    value={mobNumber}
                    onChange={(e) =>
                      setMobNumber(e.target.value.replace(/[^\d+]/g, ''))
                    }
                    required
                  />
                </div>
              </div>
            </div>

            <div className="profile-buttons">
              <button
                type="submit"
                className="btn-profile-save"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>

              <button
                type="button"
                className="btn-profile-cancel"
                onClick={() => {
                  setEditMode(false);
                  setFullName(profileData?.full_name || '');
                  setMobNumber(profileData?.mob_number || '');
                }}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          /* --- VIEWING STATE --- */
          <>
            <div>
              <div className="profile-row">
                <User size={22} className="profile-icon" />
                <div className="profile-info">
                  <label>Full Name</label>
                  <strong>{profileData?.full_name}</strong>
                </div>
              </div>

              <div className="profile-row">
                <Phone size={22} className="profile-icon" />
                <div className="profile-info">
                  <label>Mobile Number</label>
                  <strong>{profileData?.mob_number}</strong>
                </div>
              </div>
            </div>
            
          </>
        )}

        {/* =========================================================
            PERMANENTLY READ-ONLY FIELDS (Always visible)
           ========================================================= */}
        <div>
          <div className="profile-row">
            <Mail size={22} className="profile-icon" />
            <div className="profile-info">
              <label>Email Address</label>
              <strong>{profileData?.email}</strong>
            </div>
          </div>

          <div className="profile-row">
            <Shield size={22} className="profile-icon" />
            <div className="profile-info">
              <label>Role</label>
              <span
                className={`role-badge ${
                  profileData?.role === 'admin' ? 'admin' : 'seller'
                }`}
              >
                {profileData?.role}
              </span>
            </div>
          </div>
        </div>
      </form>
      <div className="profile-actions">
        <button
          type="button"
          className="btn-profile-edit"
          onClick={() => setEditMode(true)}
         >
          Edit Profile
        </button>
        <button
          type="button"
          onClick={() => navigate('/forgot-password', { state: { prefilledEmail: profileData?.email } })}
          className="btn-password-edit"
        >
          Change Password
        </button>
      </div>
    </div>
  
  );
};

export default Profile;
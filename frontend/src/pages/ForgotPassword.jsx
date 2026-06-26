import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { getPasswordRules, checkPasswordStrength, sanitizePin } from '../utils/formValidation';
import './ForgotPassword.css'; 

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Unified state layout identical to register.jsx architecture
  const [formData, setFormData] = useState({
    email: '',
    security_pin: '',
    newPassword: '',
    confirmPassword: ''
  });
  useEffect(() => {
    if (location.state?.prefilledEmail) {
      setFormData(prev => ({
        ...prev,
        email: location.state.prefilledEmail
      }));
    }
  }, [location.state]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  //  the shared validation logic
  const passwordRules = getPasswordRules(formData.newPassword);
  const isPasswordStrong = checkPasswordStrength(formData.newPassword);
  const doPasswordsMatch = formData.newPassword === formData.confirmPassword;
  const isPinValid = formData.security_pin.length === 4;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'security_pin' ? sanitizePin(value) : value 
    }));
  };
  
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!isPinValid || !isPasswordStrong || !doPasswordsMatch) 
      return;
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const payload = {
        email: formData.email,
        security_pin: formData.security_pin,
        new_password: formData.newPassword
        };

      const response = await api.put('/forgot-password', payload);
      setMessage( "Password reset successful! Preparing redirection..."  );

      setFormData({
        email: '',
        security_pin: '',
        newPassword: '',
        confirmPassword: ''
      });

      setTimeout(() => {  
        alert("Your security credentials have been updated successfully! Clicking OK will take you back to the log-in panel.");
        navigate('/login'); }, 1000);
      
    } catch(err) {
         setError(
           err.response?.data?.detail ||
           "Cannot communicate with backend authentication service."
         );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="register-title">Reset Password</h1>
        <p className="register-subtitle">Provide your registered credentials to update your platform key.</p>

        {message && <div className="alert-banner success">✓ {message}</div>}
        {error && <div className="alert-banner error">⚠️ {error}</div>}

        <form onSubmit={handleResetSubmit} className="register-form">
          <div className="register-field">
            <label>Corporate Email</label>
            <input 
              type="email" 
              name='email'
              value={formData.email}
              onChange={handleInputChange} 
              placeholder="name@example.com" 
              required 
            />
          </div>

          <div className="register-field">
            <label>4-Digit Security PIN</label>
            <input 
              type="text" 
              name="security_pin"
              maxLength="4"
              pattern="\d*"
              value={formData.security_pin} 
              onChange={handleInputChange} 
              placeholder="e.g., 1234" 
              required 
            />
          </div>

          <div className="register-field">
            <label>New Strong Password</label>
            <input 
              type="password" 
              name="newPassword"
              value={formData.newPassword} 
              onChange={handleInputChange} 
              placeholder="••••••••" 
              required 
            />
          </div>
          <div className="register-field" >
            <label>Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword} 
              onChange={handleInputChange} 
              placeholder="••••••••" 
              required 
            />
          </div>
              {/* Real-time Validation Checkboxes Checklist */}
          {formData.newPassword && (
            <div className="password-validator-box">
              <p className={passwordRules.minLength ? 'valid' : 'invalid'}>
                {passwordRules.minLength ? '✓' : '✕'} At least 8 characters long
              </p>
              <p className={passwordRules.hasUpper ? 'valid' : 'invalid'}>
                {passwordRules.hasUpper ? '✓' : '✕'} One uppercase letter (A-Z)
              </p>
              <p className={passwordRules.hasLower ? 'valid' : 'invalid'}>
                {passwordRules.hasLower ? '✓' : '✕'} One lowercase letter (a-z)
              </p>
              <p className={passwordRules.hasNumber ? 'valid' : 'invalid'}>
                {passwordRules.hasNumber ? '✓' : '✕'} One number value (0-9)
              </p>
              <p className={passwordRules.hasSpecial ? 'valid' : 'invalid'}>
                {passwordRules.hasSpecial ? '✓' : '✕'} One special character (@$!%*?&)
              </p>
            </div>
          )}
          {/* Match Notification String */}
          {formData.confirmPassword && (
            <p className={`confirm-password ${doPasswordsMatch ? 'match' : 'no-match'}`}>
              {doPasswordsMatch ? '✓ Passwords match' : '✕ Passwords do not match'}
            </p>
          )}
          <div className='forgot-password-actions'>
            <button 
              type="submit" 
              className="btn-password-submit"               
              disabled={loading || !isPasswordStrong || !doPasswordsMatch || !isPinValid}>
              {loading ? "Updating Account..." : "Update Security Key"}
            </button>
            
          </div>
        </form>
        <button 
              type="button" 
              className="btn-password-cancel" 
              onClick={() => navigate(-1)}            
            >
              Cancel
            </button>
        <p className="register-footer-text">
          Remembered it? <Link to="/login" className="register-link">Back to Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
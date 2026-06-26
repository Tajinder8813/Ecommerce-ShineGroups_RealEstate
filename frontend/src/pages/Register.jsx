import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { getPasswordRules, checkPasswordStrength, sanitizePin } from '../utils/formValidation';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    mob_number: '',
    security_pin: '',
    password: '',
    confirmPassword: '',
    role: 'seller' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

//  PASSWORD & PIN VALIDATION CRITERIA 
  const passwordRules = getPasswordRules(formData.password);
  const isPasswordStrong = checkPasswordStrength(formData.password);
  const doPasswordsMatch = formData.password === formData.confirmPassword;
  const isPinValid = formData.security_pin.length === 4; 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'security_pin' ? sanitizePin(value) : value 
    }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    // Front-end Guardrails
    if (!isPinValid) {
      setError("Security PIN must be exactly 4 digits long.");
      return;
    }

    if (!isPasswordStrong) {
      setError("Please ensure your password satisfies all security requirements.");
      return;
    }

    if (!doPasswordsMatch) {
      setError("Passwords do not match!");
      return;
    }

    // Prepare payload exactly matching schemas.UserCreate in FastAPI
    const payload = {
      email: formData.email,
      full_name: formData.full_name,
      mob_number: formData.mob_number,
      security_pin: formData.security_pin,
      password: formData.password,
      role: formData.role
    };

    try 
    {
      setLoading(true)
      const response = await api.post('/register', payload);      
      alert("Registration Successful! Welcome to Shine Associates. Please log in.");
      navigate('/login');      
    } catch (err) 
    {
        setError(
          err.response?.data?.detail ||
          "Registration failed."
        );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="register-title">Join Us</h1>
        <p className="register-subtitle">Create an account to list your properties with SHINE Group.</p>

        {error && <div className="register-error-banner">⚠️ {error}</div>}

        <form onSubmit={handleRegisterSubmit} className="register-form">
          <div className="register-field">
            <label>Full Name</label>
            <input 
              type="text" 
              name="full_name" 
              value={formData.full_name} 
              onChange={handleInputChange} 
              placeholder="e.g., Sukhvinder Singh" 
              required 
            />
          </div>
          <div className="register-field">
            <label>Mobile Number</label>
            <input 
              type="tel" 
              name="mob_number" 
              value={formData.mob_number} 
              onChange={handleInputChange} 
              placeholder="e.g. +91 1234567890" 
              required 
            />
          </div>
          <div className="register-field">
              <label>4-Digit Account Recovery PIN</label>
              <input 
                type="text" 
                name="security_pin"
                maxLength="4"
                value={formData.security_pin} 
                onChange={handleInputChange} 
                placeholder="e.g., 1234" 
                required 
              />
            </div>

          <div className="register-field">
            <label>Corporate Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange} 
              placeholder="name@example.com" 
              required 
            />
          </div>

          <div className="register-field">
            <label>Account Role</label>
            <select name="role" 
              value={formData.role} 
              onChange={handleInputChange}
            >
              <option value="seller">Seller</option>              
            </select>
          </div>

          <div className="register-row">
            <div className="register-field">
              <label>Password</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleInputChange} 
                placeholder= "********" 
                required 
              />
            </div>
            <div className="register-field">
              <label>Confirm Password</label>
              <input 
                type="password" 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleInputChange} 
                placeholder= "********"
                required 
              />
            </div>
          </div>
          {/* --- FIXED PASSWORD CHECKER VISUAL CONDITIONALS --- */}
          {formData.password && (
            <div className="password-validator-box" >
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
          {/* Real-time Match Visual Indicator */}
          {formData.confirmPassword && (
            
            <p className={`confirm-password ${doPasswordsMatch ? 'match' : 'no-match'}`}>
               {doPasswordsMatch ? '✓ Passwords match' : '✕ Passwords do not match'}
            </p>
          )}
          <button 
            type="submit" 
            className="btn-register-submit" 
            disabled={loading || !isPasswordStrong || !doPasswordsMatch || !isPinValid}
          >
            {loading ? "Registering Account..." : "Create Account"}
          </button>
        </form>

        <p className="register-footer-text">
          Already a partner?
          <Link to="/login" className="register-link">Log In Here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
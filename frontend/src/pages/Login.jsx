import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Login.css';
import Navbar from '../components/Navbar';

const Login = ({ data }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showForgotLink, setShowForgotLink] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();  
  // Communication event handlers from App.jsx
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setShowForgotLink(false);

    try {      
      //  backend uses OAuth2 form data (username/password)
      const formData = new FormData();
      formData.append('username', email); // backend expects 'username' for email
      formData.append('password', password);
      // Get the Auth Token
      const response = await api.post('/token', formData);
      const token = response.data.access_token;
      // Save token immediately
      localStorage.setItem('token', token);
      //Fetch the actual user profile data from your database
      // Note: profile endpoint  FastAPI utilizes
      const userResponse = await api.get('/users/me');
      const user = userResponse.data;
      localStorage.setItem('role', user.role);
      // Save the user's display name
      const databaseName = user.full_name || user.email || 'Partner';
      localStorage.setItem('username', databaseName);           

      // Fire global dispatch event so App.js captures context updating
      window.dispatchEvent(new Event('authChange'));
      alert(`Login Successful! Welcome back, ${databaseName}.`);
      if (user.role === 'admin') 
        navigate('/admin');
      else 
        navigate('/dashboard');
    } catch (err) {
      console.error("Login catch intercept:", err);
      if (err.response && err.response.status === 401) {
        setShowForgotLink(true);
        setErrorMessage("Incorrect email or password. Please verify your credentials.");
      } else
        {
        // Fallback for user not found (404), server error, etc.
        setErrorMessage(err.response?.data?.detail || "Login failed. Check your credentials.");
      }
    }
  };
  
  return (
    <div className="app-wrapper">
      {/* 1. Global Navigation Header */}
      <Navbar />
      {/* 2. Main content block matching the app structural layout */}
      <main className="main-content">
        <div className="login-page">
          <div className="login-card">
            <h2>Login Portal</h2>
            <p>Access your Shine Associates dashboard</p>
            {/* Display contextual errors right above the form fields */}
            {errorMessage && (
              <div className="alert-banner error" >
                ⚠️ {errorMessage}
              </div>
            )}
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Corporate Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
              {/* CONDITIONAL RENDER: Only shows if email exists but password was wrong */}
              {showForgotLink && (
                <div className="forgot-password-container" >
                  <span
                    onClick={() => navigate('/forgot-password', { state: { prefilledEmail: email } })}
                    className="forgot-password-link"                                     
                  >
                    Forgot Password? Reset it here.
                  </span>
                </div>
              )}
              <button type="submit" className="login-submit">Authenticate</button>
            </form>
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default Login;
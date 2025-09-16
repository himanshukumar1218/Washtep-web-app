// for login/signUp

import React, { useState } from 'react';
import './AuthPage.css';
import { API_BASE } from "../config";

const AuthPage = ({ onLoginSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const switchModeHandler = () => {
    setIsLoginMode((prevMode) => !prevMode);
    setError('');
    setFormData({ name: '', email: '', phone: '', password: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const url = isLoginMode 
      ? `${API_BASE}/api/users/login` 
      :`${API_BASE}/api/users`;

    const body = isLoginMode
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, phone: formData.phone, password: formData.password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong!');
      }
      localStorage.setItem('userInfo', JSON.stringify(data));
      onLoginSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLoginMode ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <>
              <div className="form-group"><label htmlFor="name">Full Name</label><input type="text" name="name" id="name" required onChange={handleChange} /></div>
              <div className="form-group"><label htmlFor="phone">Phone Number</label><input type="tel" name="phone" id="phone" required onChange={handleChange} /></div>
            </>
          )}
          <div className="form-group"><label htmlFor="email">Email Address</label><input type="email" name="email" id="email" required onChange={handleChange} /></div>
          <div className="form-group"><label htmlFor="password">Password</label><input type="password" name="password" id="password" required onChange={handleChange} /></div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Submitting...' : isLoginMode ? 'Login' : 'Create Account'}
          </button>
        </form>
        <button onClick={switchModeHandler} className="switch-mode-button">
          {isLoginMode ? "Don't have an account? Sign Up" : 'Have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;


import React, { useState } from 'react';
import { registerUser } from '../services/authService'; 
import './Auth.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('Register form submitted with:', formData);

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setMessage('Registering...');

    try {
      const { username, email, password, profileImage } = formData;
      const data = await registerUser({ username, email, password, profileImage });
      setMessage(data.message);
      console.log('Registration successful:', data.user);
    } catch (error) {
      console.error('Registration error in component:', error);
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Something went wrong.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
            />
          </div>
          <div className="input-group">
            <label>Profile Image URL</label>
            <input
              type="text"
              name="profileImage"
              value={formData.profileImage}
              onChange={handleChange}
              placeholder="Paste image URL"
              required
            />
          </div>
          <button type="submit" className="login-button">Register</button>
          {message && <p className="login-message">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default Register;

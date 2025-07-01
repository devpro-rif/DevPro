import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // import useNavigate
import { AuthContext } from '../../contexts/AuthContext.jsx';
import { loginUser } from '../services/authService'; 
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();  // create navigate instance

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('Logging in...');

    try {
      const data = await loginUser(email, password);
      setMessage(data.message);

      login(data.user);

      // Navigate to /communities on successful login
      navigate('/communities');

    } catch (error) {
      console.error('Login error in component:', error);
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
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
          {message && <p className="login-message">{message}</p>}
        </form>

        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <p>Don't have an account?</p>
          <Link to="/register">
            <button className="login-button" style={{ backgroundColor: '#28a745' }}>
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
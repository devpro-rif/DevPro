import React from 'react';
import { Link } from 'react-router-dom';

const navStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.5rem 1rem',
  background: '#0a2342', // dark blue
  color: '#fff',
  minHeight: '44px',
};

const companyStyle = {
  fontWeight: 'bold',
  fontSize: '1.1rem',
  color: '#fff',
  letterSpacing: '1px',
};

const centerLinksStyle = {
  display: 'flex',
  gap: '1.2rem',
  flex: 1,
  justifyContent: 'center',
};

const linkStyle = {
  textDecoration: 'none',
  color: '#fff',
  fontSize: '0.98rem',
  fontWeight: 500,
  padding: '0.3rem 0.6rem',
  borderRadius: '4px',
  transition: 'background 0.2s',
};

const logoutStyle = {
  ...linkStyle,
  color: '#ff5252',
  fontWeight: 'bold',
  background: 'rgba(255,255,255,0.05)',
};

const NavBar = () => (
  <nav style={navStyle}>
    <div style={companyStyle}>DevPro</div>
    <div style={centerLinksStyle}>
      <Link to="/communities" style={linkStyle}>Communities</Link>
      <Link to="/campaigns" style={linkStyle}>Campaigns</Link>
      <Link to="/contributions" style={linkStyle}>Contributions</Link>
    </div>
    <Link to="/logout" style={logoutStyle}>LogOut</Link>
  </nav>
);

export default NavBar; 
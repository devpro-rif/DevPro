import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';  // fixed import path
import { logoutUser } from './services/authService';
import './NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const isLoggedIn = !!user; // true if user object exists

  const handleLogout = async () => {
    const result = await logoutUser();

    if (result.success) {
      logout(); 
      alert("Logout successful");
      navigate("/login");
    } else {
      alert("Logout failed: " + result.message);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-company">DevPro</div>
      <div className="navbar-links">
        {isLoggedIn && (
          <>
            <Link to="/communities" className="navbar-link">Communities</Link>
            <Link to="/campaigns" className="navbar-link">Campaigns</Link>
            <Link to="/contributions" className="navbar-link">Contributions</Link>
          </>
        )}
        
      </div>

      {isLoggedIn && (
        <>
          <Link to="/user/edit" className="navbar-link">Edit profile</Link>
          <span onClick={handleLogout} className="navbar-logout">LogOut</span>
        </>
        
      )}
    </nav>
  );
};

export default NavBar;
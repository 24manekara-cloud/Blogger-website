import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">✍️</span> Blogger
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <div className="nav-user-dropdown">
                <Link to="/profile" className="nav-profile">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="nav-avatar" />
                  ) : (
                    <div className="nav-avatar-placeholder">{user.name.charAt(0)}</div>
                  )}
                  <span>{user.name}</span>
                </Link>
                <button onClick={logout} className="btn-secondary logout-btn">Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

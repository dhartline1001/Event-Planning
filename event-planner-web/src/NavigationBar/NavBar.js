import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';

function Navbar() {
  const isLoggedIn = !!localStorage.getItem('token'); // Convert to boolean
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from storage
    navigate('/'); // Redirect to home page
    window.location.reload(); // Force refresh to reset state
  };

  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li>
          <Link to="/"><img src="/event-logo.png" alt="Event Logo" /></Link>
        </li>
        {!isLoggedIn && (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
        {isLoggedIn && (
          <>
            <li>
              <Link to="/my-tickets">My Tickets</Link>
            </li>
            <li>
              <Link to="/profile">Profile Page</Link>
            </li>
          </>
        )}
        <li>
          <Link to="/create-event">Create Event</Link>
        </li>
      </ul>
      {isLoggedIn && (
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      )}
    </nav>
  );
}

export default Navbar;

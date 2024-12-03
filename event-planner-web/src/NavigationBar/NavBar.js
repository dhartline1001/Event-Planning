import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; // Add optional styles for your Navbar

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li>
          <Link to="/"><img src="/event-logo.png" alt="Event Logo" /></Link>
        </li>
        <li>
          <Link to="/login">Login Page</Link>
        </li>
        <li>
          <Link to="/signup">Signup Page</Link>
        </li>
        <li>
          <Link to="/my-tickets">My Tickets</Link>
        </li>
        <li>
          <Link to="/create-event">Create Event</Link>
        </li>
        <li>
          <Link to="/event-preview">Event Preview</Link>
        </li>
        <li>
          <Link to="/checkout">Checkout Modal</Link>
        </li>
        <li>
          <Link to="/profile">Profile Page</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

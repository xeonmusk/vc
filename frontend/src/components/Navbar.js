import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.links}>
        <Link to="/register" style={styles.link}>Register</Link>
        <Link to="/login" style={styles.link}>Login</Link>
        <Link to="/products" style={styles.link}>Products</Link>
      </div>
      <button onClick={handleLogout} style={styles.button}>Logout</button>
    </nav>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: '#fff',
  },
  links: {
    display: 'flex',
    gap: '15px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
  },
  button: {
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    cursor: 'pointer',
  },
};

export default Navbar;

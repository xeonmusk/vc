import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProductList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/products', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(res.data);
      } catch (err) {
        alert('Error fetching products or Unauthorized');
        navigate('/login');
      }
    };
    fetchProducts();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    navigate('/login'); // Redirect to login page
  };

  return (
    <div>
      <h2>Chicken Products</h2>
      <button onClick={handleLogout}>Logout</button>
      <ul>
        {products.map(p => (
          <li key={p._id}>{p.name} - ₹{p.price}</li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;

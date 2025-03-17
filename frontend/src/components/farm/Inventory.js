import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchInventory, addInventoryItem } from '../../store/slices/inventorySlice';
import { toast } from 'react-toastify';

const Inventory = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(state => state.inventory);

  const [filter, setFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    category: '',
    quantity: 0,
    minimumThreshold: 0,
    healthStatus: 'healthy'
  });

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  const filteredItems = items.filter(item => 
    filter === 'all' ? true : item.category === filter
  );

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addInventoryItem(newItem));
      setShowAddForm(false);
      toast.success('Item added successfully');
    } catch (error) {
      toast.error('Failed to add item');
    }
  };

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h2>Inventory Management</h2>
        <button onClick={() => setShowAddForm(true)}>Add New Item</button>
        <select onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="live_chicken">Live Chicken</option>
          <option value="eggs">Eggs</option>
          <option value="feed">Feed</option>
          <option value="medicine">Medicine</option>
        </select>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddItem} className="add-form">
          {/* Add form fields */}
          <button type="submit">Add Item</button>
          <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
        </form>
      )}

      <div className="inventory-grid">
        {filteredItems.map(item => (
          <div key={item._id} className="inventory-card">
            <h3>{item.category}</h3>
            <p>Quantity: {item.quantity}</p>
            <p>Status: {item.healthStatus}</p>
            {item.quantity <= item.minimumThreshold && (
              <div className="alert">Low Stock Alert!</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;

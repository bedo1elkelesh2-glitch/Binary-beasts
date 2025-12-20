import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ShopDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('items');
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    type: 'food',
    extras: [],
    pickupTime: '15-20 minutes'
  });
  const [editingItem, setEditingItem] = useState(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, ordersRes] = await Promise.all([
        axios.get('/api/items/my-items'),
        axios.get('/api/orders/shop-orders')
      ]);
      setItems(itemsRes.data);
      setOrders(ordersRes.data);
      // Debug: log orders to check pickupTime
      console.log('Fetched shop orders:', ordersRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your shop account? This cannot be undone.')) {
      return;
    }
    try {
      await axios.delete('/api/users/me');
      toast.success('Account deleted');
      logout();
      window.location.href = '/';
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete account';
      toast.error(message);
    }
  };

  const handleAddExtra = () => {
    setFormData({
      ...formData,
      extras: [...formData.extras, { name: '', price: 0 }]
    });
  };

  const handleRemoveExtra = (index) => {
    setFormData({
      ...formData,
      extras: formData.extras.filter((_, i) => i !== index)
    });
  };

  const handleExtraChange = (index, field, value) => {
    const updatedExtras = formData.extras.map((extra, i) => 
      i === index ? { ...extra, [field]: value } : extra
    );
    setFormData({ ...formData, extras: updatedExtras });
  };

  const handleSubmitItem = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Item name is required');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      toast.error('Valid price is required');
      return;
    }
    if (!formData.pickupTime.trim()) {
      toast.error('Preparation time is required');
      return;
    }
    
    // Debug logging
    console.log('Form data before submission:', formData);
    console.log('Pickup time value:', formData.pickupTime);
    
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('description', formData.description);
    submitData.append('price', formData.price);
    submitData.append('type', formData.type);
    submitData.append('pickupTime', formData.pickupTime);
    submitData.append('extras', JSON.stringify(formData.extras.filter(extra => extra.name && extra.price !== '')));
    
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    // Debug: Log FormData contents
    console.log('FormData contents:');
    for (let [key, value] of submitData.entries()) {
      console.log(key, value);
    }

    try {
      if (editingItem) {
        await axios.put(`/api/items/${editingItem._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Item updated successfully!');
      } else {
        await axios.post('/api/items', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Item added successfully!');
      }
      
      setFormData({
        name: '',
        description: '',
        price: '',
        type: 'food',
        extras: [],
        pickupTime: '15-20 minutes'
      });
      setImageFile(null);
      setEditingItem(null);
      setShowItemForm(false);
      fetchData();
    } catch (error) {
      console.error('Item save error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      let message = 'Failed to save item';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error.message) {
        message = error.message;
      }
      
      toast.error(message);
    }
  };

  const handleEditItem = (item) => {
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      type: item.type,
      extras: item.extras || [],
      pickupTime: item.pickupTime || '15-20 minutes'
    });
    setEditingItem(item);
    setShowItemForm(true);
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await axios.delete(`/api/items/${itemId}`);
      toast.success('Item deleted successfully!');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const handleToggleAvailability = async (itemId) => {
    try {
      await axios.patch(`/api/items/${itemId}/toggle-availability`);
      toast.success('Item availability updated!');
      fetchData();
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  const handleUpdateOrderStatus = async (orderId, status, eta) => {
    try {
      await axios.patch(`/api/orders/${orderId}/status`, { status, estimatedPickupTime: eta });
      toast.success('Order status updated!');
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update order status';
      toast.error(message);
    }
  };

  if (loading) return <LoadingSpinner message="Loading your shop dashboard..." />;

  return (
    <div style={{ padding: '40px 0', backgroundColor: 'var(--light-gray)', minHeight: 'calc(100vh - 140px)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '700', color: 'var(--red)', marginBottom: '8px' }}>
            🏪 Shop Dashboard
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--dark-gray)' }}>
            Welcome back, {user?.shopName}! Manage your menu and orders here.
          </p>
          <div className="flex" style={{ marginTop: '12px', gap: '12px' }}>
            <button
              onClick={handleDeleteAccount}
              className="btn"
              style={{ backgroundColor: 'var(--error)', color: 'var(--white)' }}
            >
              Delete My Account
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📝</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--red)', marginBottom: '4px' }}>
              {items.length}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--dark-gray)' }}>
              Menu Items
            </div>
          </div>
          
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📋</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--red)', marginBottom: '4px' }}>
              {orders.length}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--dark-gray)' }}>
              Total Orders
            </div>
          </div>
          
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>⏳</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--red)', marginBottom: '4px' }}>
              {orders.filter(order => ['pending', 'confirmed', 'preparing'].includes(order.status)).length}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--dark-gray)' }}>
              Active Orders
            </div>
          </div>
          
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--red)', marginBottom: '4px' }}>
              {items.filter(item => item.isAvailable).length}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--dark-gray)' }}>
              Available Items
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="flex" style={{ borderBottom: '1px solid var(--medium-gray)' }}>
            <button
              onClick={() => setActiveTab('items')}
              className={`btn ${activeTab === 'items' ? 'btn-primary' : 'btn-outline'}`}
              style={{
                borderRadius: '0',
                borderBottom: 'none',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '0'
              }}
            >
              📝 Manage Items
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline'}`}
              style={{
                borderRadius: '0',
                borderBottom: 'none',
                borderTopRightRadius: '12px',
                borderTopLeftRadius: '0'
              }}
            >
              📋 Orders
            </button>
          </div>

          <div style={{ padding: '24px' }}>
            {/* Items Tab */}
            {activeTab === 'items' && (
              <div>
                <div className="flex justify-between align-center mb-3">
                  <h3 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--black)' }}>
                    Your Menu Items
                  </h3>
                  <button
                    onClick={() => {
                      setFormData({
                        name: '',
                        description: '',
                        price: '',
                        type: 'food',
                        extras: [],
                        pickupTime: '15-20 minutes'
                      });
                      setEditingItem(null);
                      setImageFile(null);
                      setShowItemForm(true);
                    }}
                    className="btn btn-primary"
                  >
                    + Add New Item
                  </button>
                </div>

                {/* Add/Edit Item Form */}
                {showItemForm && (
                  <div className="card" style={{ padding: '24px', marginBottom: '24px', backgroundColor: 'var(--light-gray)' }}>
                    <h4 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: 'var(--black)' }}>
                      {editingItem ? 'Edit Item' : 'Add New Item'}
                    </h4>
                    
                    <form onSubmit={handleSubmitItem}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div className="form-group">
                          <label className="form-label">Item Name *</label>
                          <input
                            type="text"
                            className="form-input"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">Price *</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="form-input"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div className="form-group">
                          <label className="form-label">Type *</label>
                          <select
                            className="form-select"
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                            required
                          >
                            <option value="food">🍔 Food</option>
                            <option value="drink">🥤 Drink</option>
                          </select>
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">Preparation Time *</label>
                          <input
                            type="text"
                            className="form-input"
                            value={formData.pickupTime}
                            onChange={(e) => setFormData({...formData, pickupTime: e.target.value})}
                            placeholder="e.g., 15-20 minutes"
                            required
                          />
                          <div style={{ fontSize: '12px', color: 'var(--dark-gray)', marginTop: '4px' }}>
                            How long does it take to prepare this item?
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-textarea"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          rows={3}
                          placeholder="Describe your item..."
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Image (Optional)</label>
                        <input
                          type="file"
                          className="form-input"
                          accept="image/jpeg,image/jpg,image/png,image/gif"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              // Validate file size (20MB limit for 4K photos)
                              if (file.size > 20 * 1024 * 1024) {
                                toast.error('Image file is too large. Maximum size is 20MB for 4K photos.');
                                e.target.value = '';
                                setImageFile(null);
                                return;
                              }
                              // Validate file type
                              const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                              if (!allowedTypes.includes(file.type)) {
                                toast.error('Only JPEG, JPG, PNG, and GIF images are allowed.');
                                e.target.value = '';
                                setImageFile(null);
                                return;
                              }
                            }
                            setImageFile(file);
                          }}
                        />
                        <div style={{ fontSize: '12px', color: 'var(--dark-gray)', marginTop: '4px' }}>
                          Supported formats: JPEG, JPG, PNG, GIF. Maximum size: 20MB (supports 4K photos).
                        </div>
                        {editingItem?.image && !imageFile && (
                          <div style={{ marginTop: '8px' }}>
                            <img
                              src={`http://localhost:5000${editingItem.image}`}
                              alt="Current"
                              style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Extras */}
                      <div className="form-group">
                        <div className="flex justify-between align-center mb-2">
                          <label className="form-label">Extras</label>
                          <button type="button" onClick={handleAddExtra} className="btn btn-secondary" style={{ fontSize: '14px', padding: '6px 12px' }}>
                            + Add Extra
                          </button>
                        </div>
                        {formData.extras.map((extra, index) => (
                          <div key={index} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Extra name"
                              value={extra.name}
                              onChange={(e) => handleExtraChange(index, 'name', e.target.value)}
                            />
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              className="form-input"
                              placeholder="Price"
                              value={extra.price}
                              onChange={(e) => handleExtraChange(index, 'price', parseFloat(e.target.value) || 0)}
                              style={{ maxWidth: '120px' }}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveExtra(index)}
                              className="btn"
                              style={{ backgroundColor: 'var(--error)', color: 'var(--white)', padding: '8px 12px', fontSize: '14px' }}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <button type="submit" className="btn btn-primary">
                          {editingItem ? 'Update Item' : 'Add Item'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowItemForm(false);
                            setEditingItem(null);
                            setImageFile(null);
                          }}
                          className="btn btn-outline"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Items List */}
                {items.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                    <p style={{ color: 'var(--dark-gray)' }}>No items yet. Add your first menu item!</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {items.map(item => (
                      <div key={item._id} className="card" style={{ overflow: 'hidden' }}>
                        <div style={{ position: 'relative' }}>
                          {item.image ? (
                            <img
                              src={`http://localhost:5000${item.image}`}
                              alt={item.name}
                              style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{
                              width: '100%',
                              height: '150px',
                              backgroundColor: 'var(--medium-gray)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '48px'
                            }}>
                              {item.type === 'food' ? '🍔' : '🥤'}
                            </div>
                          )}
                          
                          <div style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            backgroundColor: item.isAvailable ? 'var(--success)' : 'var(--error)',
                            color: 'var(--white)',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {item.isAvailable ? 'Available' : 'Out of Order'}
                          </div>
                        </div>

                        <div style={{ padding: '16px' }}>
                          <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                            {item.name}
                          </h4>
                          <p style={{ color: 'var(--dark-gray)', fontSize: '14px', marginBottom: '12px' }}>
                            {item.description || 'No description'}
                          </p>
                          <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--red)', marginBottom: '8px' }}>
                            E£{item.price.toFixed(2)}
                          </div>
                          
                          <div style={{ 
                            fontSize: '14px', 
                            color: 'var(--dark-gray)', 
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            ⏱️ Prep time: {item.pickupTime || '15-20 minutes'}
                          </div>
                          
                          <div className="flex gap-1" style={{ flexWrap: 'wrap' }}>
                            <button
                              onClick={() => handleEditItem(item)}
                              className="btn btn-outline"
                              style={{ fontSize: '12px', padding: '6px 12px' }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleToggleAvailability(item._id)}
                              className={`btn ${item.isAvailable ? 'btn-secondary' : 'btn-primary'}`}
                              style={{ fontSize: '12px', padding: '6px 12px' }}
                            >
                              {item.isAvailable ? 'Disable' : 'Enable'}
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item._id)}
                              className="btn"
                              style={{ 
                                backgroundColor: 'var(--error)', 
                                color: 'var(--white)', 
                                fontSize: '12px', 
                                padding: '6px 12px' 
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px', color: 'var(--black)' }}>
                    Incoming Orders
                  </h3>
                  <div style={{ 
                    backgroundColor: 'var(--light-gray)', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    color: 'var(--dark-gray)'
                  }}>
                    💡 <strong>Tip:</strong> Set accurate preparation times for your items and update order ETAs to keep customers informed about when their food will be ready for pickup.
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                    <p style={{ color: 'var(--dark-gray)' }}>No orders yet. Orders will appear here once customers start ordering!</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {orders.filter(order => order.status !== 'cancelled').map(order => (
                      <div key={order._id} className="card" style={{ padding: '20px' }}>
                        <div className="flex justify-between align-center mb-3">
                          <div>
                            <h4 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--black)' }}>
                              Order #{order._id.slice(-8).toUpperCase()}
                            </h4>
                            <div style={{ fontSize: '14px', color: 'var(--dark-gray)' }}>
                              Customer: {order.customerId?.universityId || order.customerId?.email}
                            </div>
                            <div style={{ fontSize: '14px', color: 'var(--dark-gray)' }}>
                              {new Date(order.createdAt).toLocaleString()}
                            </div>
                            {order.pickupTime && (
                              <div style={{ fontSize: '14px', color: 'var(--red)', fontWeight: 700 }}>
                                🕒 Pickup Time: {(() => {
                                  const d = new Date(order.pickupTime);
                                  const hh = d.getHours().toString().padStart(2, '0');
                                  const mm = d.getMinutes().toString().padStart(2, '0');
                                  return `${hh}:${mm}`;
                                })()}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex align-center gap-2">
                            <div className="flex align-center gap-1" style={{ flexWrap: 'wrap' }}>
                              <input
                                type="text"
                                placeholder="ETA e.g., 20-25 minutes"
                                defaultValue={order.estimatedPickupTime || ''}
                                onBlur={(e) => {
                                  const value = e.target.value;
                                  if (value && value !== order.estimatedPickupTime) {
                                    handleUpdateOrderStatus(order._id, undefined, value);
                                  }
                                }}
                                className="form-input"
                                style={{ fontSize: '14px', padding: '6px 12px', minWidth: '180px' }}
                                title="Set when this order will be ready for pickup"
                              />
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value, undefined)}
                                className="form-select"
                                style={{ fontSize: '14px', padding: '6px 12px' }}
                              >
                              <option value="pending">⏳ Pending</option>
                              <option value="confirmed">✅ Confirmed</option>
                              <option value="preparing">👨‍🍳 Preparing</option>
                              <option value="ready">🔔 Ready</option>
                              <option value="completed">✨ Completed</option>
                              <option value="cancelled">❌ Cancelled</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Pickup Time and Prep Time */}
                        <div style={{ marginBottom: '16px' }}>
                          <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Items:</h5>
                          {order.items.map((item, index) => (
                            <div key={index} style={{
                              padding: '8px 12px',
                              backgroundColor: 'var(--light-gray)',
                              borderRadius: '6px',
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>
                              <strong>{item.itemName}</strong> x{item.quantity}
                              {item.extras && item.extras.length > 0 && (
                                <div style={{ color: 'var(--dark-gray)', fontSize: '12px' }}>
                                  Extras: {item.extras.map(extra => extra.name).join(', ')}
                                </div>
                              )}
                            </div>
                          ))}
                          {/* Show pickup time if available */}
                          {order.pickupTime && (
                            <div style={{ marginTop: '8px', color: 'var(--black)', fontWeight: 600 }}>
                              🕒 Customer Pickup Time: {new Date(order.pickupTime).toLocaleString()}
                            </div>
                          )}
                          {/* Red message when order needs to be prepared (10 min before pickup) */}
                          {order.pickupTime && (() => {
                            const now = new Date();
                            const pickup = new Date(order.pickupTime);
                            const diffMs = pickup - now;
                            const diffMin = Math.floor(diffMs / 60000);
                            // Show message if within 10 minutes before pickup and not past pickup
                            if (diffMin <= 10 && diffMin > 0 && order.status !== 'completed' && order.status !== 'cancelled') {
                              return (
                                <div style={{
                                  background: '#ffeaea',
                                  color: '#d32f2f',
                                  fontWeight: 700,
                                  padding: '10px',
                                  borderRadius: '8px',
                                  marginTop: '10px',
                                  fontSize: '16px',
                                  textAlign: 'center',
                                  border: '1px solid #d32f2f'
                                }}>
                                  ⚠️ Start preparing this order now to finish before pickup time!
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>

                        {order.orderNotes && (
                          <div style={{ marginBottom: '16px' }}>
                            <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Notes:</h5>
                            <div style={{
                              padding: '8px 12px',
                              backgroundColor: 'var(--light-gray)',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontStyle: 'italic'
                            }}>
                              "{order.orderNotes}"
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between align-center">
                          <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--red)' }}>
                            Total: E£{order.totalAmount.toFixed(2)}
                          </div>
                          <div style={{ fontSize: '14px', color: 'var(--dark-gray)' }}>
                            {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;

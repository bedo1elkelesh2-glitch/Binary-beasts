import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [shops, setShops] = useState([]);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteUserId, setDeleteUserId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [shopsRes, itemsRes, ordersRes] = await Promise.all([
        axios.get('/api/users/shops'),
        axios.get('/api/items'),
        axios.get('/api/orders/all')
      ]);
      setShops(shopsRes.data);
      setItems(itemsRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      toast.error('Failed to load admin data');
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllUsers = async () => {
    if (!window.confirm('Delete ALL users? This cannot be undone.')) return;
    try {
      await axios.delete('/api/users/all');
      toast.success('All users deleted');
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete all users';
      toast.error(message);
    }
  };

  const handleDeleteUserById = async () => {
    if (!deleteUserId) return toast.error('Enter a user ID');
    if (!window.confirm(`Delete user ${deleteUserId}?`)) return;
    try {
      await axios.delete(`/api/users/${deleteUserId}`);
      toast.success('User deleted');
      setDeleteUserId('');
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete user';
      toast.error(message);
    }
  };

  const handleDeleteItem = async (itemId, itemName) => {
    if (!window.confirm(`Delete item "${itemName}"? This cannot be undone.`)) return;
    try {
      console.log('Attempting to delete item:', itemId);
      console.log('Current user:', user);
      console.log('User role:', user?.role);
      
      const response = await axios.delete(`/api/items/${itemId}`);
      console.log('Delete response:', response.data);
      toast.success('Item deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Delete error:', error);
      console.error('Error response:', error.response?.data);
      const message = error.response?.data?.message || 'Failed to delete item';
      toast.error(message);
    }
  };

  const JSONDisplay = ({ data, title }) => (
    <div className="card" style={{ marginBottom: '24px' }}>
      <div style={{ 
        padding: '16px 24px', 
        borderBottom: '1px solid var(--medium-gray)',
        backgroundColor: 'var(--light-gray)',
        fontSize: '18px',
        fontWeight: '600',
        color: 'var(--black)'
      }}>
        {title}
      </div>
      <div style={{ 
        padding: '24px',
        backgroundColor: 'var(--black)',
        color: '#00ff00',
        fontFamily: 'monospace',
        fontSize: '12px',
        maxHeight: '400px',
        overflow: 'auto',
        lineHeight: '1.4'
      }}>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'var(--warning)';
      case 'confirmed':
        return 'var(--gold)';
      case 'preparing':
        return '#2196F3';
      case 'ready':
        return 'var(--success)';
      case 'completed':
        return 'var(--black)';
      case 'cancelled':
        return 'var(--error)';
      default:
        return 'var(--dark-gray)';
    }
  };

  if (loading) return <LoadingSpinner message="Loading admin dashboard..." />;

  const totalRevenue = orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.totalAmount, 0);
  const ongoingOrders = orders.filter(order => ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status));
  const completedOrders = orders.filter(order => order.status === 'completed');
  const cancelledOrders = orders.filter(order => order.status === 'cancelled');

  return (
    <div style={{ padding: '40px 0', backgroundColor: 'var(--light-gray)', minHeight: 'calc(100vh - 140px)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '700', color: 'var(--red)', marginBottom: '8px' }}>
            👨‍💼 Admin Dashboard
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--dark-gray)' }}>
            Welcome back, {user?.username}! Monitor the GIU Food Court platform.
          </p>
        </div>

        {/* Stats Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏪</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--red)', marginBottom: '4px' }}>
              {shops.length}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--dark-gray)' }}>
              Registered Shops
            </div>
          </div>
          
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🍽️</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--red)', marginBottom: '4px' }}>
              {items.length}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--dark-gray)' }}>
              Total Menu Items
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
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>💰</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--red)', marginBottom: '4px' }}>
              E£{totalRevenue.toFixed(2)}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--dark-gray)' }}>
              Revenue (Completed)
            </div>
          </div>
          
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔄</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--red)', marginBottom: '4px' }}>
              {ongoingOrders.length}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--dark-gray)' }}>
              Ongoing Orders
            </div>
          </div>
          
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--red)', marginBottom: '4px' }}>
              {completedOrders.length}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--dark-gray)' }}>
              Completed Orders
            </div>
          </div>
          
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>❌</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--red)', marginBottom: '4px' }}>
              {cancelledOrders.length}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--dark-gray)' }}>
              Cancelled Orders
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="flex" style={{ borderBottom: '1px solid var(--medium-gray)' }}>
            <button
              onClick={() => setActiveTab('overview')}
              className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: '0', borderBottom: 'none', borderTopLeftRadius: '12px' }}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab('shops')}
              className={`btn ${activeTab === 'shops' ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: '0', borderBottom: 'none' }}
            >
              🏪 Shops
            </button>
            <button
              onClick={() => setActiveTab('items')}
              className={`btn ${activeTab === 'items' ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: '0', borderBottom: 'none' }}
            >
              🍽️ Items
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: '0', borderBottom: 'none', borderTopRightRadius: '12px' }}
            >
              📋 Orders
            </button>
          </div>

          <div style={{ padding: '24px' }}>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: 'var(--black)' }}>
                  Platform Overview
                </h3>

                {/* Recent Activity */}
                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: 'var(--black)' }}>
                    Recent Orders
                  </h4>
                  <div className="card" style={{ padding: '20px' }}>
                    {orders.slice(0, 5).map(order => (
                      <div key={order._id} style={{
                        padding: '12px 0',
                        borderBottom: '1px solid var(--medium-gray)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '14px' }}>
                            Order #{order._id.slice(-8).toUpperCase()}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--dark-gray)' }}>
                            {order.customerId?.email || order.customerId?.universityId} • {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex align-center gap-2">
                          <span style={{
                            padding: '4px 12px',
                            backgroundColor: getStatusColor(order.status),
                            color: order.status === 'confirmed' || order.status === 'warning' ? 'var(--black)' : 'var(--white)',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {order.status.toUpperCase()}
                          </span>
                          <span style={{ fontWeight: '600', color: 'var(--red)' }}>
                            E£{order.totalAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ongoing Orders */}
                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: 'var(--black)' }}>
                    Ongoing Orders ({ongoingOrders.length})
                  </h4>
                  <div className="card" style={{ padding: '20px' }}>
                    {ongoingOrders.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '20px', color: 'var(--dark-gray)' }}>
                        No ongoing orders at the moment
                      </div>
                    ) : (
                      ongoingOrders.slice(0, 5).map(order => (
                        <div key={order._id} style={{
                          padding: '12px 0',
                          borderBottom: '1px solid var(--medium-gray)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '14px' }}>
                              Order #{order._id.slice(-8).toUpperCase()}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--dark-gray)' }}>
                              {order.customerId?.email || order.customerId?.universityId} • {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex align-center gap-2">
                            <span style={{
                              padding: '4px 12px',
                              backgroundColor: getStatusColor(order.status),
                              color: order.status === 'confirmed' || order.status === 'warning' ? 'var(--black)' : 'var(--white)',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              {order.status.toUpperCase()}
                            </span>
                            <span style={{ fontWeight: '600', color: 'var(--red)' }}>
                              E£{order.totalAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Shop Performance */}
                <div>
                  <h4 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: 'var(--black)' }}>
                    Shop Performance
                  </h4>
                  <div className="card" style={{ padding: '20px' }}>
                    {shops.map(shop => {
                      const shopOrders = orders.filter(order => 
                        order.items.some(item => item.shopId?.toString() === shop._id)
                      );
                      const shopCompletedOrders = shopOrders.filter(order => order.status === 'completed');
                      const shopRevenue = shopCompletedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
                      const shopItems = items.filter(item => item.shopId === shop._id);
                      
                      return (
                        <div key={shop._id} style={{
                          padding: '16px',
                          margin: '8px 0',
                          backgroundColor: 'var(--light-gray)',
                          borderRadius: '8px'
                        }}>
                          <div className="flex justify-between align-center">
                            <div>
                              <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>
                                🏪 {shop.shopName}
                              </div>
                              <div style={{ fontSize: '14px', color: 'var(--dark-gray)' }}>
                                {shopItems.length} items • {shopOrders.length} orders
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontWeight: '700', color: 'var(--red)', fontSize: '18px' }}>
                                E£{shopRevenue.toFixed(2)}
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--dark-gray)' }}>
                                Revenue (Completed)
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Shops Tab */}
            {activeTab === 'shops' && (
              <div>
                <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: 'var(--black)' }}>
                  Registered Shops ({shops.length})
                </h3>
                <div className="card" style={{ padding: '16px', marginBottom: '16px' }}>
                  <div className="flex" style={{ gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="User ID to delete"
                      value={deleteUserId}
                      onChange={(e) => setDeleteUserId(e.target.value)}
                      style={{ maxWidth: '320px' }}
                    />
                    <button onClick={handleDeleteUserById} className="btn" style={{ backgroundColor: 'var(--error)', color: 'var(--white)' }}>
                      Delete User by ID
                    </button>
                    <button onClick={handleDeleteAllUsers} className="btn btn-outline">
                      Delete ALL Users
                    </button>
                  </div>
                </div>
                <div className="card" style={{ padding: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8px', fontWeight: 600, marginBottom: '8px' }}>
                    <div>Shop Name</div>
                    <div>Phone</div>
                    <div>Items</div>
                    <div>Orders</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {shops.map(shop => {
                      const shopItems = items.filter(i => i.shopId === shop._id);
                      const shopOrders = orders.filter(o => o.items.some(it => it.shopId?.toString() === shop._id));
                      return (
                        <div key={shop._id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8px', padding: '8px 0', borderTop: '1px solid var(--medium-gray)' }}>
                          <div>{shop.shopName}</div>
                          <div>{shop.phoneNumber || '-'}</div>
                          <div>{shopItems.length}</div>
                          <div>{shopOrders.length}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Items Tab */}
            {activeTab === 'items' && (
              <div>
                <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: 'var(--black)' }}>
                  Menu Items ({items.length})
                </h3>
                <div className="card" style={{ padding: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '8px', fontWeight: 600, marginBottom: '8px' }}>
                    <div>Name</div>
                    <div>Price</div>
                    <div>Type</div>
                    <div>Shop</div>
                    <div>Actions</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {items.map(item => (
                      <div key={item._id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '8px', padding: '8px 0', borderTop: '1px solid var(--medium-gray)', alignItems: 'center' }}>
                        <div>{item.name}</div>
                        <div>E£{Number(item.price).toFixed(2)}</div>
                        <div>{item.type}</div>
                        <div>{item.shopName || '-'}</div>
                        <div>
                          <button
                            onClick={() => handleDeleteItem(item._id, item.name)}
                            className="btn"
                            style={{ 
                              backgroundColor: 'var(--error)', 
                              color: 'var(--white)', 
                              padding: '4px 8px', 
                              fontSize: '12px' 
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: 'var(--black)' }}>
                  Orders ({orders.length})
                </h3>
                <div className="card" style={{ padding: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.6fr 1fr 1fr 1fr', gap: '8px', fontWeight: 600, marginBottom: '8px' }}>
                    <div>Order</div>
                    <div>Customer</div>
                    <div>Status</div>
                    <div>Total</div>
                    <div>Items</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {orders.map(order => (
                      <div key={order._id} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.6fr 1fr 1fr 1fr', gap: '8px', padding: '8px 0', borderTop: '1px solid var(--medium-gray)' }}>
                        <div>#{order._id.slice(-8).toUpperCase()}</div>
                        <div>{order.customerId?.email || order.customerId?.universityId}</div>
                        <div>{order.status}</div>
                        <div>E£{Number(order.totalAmount).toFixed(2)}</div>
                        <div>{order.items.reduce((sum, i) => sum + i.quantity, 0)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* System Information */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: 'var(--black)' }}>
            📊 System Information
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            fontSize: '14px'
          }}>
            <div>
              <strong>Platform:</strong> GIU Food Court
            </div>
            <div>
              <strong>Admin:</strong> {user?.username}
            </div>
            <div>
              <strong>University ID:</strong> {user?.universityId}
            </div>
            <div>
              <strong>Last Updated:</strong> {new Date().toLocaleString()}
            </div>
            <div>
              <strong>Active Items:</strong> {items.filter(item => item.isAvailable).length}/{items.length}
            </div>
            <div>
              <strong>Food vs Drinks:</strong> {items.filter(item => item.type === 'food').length}F / {items.filter(item => item.type === 'drink').length}D
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

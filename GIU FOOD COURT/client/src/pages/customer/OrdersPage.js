import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const OrdersPage = () => {
  const { logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders/my-orders');
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Delete your account? This cannot be undone.')) return;
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

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await axios.patch(`/api/orders/${orderId}/status`, { status: 'cancelled' });
      toast.success('Order cancelled successfully');
      fetchOrders(); // Refresh orders
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel order';
      toast.error(message);
    }
  };

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'confirmed':
        return '✅';
      case 'preparing':
        return '👨‍🍳';
      case 'ready':
        return '🔔';
      case 'completed':
        return '✨';
      case 'cancelled':
        return '❌';
      default:
        return '📋';
    }
  };

  if (loading) return <LoadingSpinner message="Loading your orders..." />;

  return (
    <div style={{ padding: '40px 0', backgroundColor: 'var(--light-gray)', minHeight: 'calc(100vh - 140px)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '700', color: 'var(--red)', marginBottom: '8px' }}>
            📋 My Orders
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--dark-gray)' }}>
            Track your order history and current orders
          </p>
          <div className="flex" style={{ marginTop: '12px' }}>
            <button
              onClick={handleDeleteAccount}
              className="btn"
              style={{ backgroundColor: 'var(--error)', color: 'var(--white)' }}
            >
              Delete My Account
            </button>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>📝</div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px', color: 'var(--red)' }}>
              No Orders Yet
            </h2>
            <p style={{ color: 'var(--dark-gray)', marginBottom: '32px', lineHeight: '1.6' }}>
              You haven't placed any orders yet. Browse our delicious menu to get started!
            </p>
            <Link to="/menu" className="btn btn-primary" style={{ fontSize: '18px', padding: '16px 32px' }}>
              Browse Menu 🍽️
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {orders.map(order => (
              <div key={order._id} className="card" style={{ padding: '24px' }}>
                {/* Order Header */}
                <div className="flex justify-between align-center mb-3" style={{ flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--black)', marginBottom: '4px' }}>
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <div style={{ fontSize: '14px', color: 'var(--dark-gray)' }}>
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex align-center gap-2">
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      backgroundColor: getStatusColor(order.status),
                      color: order.status === 'confirmed' || order.status === 'warning' ? 'var(--black)' : 'var(--white)',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      <span>{getStatusIcon(order.status)}</span>
                      <span>{order.status.toUpperCase()}</span>
                    </div>
                    
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="btn"
                        style={{
                          backgroundColor: 'var(--error)',
                          color: 'var(--white)',
                          padding: '8px 16px',
                          fontSize: '14px'
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Pickup Time */}
                {order.pickupTime && (
                  <div style={{ marginBottom: '12px', color: 'var(--black)', fontWeight: 600 }}>
                    🕒 Pickup Time: {order.pickupTime.length === 5
                      ? order.pickupTime // if only time string (HH:mm)
                      : new Date(order.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
                {/* Order Items */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: 'var(--black)' }}>
                    Items Ordered:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {order.items.map((item, index) => (
                      <div key={index} className="flex align-center gap-3" style={{
                        padding: '12px',
                        backgroundColor: 'var(--light-gray)',
                        borderRadius: '8px'
                      }}>
                        <div style={{
                          width: '50px',
                          height: '50px',
                          backgroundColor: 'var(--medium-gray)',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          flexShrink: 0
                        }}>
                          {item.itemId?.image ? (
                            <img
                              src={`http://localhost:5000${item.itemId.image}`}
                              alt={item.itemName}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '6px'
                              }}
                            />
                          ) : (
                            '🍔'
                          )}
                        </div>
                        
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--black)', marginBottom: '4px' }}>
                            {item.itemName} x{item.quantity}
                          </div>
                          <div style={{ fontSize: '14px', color: 'var(--dark-gray)', marginBottom: '2px' }}>
                            🏪 {item.shopName}
                          </div>
                          {item.extras && item.extras.length > 0 && (
                            <div style={{ fontSize: '13px', color: 'var(--dark-gray)' }}>
                              Extras: {item.extras.map(extra => extra.name).join(', ')}
                            </div>
                          )}
                        </div>
                        
                        <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--red)' }}>
                          E£{((item.price + item.extras.reduce((sum, extra) => sum + (extra.price || 0), 0)) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Notes */}
                {order.orderNotes && (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: 'var(--black)' }}>
                      Notes:
                    </h4>
                    <div style={{
                      padding: '12px',
                      backgroundColor: 'var(--light-gray)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: 'var(--dark-gray)',
                      fontStyle: 'italic'
                    }}>
                      "{order.orderNotes}"
                    </div>
                  </div>
                )}

                {/* Order Footer */}
                <div className="flex justify-between align-center" style={{
                  paddingTop: '16px',
                  borderTop: '1px solid var(--medium-gray)',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    {order.estimatedPickupTime && (
                      <div style={{ fontSize: '14px', color: 'var(--dark-gray)', marginBottom: '4px' }}>
                        ⏰ Estimated pickup: {order.estimatedPickupTime}
                      </div>
                    )}
                    <div style={{ fontSize: '14px', color: 'var(--dark-gray)' }}>
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </div>
                  </div>
                  {/* Pickup Time in the middle, always show box */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: 32 }}>
                    <span style={{
                      fontSize: '15px',
                      color: 'var(--black)',
                      fontWeight: 600,
                      background: 'var(--light-gray)',
                      borderRadius: '8px',
                      padding: '6px 18px',
                      margin: '0 8px',
                      minWidth: 120,
                      textAlign: 'center',
                      display: 'inline-block'
                    }}>
                      🕒 Pickup: {order.pickupTime
                        ? (() => {
                            const d = new Date(order.pickupTime);
                            const hh = d.getHours().toString().padStart(2, '0');
                            const mm = d.getMinutes().toString().padStart(2, '0');
                            return `${hh}:${mm}`;
                          })()
                        : '--'}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--red)' }}>
                      Total: E£{order.totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
                {/* Pickup Time (above order items) */}
                {order.pickupTime && (
                  <div style={{ marginBottom: '12px', color: 'var(--black)', fontWeight: 600 }}>
                    🕒 Pickup Time: {order.pickupTime.length === 5
                      ? order.pickupTime // if only time string (HH:mm)
                      : new Date(order.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;

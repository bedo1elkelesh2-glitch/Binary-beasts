import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const [orderNotes, setOrderNotes] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    if (!pickupTime) {
      toast.error('Please select a pickup time');
      return;
    }
    // Validate time is within 01:00 and 17:20
    const [hour, minute] = pickupTime.split(':').map(Number);
    if (
      hour < 1 ||
      (hour === 17 && minute > 20) ||
      hour > 17
    ) {
      toast.error('Pickup time must be between 1:00 AM and 5:20 PM');
      return;
    }

    setLoading(true);
    try {

      // Convert pickupTime (HH:mm) to ISO string for today (or tomorrow if time has passed)
      let pickupDateTime = '';
      if (pickupTime) {
        const [hour, minute] = pickupTime.split(':').map(Number);
        const now = new Date();
        let pickupDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
        // If the selected time has already passed today, use tomorrow
        if (pickupDate < now) {
          pickupDate.setDate(pickupDate.getDate() + 1);
        }
        pickupDateTime = pickupDate.toISOString();
      }

      const orderData = {
        items: cartItems.map(item => ({
          itemId: item.itemId,
          quantity: item.quantity,
          extras: item.extras
        })),
        orderNotes,
        pickupTime: pickupDateTime
      };

      await axios.post('/api/orders', orderData);
      toast.success('Order placed successfully! 🎉');
      clearCart();
      navigate('/orders');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to place order';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ 
        padding: '40px 0', 
        backgroundColor: 'var(--light-gray)', 
        minHeight: 'calc(100vh - 140px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="container">
          <div className="card" style={{ padding: '60px', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>🛒</div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px', color: 'var(--red)' }}>
              Your Cart is Empty
            </h2>
            <p style={{ color: 'var(--dark-gray)', marginBottom: '32px', lineHeight: '1.6' }}>
              Looks like you haven't added any delicious items to your cart yet. 
              Browse our menu to discover amazing food and drinks!
            </p>
            <Link to="/menu" className="btn btn-primary" style={{ fontSize: '18px', padding: '16px 32px' }}>
              Browse Menu 🍽️
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0', backgroundColor: 'var(--light-gray)', minHeight: 'calc(100vh - 140px)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '700', color: 'var(--red)', marginBottom: '8px' }}>
            🛒 Your Cart
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--dark-gray)' }}>
            Review your items and place your order
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          {/* Cart Items */}
          <div>
            <div className="card" style={{ padding: '24px' }}>
              <div className="flex justify-between align-center mb-3">
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--black)' }}>
                  Order Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
                </h3>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear your cart?')) {
                      clearCart();
                      toast.success('Cart cleared');
                    }
                  }}
                  className="btn btn-outline"
                  style={{ padding: '8px 16px', fontSize: '14px' }}
                >
                  Clear Cart
                </button>
              </div>

              {cartItems.map((item, index) => (
                <div key={`${item.itemId}-${JSON.stringify(item.extras)}`} style={{
                  padding: '20px 0',
                  borderBottom: index < cartItems.length - 1 ? '1px solid var(--medium-gray)' : 'none'
                }}>
                  <div className="flex gap-3">
                    {/* Item Image */}
                    <div style={{
                      width: '80px',
                      height: '80px',
                      backgroundColor: 'var(--medium-gray)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      flexShrink: 0
                    }}>
                      {item.image ? (
                        <img
                          src={`http://localhost:5000${item.image}`}
                          alt={item.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                      ) : (
                        '🍔'
                      )}
                    </div>

                    {/* Item Details */}
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: 'var(--black)' }}>
                        {item.name}
                      </h4>
                      <div style={{ fontSize: '14px', color: 'var(--dark-gray)', marginBottom: '8px' }}>
                        🏪 {item.shopName}
                      </div>
                      
                      {item.pickupTime && (
                        <div style={{ 
                          fontSize: '14px', 
                          color: 'var(--dark-gray)', 
                          marginBottom: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          ⏱️ Prep time: {item.pickupTime}
                        </div>
                      )}
                      
                      {item.extras && item.extras.length > 0 && (
                        <div style={{ fontSize: '14px', color: 'var(--dark-gray)', marginBottom: '8px' }}>
                          <strong>Extras:</strong> {item.extras.map(extra => extra.name).join(', ')}
                        </div>
                      )}

                      <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--red)' }}>
                        E£{(item.price + item.extras.reduce((sum, extra) => sum + (extra.price || 0), 0)).toFixed(2)} each
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-column align-center gap-2">
                      <div className="flex align-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.itemId, item.extras, item.quantity - 1)}
                          className="btn btn-outline"
                          style={{ padding: '4px 8px', fontSize: '14px', minWidth: '32px' }}
                        >
                          -
                        </button>
                        <span style={{ 
                          minWidth: '40px', 
                          textAlign: 'center', 
                          fontWeight: '600',
                          fontSize: '16px'
                        }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.itemId, item.extras, item.quantity + 1)}
                          className="btn btn-outline"
                          style={{ padding: '4px 8px', fontSize: '14px', minWidth: '32px' }}
                        >
                          +
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.itemId, item.extras)}
                        className="btn"
                        style={{
                          backgroundColor: 'var(--error)',
                          color: 'var(--white)',
                          padding: '4px 8px',
                          fontSize: '12px'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pickup Time Selector */}
            <div className="card" style={{ padding: '24px', marginTop: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--black)' }}>
                Select Pickup Time
              </h3>
              <input
                type="time"
                className="form-input"
                value={pickupTime}
                min="01:00"
                max="17:20"
                step="300"
                onChange={e => setPickupTime(e.target.value)}
                style={{ marginBottom: '16px', width: '100%' }}
                required
              />
              <div style={{ fontSize: '12px', color: 'var(--dark-gray)' }}>
                Please select a pickup time between 1:00 AM and 5:20 PM.
              </div>
            </div>

            {/* Order Notes */}
            <div className="card" style={{ padding: '24px', marginTop: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--black)' }}>
                Order Notes (Optional)
              </h3>
              <textarea
                className="form-textarea"
                placeholder="Any special instructions for your order..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="card" style={{ padding: '24px', position: 'sticky', top: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: 'var(--black)' }}>
                Order Summary
              </h3>

              {/* Order Details */}
              <div style={{ marginBottom: '20px' }}>
                <div className="flex justify-between mb-2">
                  <span>Items:</span>
                  <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>E£{getCartTotal().toFixed(2)}</span>
                </div>
                
                {/* Estimated Pickup Time */}
                {cartItems.length > 0 && (
                  <div style={{ 
                    backgroundColor: 'var(--light-gray)', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    marginTop: '12px',
                    fontSize: '14px'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px', color: 'var(--black)' }}>
                      ⏱️ Estimated Preparation Time:
                    </div>
                    <div style={{ color: 'var(--dark-gray)' }}>
                      {(() => {
                        // Get unique pickup times from items
                        const pickupTimes = [...new Set(cartItems.map(item => item.pickupTime).filter(Boolean))];
                        if (pickupTimes.length === 0) return '15-20 minutes (default)';
                        if (pickupTimes.length === 1) return pickupTimes[0];
                        return `${pickupTimes.join(', ')} (varies by item)`;
                      })()}
                    </div>
                  </div>
                )}
              </div>

              <div style={{
                borderTop: '2px solid var(--medium-gray)',
                paddingTop: '16px',
                marginBottom: '24px'
              }}>
                <div className="flex justify-between align-center">
                  <span style={{ fontSize: '18px', fontWeight: '600' }}>Total:</span>
                  <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--red)' }}>
                    E£{getCartTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div style={{ 
                backgroundColor: 'var(--light-gray)', 
                padding: '16px', 
                borderRadius: '8px', 
                marginBottom: '24px',
                fontSize: '14px'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '8px', color: 'var(--black)' }}>
                  Order for:
                </div>
                <div style={{ color: 'var(--dark-gray)' }}>
                  {user?.universityId || user?.email}
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                className={`btn w-full ${loading ? 'btn-disabled' : 'btn-primary'}`}
                disabled={loading}
                style={{ fontSize: '18px', padding: '16px' }}
              >
                {loading ? 'Placing Order...' : 'Place Order 🚀'}
              </button>

              <div style={{ 
                textAlign: 'center', 
                marginTop: '16px', 
                fontSize: '12px', 
                color: 'var(--dark-gray)' 
              }}>
                You'll receive updates about your order status
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

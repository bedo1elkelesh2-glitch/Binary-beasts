import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCart } from '../../context/CartContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MenuPage = () => {
  const [items, setItems] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, food, drink
  const [shopFilter, setShopFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, shopsRes] = await Promise.all([
        axios.get('/api/items'),
        axios.get('/api/shops')
      ]);
      setItems(itemsRes.data);
      setShops(shopsRes.data);
    } catch (error) {
      toast.error('Failed to load menu items');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const typeMatch = filter === 'all' || item.type === filter;
    
    // Shop matching by name instead of ID
    let shopMatch = false;
    if (shopFilter === 'all') {
      shopMatch = true;
    } else {
      // Get the selected shop name
      const selectedShop = shops.find(shop => shop._id === shopFilter);
      const selectedShopName = selectedShop?.shopName;
      
      // Compare shop names
      shopMatch = selectedShopName && item.shopName === selectedShopName;
      
    }
    
    return typeMatch && shopMatch;
  });


  const handleAddToCart = () => {
    if (!selectedItem) return;
    
    addToCart(selectedItem, quantity, selectedExtras);
    toast.success(`Added ${selectedItem.name} to cart!`);
    setSelectedItem(null);
    setSelectedExtras([]);
    setQuantity(1);
  };

  const handleExtraToggle = (extra) => {
    setSelectedExtras(prev => {
      const exists = prev.find(e => e.name === extra.name);
      if (exists) {
        return prev.filter(e => e.name !== extra.name);
      } else {
        return [...prev, extra];
      }
    });
  };

  if (loading) return <LoadingSpinner message="Loading delicious menu..." />;

  return (
    <div style={{ padding: '40px 0', backgroundColor: 'var(--light-gray)', minHeight: 'calc(100vh - 140px)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '700', color: 'var(--red)', marginBottom: '16px' }}>
            🍽️ Campus Menu
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--dark-gray)' }}>
            Discover delicious food and drinks from your favorite campus vendors
          </p>
        </div>


        {/* Filters */}
        <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
          <div className="flex justify-between align-center gap-3" style={{ flexWrap: 'wrap' }}>
            <div className="flex align-center gap-2">
              <span style={{ fontWeight: '600', color: 'var(--black)' }}>Filter by Type:</span>
              <button
                onClick={() => setFilter('all')}
                className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '8px 16px', fontSize: '14px' }}
              >
                All Items
              </button>
              <button
                onClick={() => setFilter('food')}
                className={`btn ${filter === 'food' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '8px 16px', fontSize: '14px' }}
              >
                🍔 Food
              </button>
              <button
                onClick={() => setFilter('drink')}
                className={`btn ${filter === 'drink' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '8px 16px', fontSize: '14px' }}
              >
                🥤 Drinks
              </button>
            </div>

            <div className="flex align-center gap-2">
              <span style={{ fontWeight: '600', color: 'var(--black)' }}>Shop:</span>
              <select
                value={shopFilter}
                onChange={(e) => setShopFilter(e.target.value)}
                className="form-select"
                style={{ padding: '8px 12px', fontSize: '14px', minWidth: '150px' }}
              >
                <option value="all">All Shops</option>
                {shops.map(shop => (
                  <option key={shop._id} value={shop._id}>
                    {shop.shopName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🍽️</div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px', color: 'var(--dark-gray)' }}>
              No items found
            </h3>
            <p style={{ color: 'var(--dark-gray)' }}>
              Try adjusting your filters or check back later for new items.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {filteredItems.map(item => (
              <div key={item._id} className="card" style={{ overflow: 'hidden' }}>
                <div style={{ position: 'relative' }}>
                  {item.image ? (
                    <img
                      src={`http://localhost:5000${item.image}`}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '200px',
                      backgroundColor: 'var(--medium-gray)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '48px'
                    }}>
                      {item.type === 'food' ? '🍔' : '🥤'}
                    </div>
                  )}
                  
                  {!item.isAvailable && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--white)',
                      fontSize: '24px',
                      fontWeight: '700'
                    }}>
                      OUT OF ORDER
                    </div>
                  )}
                  
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: item.type === 'food' ? 'var(--red)' : 'var(--gold)',
                    color: item.type === 'food' ? 'var(--white)' : 'var(--black)',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {item.type === 'food' ? '🍔 FOOD' : '🥤 DRINK'}
                  </div>
                </div>

                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: 'var(--black)' }}>
                    {item.name}
                  </h3>
                  
                  {item.description && (
                    <p style={{ color: 'var(--dark-gray)', marginBottom: '12px', lineHeight: '1.4' }}>
                      {item.description}
                    </p>
                  )}
                  
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--red)' }}>
                      E£{item.price.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex align-center gap-1 mb-2" style={{ fontSize: '14px', color: 'var(--dark-gray)' }}>
                    <span>🏪 {item.shopName}</span>
                  </div>
                  
                  <div className="flex align-center gap-1 mb-3" style={{ fontSize: '14px', color: 'var(--dark-gray)' }}>
                    <span>⏱️ Prep time: {item.pickupTime || '15-20 minutes'}</span>
                  </div>
                  
                  {item.extras && item.extras.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--black)' }}>
                        Available Extras:
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--dark-gray)' }}>
                        {item.extras.map((extra, index) => (
                          <span key={index}>
                            {extra.name} (+E£{extra.price?.toFixed(2) || '0.00'})
                            {index < item.extras.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={() => setSelectedItem(item)}
                    className={`btn w-full ${!item.isAvailable ? 'btn-disabled' : 'btn-primary'}`}
                    disabled={!item.isAvailable}
                  >
                    {!item.isAvailable ? 'Out of Order' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Item Details Modal */}
        {selectedItem && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div className="card" style={{ 
              maxWidth: '500px', 
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <div style={{ padding: '30px' }}>
                <div className="flex justify-between align-center mb-3">
                  <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--red)' }}>
                    {selectedItem.name}
                  </h2>
                  <button
                    onClick={() => {
                      setSelectedItem(null);
                      setSelectedExtras([]);
                      setQuantity(1);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '24px',
                      cursor: 'pointer',
                      color: 'var(--dark-gray)'
                    }}
                  >
                    ✕
                  </button>
                </div>

                {selectedItem.image && (
                  <img
                    src={`http://localhost:5000${selectedItem.image}`}
                    alt={selectedItem.name}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '20px'
                    }}
                  />
                )}

                <div style={{ marginBottom: '20px' }}>
                  <div className="flex align-center gap-1 mb-2">
                    <span>🏪 {selectedItem.shopName}</span>
                  </div>
                  <div className="flex align-center gap-1 mb-2">
                    <span>⏰ {selectedItem.pickupTime}</span>
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--red)' }}>
                    E£{selectedItem.price.toFixed(2)}
                  </div>
                </div>

                {selectedItem.description && (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>Description:</h4>
                    <p style={{ color: 'var(--dark-gray)', lineHeight: '1.6' }}>
                      {selectedItem.description}
                    </p>
                  </div>
                )}

                {/* Extras */}
                {selectedItem.extras && selectedItem.extras.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontWeight: '600', marginBottom: '12px' }}>Extras:</h4>
                    {selectedItem.extras.map((extra, index) => (
                      <label key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '6px',
                        backgroundColor: selectedExtras.find(e => e.name === extra.name) ? 'var(--light-gray)' : 'transparent'
                      }}>
                        <input
                          type="checkbox"
                          checked={selectedExtras.find(e => e.name === extra.name) || false}
                          onChange={() => handleExtraToggle(extra)}
                          style={{ transform: 'scale(1.2)' }}
                        />
                        <span style={{ flex: 1 }}>{extra.name}</span>
                        <span style={{ fontWeight: '600', color: 'var(--red)' }}>
                          +E£{extra.price?.toFixed(2) || '0.00'}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Quantity */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontWeight: '600', marginBottom: '12px' }}>Quantity:</h4>
                  <div className="flex align-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="btn btn-outline"
                      style={{ padding: '8px 12px', fontSize: '18px' }}
                    >
                      -
                    </button>
                    <span style={{ 
                      padding: '8px 16px', 
                      fontSize: '18px', 
                      fontWeight: '600',
                      minWidth: '60px',
                      textAlign: 'center'
                    }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="btn btn-outline"
                      style={{ padding: '8px 12px', fontSize: '18px' }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'var(--light-gray)', borderRadius: '8px' }}>
                  <div className="flex justify-between align-center">
                    <span style={{ fontWeight: '600' }}>Total:</span>
                    <span style={{ fontSize: '20px', fontWeight: '700', color: 'var(--red)' }}>
                      E£{((selectedItem.price + selectedExtras.reduce((sum, extra) => sum + (extra.price || 0), 0)) * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button onClick={handleAddToCart} className="btn btn-primary w-full">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;

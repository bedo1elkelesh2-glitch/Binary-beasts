import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const cartItemCount = getCartItemCount();

  return (
    <nav style={{
      backgroundColor: 'var(--white)',
      boxShadow: '0 2px 8px var(--shadow)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container">
        <div className="flex justify-between align-center" style={{ height: '70px' }}>
          {/* Logo */}
          <Link 
            to="/" 
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: 'var(--red)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <img
              src="/giu-logo.png"
              alt="GIU Logo"
              style={{ height: '32px', width: '32px', objectFit: 'contain' }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            GIU Food Court
          </Link>

          {/* Desktop Navigation */}
          <div className="flex align-center gap-2" style={{ display: window.innerWidth > 768 ? 'flex' : 'none' }}>
            {isAuthenticated ? (
              <>
                {user?.role === 'customer' && (
                  <>
                    <Link to="/menu" className="btn btn-outline">
                      Browse Menu
                    </Link>
                    <Link 
                      to="/cart" 
                      className="btn btn-secondary"
                      style={{ position: 'relative' }}
                    >
                      🛒 Cart
                      {cartItemCount > 0 && (
                        <span style={{
                          position: 'absolute',
                          top: '-5px',
                          right: '-5px',
                          backgroundColor: 'var(--red)',
                          color: 'var(--white)',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {cartItemCount}
                        </span>
                      )}
                    </Link>
                    <Link to="/orders" className="btn btn-outline">
                      My Orders
                    </Link>
                  </>
                )}
                
                {user?.role === 'shop' && (
                  <Link to="/shop/dashboard" className="btn btn-outline">
                    Shop Dashboard
                  </Link>
                )}
                
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard" className="btn btn-outline">
                    Admin Dashboard
                  </Link>
                )}
                
                <div style={{
                  padding: '8px 16px',
                  backgroundColor: 'var(--light-gray)',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}>
                  👋 {user?.username || user?.shopName || user?.email || user?.universityId}
                </div>
                
                <button onClick={handleLogout} className="btn btn-primary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              display: window.innerWidth <= 768 ? 'block' : 'none',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ☰
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div style={{
            display: window.innerWidth <= 768 ? 'block' : 'none',
            backgroundColor: 'var(--white)',
            borderTop: '1px solid var(--medium-gray)',
            padding: '20px 0'
          }}>
            <div className="flex flex-column gap-2">
              {isAuthenticated ? (
                <>
                  {user?.role === 'customer' && (
                    <>
                      <Link 
                        to="/menu" 
                        className="btn btn-outline"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Browse Menu
                      </Link>
                      <Link 
                        to="/cart" 
                        className="btn btn-secondary"
                        onClick={() => setIsMenuOpen(false)}
                        style={{ position: 'relative' }}
                      >
                        🛒 Cart
                        {cartItemCount > 0 && (
                          <span style={{
                            marginLeft: '8px',
                            backgroundColor: 'var(--red)',
                            color: 'var(--white)',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            fontSize: '12px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {cartItemCount}
                          </span>
                        )}
                      </Link>
                      <Link 
                        to="/orders" 
                        className="btn btn-outline"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                    </>
                  )}
                  
                  {user?.role === 'shop' && (
                    <Link 
                      to="/shop/dashboard" 
                      className="btn btn-outline"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Shop Dashboard
                    </Link>
                  )}
                  
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin/dashboard" 
                      className="btn btn-outline"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  
                  <div style={{
                    padding: '12px',
                    backgroundColor: 'var(--light-gray)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    textAlign: 'center'
                  }}>
                    👋 {user?.username || user?.shopName || user?.email || user?.universityId}
                  </div>
                  
                  <button onClick={handleLogout} className="btn btn-primary">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="btn btn-outline"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn btn-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

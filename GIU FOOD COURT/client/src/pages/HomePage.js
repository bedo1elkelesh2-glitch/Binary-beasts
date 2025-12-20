import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div style={{ minHeight: 'calc(100vh - 140px)' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--red) 0%, var(--black) 100%)',
        color: 'var(--white)',
        padding: '80px 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            🍽️ Welcome to GIU Food Court
          </h1>
          <p style={{
            fontSize: '20px',
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px auto',
            lineHeight: '1.6'
          }}>
            Order delicious food and drinks from your favorite campus vendors. 
            Quick, easy, and convenient dining for the GIU community.
          </p>
          <div className="flex justify-center gap-2" style={{ flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-secondary" style={{ fontSize: '18px', padding: '16px 32px' }}>
              Get Started 🚀
            </Link>
            <Link to="/login" className="btn btn-outline" style={{ 
              fontSize: '18px', 
              padding: '16px 32px',
              backgroundColor: 'transparent',
              color: 'var(--white)',
              border: '2px solid var(--white)'
            }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--white)' }}>
        <div className="container">
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '50px',
            color: 'var(--black)'
          }}>
            Why Choose GIU Food Court?
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            marginBottom: '60px'
          }}>
            {/* For Students */}
            <div className="card feature-card" style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎓</div>
              <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: 'var(--red)' }}>
                For Students
              </h3>
              <ul style={{ textAlign: 'left', lineHeight: '1.8', color: 'var(--dark-gray)' }}>
                <li>🔐 Secure login with university ID</li>
                <li>🍔 Browse all campus food options</li>
                <li>⏰ Set pickup time and view shop info</li>
                <li>🛒 Easy ordering with extras</li>
                <li>📱 Track your order status</li>
              </ul>
            </div>

            {/* For Vendors */}
            <div className="card feature-card" style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏪</div>
              <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: 'var(--red)' }}>
                For Vendors
              </h3>
              <ul style={{ textAlign: 'left', lineHeight: '1.8', color: 'var(--dark-gray)' }}>
                <li>🆔 Simple registration with university ID</li>
                <li>📸 Upload food images and details</li>
                <li>🎛️ Manage menu and availability</li>
                <li>📞 Receive orders with contact info</li>
                <li>⚡ Real-time order management</li>
              </ul>
            </div>

            {/* For Admins */}
            <div className="card feature-card" style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>👨‍💼</div>
              <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: 'var(--red)' }}>
                For Admins
              </h3>
              <ul style={{ textAlign: 'left', lineHeight: '1.8', color: 'var(--dark-gray)' }}>
                <li>🔒 Secure admin access control</li>
                <li>👥 Monitor all registered shops</li>
                <li>📊 View all orders and analytics</li>
                <li>📋 JSON-style data display</li>
                <li>👀 Read-only monitoring system</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--light-gray)' }}>
        <div className="container">
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '50px',
            color: 'var(--black)'
          }}>
            How It Works
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: 'var(--red)',
                color: 'var(--white)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                margin: '0 auto 20px auto'
              }}>
                1
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
                Sign Up
              </h3>
              <p style={{ color: 'var(--dark-gray)', lineHeight: '1.6' }}>
                Register with your university credentials and referral code
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: 'var(--gold)',
                color: 'var(--black)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                margin: '0 auto 20px auto'
              }}>
                2
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
                Browse & Order
              </h3>
              <p style={{ color: 'var(--dark-gray)', lineHeight: '1.6' }}>
                Explore menu items, add extras, and place your order
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: 'var(--black)',
                color: 'var(--white)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                margin: '0 auto 20px auto'
              }}>
                3
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
                Pick Up
              </h3>
              <p style={{ color: 'var(--dark-gray)', lineHeight: '1.6' }}>
                Get notified when ready and pick up your delicious order
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--gold) 0%, var(--red) 100%)',
        padding: '60px 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '20px',
            color: 'var(--white)'
          }}>
            Ready to Get Started?
          </h2>
          <p style={{
            fontSize: '18px',
            marginBottom: '30px',
            color: 'var(--white)',
            opacity: 0.9
          }}>
            Join the GIU Food Court community today!
          </p>
          <Link to="/register" className="btn" style={{
            backgroundColor: 'var(--white)',
            color: 'var(--red)',
            fontSize: '18px',
            padding: '16px 32px',
            fontWeight: '600'
          }}>
            Sign Up Now 🎉
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

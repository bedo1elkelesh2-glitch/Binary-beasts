import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    universityId: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    username: '',
    role: 'customer',
    referralCode: '',
    shopName: '',
    shopContact: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const result = await register(formData);
      if (result.success) {
        toast.success('Registration successful! Welcome to GIU Food Court!');
        // Navigation will be handled by the ProtectedRoute logic in App.js
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const getReferralCodeHint = () => {
    switch (formData.role) {
      case 'customer':
        return '';
      case 'shop':
        return '';
      case 'admin':
        return '';
      default:
        return 'Select your role to see the referral code';
    }
  };

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 140px)',
      background: 'linear-gradient(135deg, var(--light-gray) 0%, var(--white) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div className="card" style={{ 
        width: '100%', 
        maxWidth: '500px',
        padding: '40px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: 'var(--red)',
            marginBottom: '8px'
          }}>
            Join GIU Food Court! 🎉
          </h1>
          <p style={{ color: 'var(--dark-gray)', fontSize: '16px' }}>
            Create your account to get started
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="form-group">
            <label htmlFor="role" className="form-label">
              Account Type *
            </label>
            <select
              id="role"
              name="role"
              className="form-select"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="customer">🎓 Student/Staff (Customer)</option>
              <option value="shop">🏪 Vendor/Restaurant</option>
              <option value="admin">👨‍💼 Admin</option>
            </select>
          </div>

          {/* University ID (required for all roles by backend) */}
          <div className="form-group">
            <label htmlFor="universityId" className="form-label">
              University ID *
            </label>
            <input
              type="text"
              id="universityId"
              name="universityId"
              className="form-input"
              placeholder="Enter your university ID"
              value={formData.universityId}
              onChange={handleChange}
              required
            />
          </div>

          {/* Customer-specific fields */}
          {formData.role === 'customer' && (
            <>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumber" className="form-label">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  className="form-input"
                  placeholder="Customer contact phone"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          {/* Shop-specific fields */}
          {formData.role === 'shop' && (
            <>
              <div className="form-group">
                <label htmlFor="phoneNumber" className="form-label">
                  Shop Phone Number *
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  className="form-input"
                  placeholder="Shop contact phone"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="shopName" className="form-label">
                  Shop Name *
                </label>
                <input
                  type="text"
                  id="shopName"
                  name="shopName"
                  className="form-input"
                  placeholder="Your restaurant/shop name"
                  value={formData.shopName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="shopContact" className="form-label">
                  Shop Contact Info *
                </label>
                <input
                  type="text"
                  id="shopContact"
                  name="shopContact"
                  className="form-input"
                  placeholder="Location or additional contact info"
                  value={formData.shopContact}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          {/* Admin-specific fields */}
          {formData.role === 'admin' && (
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-input"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* Password fields */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-input"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Referral Code */}
          <div className="form-group">
            <label htmlFor="referralCode" className="form-label">
              Referral Code *
            </label>
            <input
              type="text"
              id="referralCode"
              name="referralCode"
              className="form-input"
              placeholder="Enter referral code"
              value={formData.referralCode}
              onChange={handleChange}
              required
            />
            {getReferralCodeHint() && (
              <small style={{ 
                color: 'var(--gold)', 
                fontSize: '12px', 
                fontWeight: '500',
                display: 'block',
                marginTop: '4px'
              }}>
                💡 {getReferralCodeHint()}
              </small>
            )}
          </div>

          <button
            type="submit"
            className={`btn w-full ${loading ? 'btn-disabled' : 'btn-primary'}`}
            disabled={loading}
            style={{ marginTop: '20px' }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid var(--medium-gray)'
        }}>
          <p style={{ color: 'var(--dark-gray)', marginBottom: '16px' }}>
            Already have an account?
          </p>
          <Link to="/login" className="btn btn-outline w-full">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

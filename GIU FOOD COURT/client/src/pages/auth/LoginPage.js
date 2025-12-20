import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    universityId: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData);
      if (result.success) {
        toast.success('Login successful!');
        // Navigation will be handled by the ProtectedRoute logic in App.js
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
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
        maxWidth: '400px',
        padding: '40px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: 'var(--red)',
            marginBottom: '8px'
          }}>
            Welcome Back! 👋
          </h1>
          <p style={{ color: 'var(--dark-gray)', fontSize: '16px' }}>
            Sign in to your GIU Food Court account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
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

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className={`btn w-full ${loading ? 'btn-disabled' : 'btn-primary'}`}
            disabled={loading}
            style={{ marginTop: '20px' }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid var(--medium-gray)'
        }}>
          <p style={{ color: 'var(--dark-gray)', marginBottom: '16px' }}>
            Don't have an account?
          </p>
          <Link to="/register" className="btn btn-outline w-full">
            Create Account
          </Link>
        </div>

        {/* Role Info */}
        <div style={{ 
          marginTop: '30px',
          padding: '20px',
          backgroundColor: 'var(--light-gray)',
          borderRadius: '8px',
          fontSize: '14px',
          color: 'var(--dark-gray)'
        }}>
          <h4 style={{ fontWeight: '600', marginBottom: '12px', color: 'var(--black)' }}>
            Account Types:
          </h4>
          <div style={{ lineHeight: '1.6' }}>
            <div>🎓 <strong>Student/Staff:</strong> Browse & order food</div>
            <div>🏪 <strong>Vendor:</strong> Manage your restaurant</div>
            <div>👨‍💼 <strong>Admin:</strong> Monitor the platform</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

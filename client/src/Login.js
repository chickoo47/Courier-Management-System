import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [loginMode, setLoginMode] = useState('admin'); // 'admin' or 'customer'
  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    password: ''
  });
  const [customerCredentials, setCustomerCredentials] = useState({
    name: '',
    billNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Hardcoded admin credentials
    if (adminCredentials.username === 'Aryan M' && adminCredentials.password === '1234567') {
      setTimeout(() => {
        onLogin('admin', { username: 'Aryan M' });
        setLoading(false);
      }, 500);
    } else {
      setError('Invalid admin credentials. Please try again.');
      setLoading(false);
    }
  };

  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Verify customer exists with this name and bill number
      const response = await fetch(
        `http://localhost:5001/api/couriers/track?billNumber=${customerCredentials.billNumber}&name=${customerCredentials.name}`
      );
      
      const data = await response.json();
      
      if (data.success && data.courier) {
        onLogin('customer', {
          name: customerCredentials.name,
          billNumber: customerCredentials.billNumber,
          courier: data.courier
        });
      } else {
        setError('No order found with this name and bill number. Please check your details.');
      }
    } catch (err) {
      setError('Unable to connect to the server. Please try again later.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>🚚 Courier Management System</h1>
          <p>Please login to continue</p>
        </div>

        {/* Login Mode Toggle */}
        <div className="login-mode-toggle">
          <button
            className={`mode-btn ${loginMode === 'admin' ? 'active' : ''}`}
            onClick={() => {
              setLoginMode('admin');
              setError('');
            }}
          >
            🔐 Admin Login
          </button>
          <button
            className={`mode-btn ${loginMode === 'customer' ? 'active' : ''}`}
            onClick={() => {
              setLoginMode('customer');
              setError('');
            }}
          >
            👤 Customer Login
          </button>
        </div>

        {/* Admin Login Form */}
        {loginMode === 'admin' && (
          <form onSubmit={handleAdminLogin} className="login-form">
            <div className="form-group">
              <label>👤 Username</label>
              <input
                type="text"
                value={adminCredentials.username}
                onChange={(e) => setAdminCredentials({
                  ...adminCredentials,
                  username: e.target.value
                })}
                placeholder="Enter admin username"
                required
              />
            </div>

            <div className="form-group">
              <label>🔒 Password</label>
              <input
                type="password"
                value={adminCredentials.password}
                onChange={(e) => setAdminCredentials({
                  ...adminCredentials,
                  password: e.target.value
                })}
                placeholder="Enter password"
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login as Admin'}
            </button>

            <div className="demo-credentials">
              <p>🔑 Demo Admin Credentials:</p>
              <p><strong>Username:</strong> Aryan M</p>
              <p><strong>Password:</strong> 1234567</p>
            </div>
          </form>
        )}

        {/* Customer Login Form */}
        {loginMode === 'customer' && (
          <form onSubmit={handleCustomerLogin} className="login-form">
            <div className="form-group">
              <label>👤 Your Name</label>
              <input
                type="text"
                value={customerCredentials.name}
                onChange={(e) => setCustomerCredentials({
                  ...customerCredentials,
                  name: e.target.value
                })}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label>📋 Bill Number</label>
              <input
                type="text"
                value={customerCredentials.billNumber}
                onChange={(e) => setCustomerCredentials({
                  ...customerCredentials,
                  billNumber: e.target.value
                })}
                placeholder="Enter your bill number (e.g., BILL-1001)"
                required
              />
            </div>

            <button type="submit" className="login-btn customer" disabled={loading}>
              {loading ? 'Verifying...' : 'Track My Order'}
            </button>

            <div className="demo-credentials">
              <p>🔑 Try with sample order:</p>
              <p><strong>Name:</strong> John Doe</p>
              <p><strong>Bill Number:</strong> BILL-1001</p>
            </div>
          </form>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span>⚠️</span> {error}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="login-footer">
        <p>🎓 Database Lab Project - Courier Management System</p>
        <p>Built with React + Node.js + Express + MySQL</p>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import '../Pages/CSS/Login.css';
import adminApi from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@jalmitra.com');
  const [password, setPassword] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await adminApi.login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('admin@jalmitra.com');
    setPassword('admin');
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        {/* Left Side Branding */}
        <div className="login-brand-side">
          <div className="brand-logo-circle">
            💧
          </div>
          <h2>JalMitra</h2>
          <p className="brand-badge">Super Admin Portal</p>
          <div className="brand-features">
            <div className="feat-item">✓ Complete Platform Analytics</div>
            <div className="feat-item">✓ Real-time Order Monitoring</div>
            <div className="feat-item">✓ Supplier Approvals & Blocking</div>
            <div className="feat-item">✓ Subscription Plan Management</div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="login-form-side">
          <div className="form-header">
            <h3>Admin Sign In</h3>
            <p>Access your central control dashboard</p>
          </div>

          {error && (
            <div className="login-error-alert">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="admin-form">
            <div className="form-group">
              <label>Admin Email</label>
              <div className="input-group">
                <span className="input-icon"><FaEnvelope /></span>
                <input
                  type="email"
                  placeholder="admin@jalmitra.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-group">
                <span className="input-icon"><FaLock /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-pwd-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>

            <div className="demo-credentials-box">
              <span>Demo Login:</span>
              <button type="button" onClick={fillDemo} className="fill-demo-btn">
                admin@jalmitra.com / admin
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

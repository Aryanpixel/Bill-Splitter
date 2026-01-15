import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleClick = (page) => {
    navigate(page);
  };

  // login handling
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // storing user
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/Dashboard');

      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Server error. Please try again.');
    }
  };

  return (
    <div className="login-page">
      
      {/* LEFT SIDE: Form */}
      <div className="login-split login-form-container">
        <a onClick={() => handleClick('/')} className="login-back-link">
          ← Back to home
        </a>
        
        <div className="login-header">
          <div className="login-brand">
            <div className="brand-icon">S</div>
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
              SplitX
            </span>
          </div>
          <h2 className="login-title">Welcome back</h2>
          <p className="login-subtitle">
            Enter your credentials to access your account
          </p>
        </div>

        {/* ✅ onSubmit added */}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-group">
            <label className="login-label">Email</label>
            <input
              type="email"
              className="login-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-group">
            <label className="login-label">Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="login-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-signin">
            Sign In
          </button>
        </form>

        <p className="signup-redirect">
          Don't have an account?{' '}
          <a onClick={() => handleClick('/Signup')} className="link-primary">
            Sign up free
          </a>
        </p>
      </div>

      {/* RIGHT SIDE: Visual */}
      <div className="login-split login-visual">
        <div className="visual-content">
          <h2 className="visual-title">Track expenses together</h2>
          <p className="visual-desc">
            Keep track of shared expenses, balances, and who owes whom.
            No more awkward money conversations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

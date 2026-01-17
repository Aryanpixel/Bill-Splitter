import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // --- CHANGE 1: Add State for Form Data ---
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // --- CHANGE 2: Function to handle typing ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  const handleSignup = async (e) => {
    e.preventDefault(); // Stop page from refreshing

    try {
      const response = await fetch('http://localhost:5000/api/auth/Signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account Created Successfully!");
        navigate('/login'); // Send user to login page
      } else {
        alert("Error: " + data.message); // Show backend error (e.g. "User already exists")
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server is not running. Please start backend.");
    }
  };

  return (
    <div className="signup-page">
      
      {/* LEFT SIDE: Visual */}
      <div className="signup-split signup-visual">
        <div className="visual-content">
          <h2 className="visual-title">Start splitting smarter today</h2>
          <div className="benefit-list">
            <div className="benefit-item"><div className="check-icon">✓</div> Create unlimited groups</div>
            <div className="benefit-item"><div className="check-icon">✓</div> Track all shared expenses</div>
            <div className="benefit-item"><div className="check-icon">✓</div> Smart balance calculations</div>
            <div className="benefit-item"><div className="check-icon">✓</div> Works offline</div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="signup-split signup-form-container">
        <a onClick={() => navigate('/')} className="signup-back-link">← Back to home</a>
        
        <div className="signup-header">
          <div className="signup-brand">
            <div className="brand-icon">S</div>
            <span style={{fontWeight: 'bold', fontSize: '1.2rem'}}>SplitX</span>
          </div>
          <h2 className="signup-title">Create an account</h2>
          <p className="signup-subtitle">Get started for free. No credit card required.</p>
        </div>

        {/* --- CHANGE 4: Add onSubmit to form --- */}
        <form className="signup-form" onSubmit={handleSignup}>
          <div className="signup-group">
            <label className="signup-label">Full Name</label>
            {/* Added name, value, onChange */}
            <input 
              type="text" 
              name="name"
              className="signup-input" 
              placeholder="John Doe" 
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="signup-group">
            <label className="signup-label">Email</label>
            {/* Added name, value, onChange */}
            <input 
              type="email" 
              name="email"
              className="signup-input" 
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="signup-group">
            <label className="signup-label">Password</label>
            <div className="input-wrapper">
              {/* Added name, value, onChange */}
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                className="signup-input" 
                placeholder="Create a password" 
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <span style={{fontSize: '0.8rem', color: '#94a3b8'}}>Minimum 8 characters</span>
          </div>

          <button type="submit" className="btn-signup" >Create Account</button>
        </form>

        <p className="login-redirect">
          Already have an account? <a onClick={() => navigate('/Login')} className="link-primary">Sign in</a>
        </p>
      </div>

    </div>
  );
};

export default Signup;
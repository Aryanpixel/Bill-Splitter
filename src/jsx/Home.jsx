import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';


function Home() {
  const navigate = useNavigate();


  return (
    <div className="landing-page">
      
      {/*  --- Navbar --- */}
      <nav className="navbar">
        <div className="logo-container">
          <div className="logo-icon">S</div>
          <span className="logo-text">SplitX</span>
        </div>
        <div className="nav-buttons">
          <button onClick={() => navigate('/Login')} className="btn-login">Login</button>
          <button onClick={() => navigate('/Signup')} className="btn-primary small">Get Started</button>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className="hero-section">
        <div className="hero-content">
          <div className="badge">
            <span className="sparkle">✨</span> Split expenses effortlessly
          </div>
          
          <h1 className="main-heading">
            Split Bills, <span className="text-gradient">Not <br /> Friendships</span>
          </h1>
          
          <p className="sub-heading">
            The easiest way to share expenses with roommates, trips, and more. 
            Track who paid what and settle up with ease.
          </p>
          
          <div className="cta-group">
            <button onClick={() => navigate('/Signup')} className="btn-primary">Start Splitting Free →</button>
            <button onClick={() => navigate('/Login')} className="btn-outline">I Have an Account</button>
          </div>
        </div>
      </header>

      {/* --- Features Section (How It Works) --- */}
      <section className="features-section">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Simple, transparent expense tracking for any group</p>
        </div>

        <div className="cards-grid">
          {/* Card 1 */}
          <div className="feature-card">
            <div className="icon-box blue">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3>Create a Group</h3>
            <p>Set up a group for your roommates, trip buddies, or any shared expense situation.</p>
          </div>

          {/* Card 2 */}
          <div className="feature-card">
            <div className="icon-box purple">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3>Add Expenses</h3>
            <p>Log expenses as they happen. Specify who paid and how to split the cost.</p>
          </div>

          {/* Card 3 */}
          <div className="feature-card">
            <div className="icon-box blue-light">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3>Settle Up</h3>
            <p>See exactly who owes whom. Minimize transactions with smart calculations.</p>
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="cta-section">
        <h2>Ready to simplify your shared expenses?</h2>
        <p>Join thousands of groups already using SplitWise to keep their finances fair and friendships intact.</p>
        <button onClick={() => navigate('/Signup')} className="btn-primary large">Get Started Now →</button>
      </section>

      {/* --- Footer --- */}
      <footer className="footer">
        <p>&copy; 2025 SplitX.  Split smarter, not harder.</p>
      </footer>
    </div>
  );
}

export default Home;
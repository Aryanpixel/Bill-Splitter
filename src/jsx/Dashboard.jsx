import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {


//! Navigation handling
  const navigate = useNavigate();

//! User data accessing
  const[UserName, setUserName]= useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser || storedUser === 'undefined') {
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(storedUser)

      setUserName(user.name || '');
    } catch (error) {
      navigate('/login');
    }
  }, [navigate]);

//! Group Data showing

  const [groups, setGroups] = useState([]);
  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  if(!user) return navigate("/Login");

  fetch(`${import.meta.env.VITE_API_URL}/api/auth/dashboard/${user.id}`)
    .then(res => res.json())
    .then(data => {setGroups(Array.isArray(data) ? data : []) })
    .catch(err => console.error(err));
  }, [navigate]);


//! Expense Data fetching
  const [summary, setSummary] = useState({
  youAreOwed: 0,
  youOwe: 0,
  netBalance: 0
  });

useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser?.id) {
    fetch(`${import.meta.env.VITE_API_URL}/api/auth/dashboardSummary/${storedUser.id}`)
      .then(res => res.json())
      .then(data => setSummary(data))
      .catch((err) => console.error("Summary fetch error:", err));
  }
}, []);


//! activity access
  const [activity, setActivity] = useState({
    expenses: [],
    payments: []
  });
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.id) {
      fetch(`${import.meta.env.VITE_API_URL}/api/auth/activity/${storedUser.id}`)
        .then(res => res.json())
        .then(data => setActivity(data))
        .catch((err) => console.error("Activity fetch error:", err));
    }
  }, []);


  return (
    <div className="dashboard-container">
      {/* Top Navbar */}
      <nav className="top-navbar">
        <div className="nav-brand"><div className="brand-logo">S</div> SplitWise</div>
        <div className="nav-center">
          <a onClick={() => navigate('/Dashboard')} className="nav-link active">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            <span>Dashboard</span>
          </a>
          <a onClick={() => navigate('/GroupList')} className="nav-link">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <span>Groups</span>
          </a>
          <a onClick={() => navigate('/Profile')} className="nav-link">
             <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
             <span>Profile</span>
          </a>
        </div>
        <div className="nav-right">
          <span>Hey, {UserName}</span>
          <div className="logout-btn" onClick={() => navigate('/login')}>
             <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <header className="page-header">
          <div>
            <h1>Welcome back, {UserName}!</h1>
            <p className="subtitle">Here's your expense summary.</p>
          </div>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">💰You Are Owed</div>
            <div className="stat-value text-green">₹{summary.youAreOwed.toFixed(2)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">💸You Owe</div>
            <div className="stat-value text-red">₹{summary.youOwe.toFixed(2)} </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">⚖️Net Balance</div>
            <div className={`stat-value ${summary.netBalance >= 0 ? "text-green" : "text-red"}`}>
                ₹{summary.netBalance.toFixed(2)}</div>
          </div>
        </div>

        <div className="dashboard-content-grid">
          <div>
            <div className="section-header">
              <h3>Your Groups</h3>
              <a className="view-all-link" onClick={() => navigate('/GroupList')}>View all →</a>
            </div>
            <div className="stat-card empty-state-card"  onClick={() => navigate('/Groups')}>
                {groups.length === 0 ? (
                <>
                <div className="empty-state-icon">
                    <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <p className="empty-title">No groups yet</p>
                <p className="empty-desc">Create your first group to start splitting expenses</p>
                </> 
              ) : (
                Array.isArray(groups) && groups.map(group => (
                  <div
                    key={group._id}
                    className="group-card"
                    onClick={() => navigate(`/Groups/${group._id}`)}
                  >
                    <div className="group-card-left">
                      <div className="group-avatar">
                        {group.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="group-info">
                        <h4 className="group-name" >{group.name}</h4>
                        <p className="group-meta">
                            {group.members.length} members
                            {group.joinCode && <> • Code: {group.joinCode}</>}
                        </p>
                      </div>
                    </div>

                    <div className="group-card-arrow">→</div>
                  </div>
                )))}
            </div>      
               <button className="btn-primary btn-icon" onClick={() => navigate('/CreateGroup')}>
                 <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                 Create Group
               </button>
          </div>
          <div>
            <h3>Recent Expenses</h3>
            <div className="stat-card activity-card">
              {activity.expenses.length === 0 && activity.payments.length === 0 ? (
                <div className="empty-history">No recent activity</div>
              ) : (
                <div className="activity-list">
                  {activity.expenses.map((e, i) => (
                    <div key={`exp-${i}`} className="activity-item expense">
                      <div className="activity-icon">💸</div>
                      <div className="activity-text">
                        <strong>You paid ₹{e.amount}</strong>
                        <span>in {e.group.name}</span>
                      </div>
                    </div>
                  ))}

                  {activity.payments.map((p, i) => (
                    <div key={`pay-${i}`} className="activity-item payment">
                      <div className="activity-icon">💰</div>
                      <div className="activity-text">
                        <strong>You paid ₹{p.amount}</strong>
                        <span>to {p.to.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default Dashboard;
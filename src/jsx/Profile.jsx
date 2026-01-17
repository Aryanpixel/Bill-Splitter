import React from 'react';
import { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const Profile = () => {
 const navigate = useNavigate();
  const [UserName, setUserName] = useState("");
  const [UserEmail, setUserEmail] = useState("");
  const [UserId, setUserId] = useState(""); // Add UserId state

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUserName(storedUser.name);
      setUserEmail(storedUser.email);
      setUserId(storedUser.id); // Set UserId from local storage
    } catch (error) {
      navigate("/Login");
    }
  }, [navigate]);

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure? This will permanently delete your account and all your data from all groups. This action cannot be undone."
    );

    if (confirmDelete) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/delete-account/${UserId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert("Account deleted successfully.");
          localStorage.removeItem("user"); // Clear local session
          navigate("/Signup");
        } else {
          const data = await response.json();
          alert(data.message || "Failed to delete account.");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };


  return (
    <div className="dashboard-container">
      <nav className="top-navbar">
        <div className="nav-brand"><div className="brand-logo">S</div> SplitWise</div>
        <div className="nav-center">
          <a onClick={() => handleClick('/Dashboard')} className="nav-link">Dashboard</a>
          <a onClick={() => handleClick('/GroupList')} className="nav-link">Groups</a>
          <a onClick={() => handleClick('/Profile')} className="nav-link active">Profile</a>
        </div>
        <div className="nav-right"><span>Hey, {UserName}</span></div>
      </nav>

      <main className="main-content">
        <div className="page-header-center">
          <h1>Profile Settings</h1>
          <p className="subtitle">Manage your account information</p>
        </div>

        <div className="center-container">
          <div className="form-card">
             <div className="profile-section">
               <h3>Personal Information</h3>
               <p className="subtitle">Update your personal details here</p>
             </div>
             <div className="profile-avatar-row">
               <div className="avatar-large">{UserName.charAt(0)}</div>
               <div><div className="profile-details-name">{UserName}</div><div className="profile-details-email">{UserEmail}</div></div>
             </div>
             <div className="form-group">
               <label className="form-label">Full Name</label>
               <input type="text" className="form-input" defaultValue={`${UserName}`} />
             </div>
             <div className="form-group">
               <label className="form-label">Email Address</label>
               <input type="email" className="form-input" defaultValue= {`${UserEmail}`} />
             </div>
             <button className="btn-primary btn-full">Save Changes</button>

          <div>
            {/* Add Delete Section */}
             <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
               <h3 style={{ color: '#d9534f' }}>Danger Zone</h3>
               <p className="subtitle">Once you delete your account, there is no going back.</p>
               <button 
                 onClick={handleDeleteAccount} 
                 className="btn-full" 
                 style={{ backgroundColor: '#d9534f', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}
               >
                 Delete Account
               </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default Profile;


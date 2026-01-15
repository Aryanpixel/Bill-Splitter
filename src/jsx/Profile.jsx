import React from 'react';
import { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const Profile = () => {
  const navigate = useNavigate();

  const handleClick = (page) => {
    //  to change the URL to the specified page
    navigate(page); 
  };

  const[UserName, setUserName]= useState("");
  const[UserEmail, setUserEmail] = useState("");
  useEffect(() => {

    try{
      const storedUser =JSON.parse(localStorage.getItem("user"))
      setUserName(storedUser.name)
      setUserEmail(storedUser.email)
    } catch (error){
      navigate("/Login");
    }
    
  },[navigate]);


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
          </div>
        </div>
      </main>
    </div>
  );
};
export default Profile;
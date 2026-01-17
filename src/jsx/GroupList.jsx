import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/GroupList.css';

const GroupList = () => {
  const navigate = useNavigate();

  const handleClick = (page) => {
    navigate(page); 
  };

  const [groups, setGroups] = useState("")

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/login");

    fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/groups/${user.id}?email=${user.email}`
    )
      .then(res => res.json())
      .then(data => {
        setGroups(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error(err));
  }, []);
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
  

  return (
    <div className="dashboard-container">
      <nav className="top-navbar">
        <div className="nav-brand"><div className="brand-logo">S</div> SplitX</div>
        <div className="nav-center">
          <a onClick={() => handleClick('/Dashboard')} className="nav-link">Dashboard</a>
          <a onClick={() => handleClick('/Groups')} className="nav-link active">Groups</a>
          <a onClick={() => handleClick('/Profile')} className="nav-link">Profile</a>
        </div>
        <div className="nav-right"><span>Hey, {UserName}</span></div>
      </nav>

      <main className="main-content">
        <div className="page-header">
          <div>
          <a onClick={() => handleClick('/Dashboard')} className="back-link">← Back to Dashboard</a>

            <h1>Your Groups</h1>
            <p className="subtitle">Manage your expense groups</p>
          </div>
          <div style={{display: 'flex', gap: '12px'}}>
             <a onClick={() => handleClick('/JoinGroup')} className="btn-outline">🔗 Join Group</a>
             <a onClick={() => handleClick('/CreateGroup')} className="btn-primary">+ Create Group</a>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {groups.length === 0 ? (
            <div style={{ color: '#64748b', marginTop: '20px' }}>
              No groups found
            </div>
          ) : (
            groups.map((group) => (
              <a
                key={group._id}
                onClick={() => handleClick(`/Groups/${group._id}`)}
                className="group-list-item"
              >
                <div className="group-item-left">
                  <div className="group-icon-box bg-blue">
                    {group.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div className="group-info-title">{group.name}</div>
                    <div className="group-info-sub">
                      {group.members.length} members • Code: {group.joinCode}
                    </div>
                  </div>
                </div>
                <div> → </div>
              </a>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
export default GroupList;
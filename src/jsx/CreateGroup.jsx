import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateGroup.css';

const CreateGroup = () => {

  // Handling Navigation
  const navigate = useNavigate();

  const handleClick = (page) => {
    navigate(page); 
  };  

  // handling access of user data
  const[user, setUser] = useState(null);

  useEffect(() => {
    try{
      const storedUser =JSON.parse(localStorage.getItem("user"))
      if(storedUser){
        setUser(storedUser)
      } else {
        navigate("/Login");
      }
    } catch (error){
      navigate("/Login");
    }    
  },[navigate]);

/*--------------------------------------------------------------------------------------*/

  const [selectedType, setSelectedType] = useState('hostel');
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([
    {name: "", email:""},
    {name: "", email:""}
  ]);

  const handleMemberChange = (index, field, value) => {  //Handling Input for added member
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  const addMemberSlot = () => {
    setMembers([...members, { name: '', email: '' }]);  // function for adding member
  };

/*--------------------------------------------------------------------------------------*/

  const handleGroup = async (e) => {
    e.preventDefault();

    if(!user) return alert("User Not Found. Please Login Again");

const cleanMembers = members
  .filter(m => m.email)   // keep filled rows
  .map(m => ({
    name: m.name.trim(),
    email: m.email.trim().toLowerCase()
  }));



    const formData = {
      name: groupName,
      type: selectedType,
      members: cleanMembers, // ✅ ONLY USER IDs
      createdBy: user?._id || user?.id,
      creatorName: user.name,
      creatorEmail: user.email,
    };

    try{
      console.log("MEMBERS BEFORE SUBMIT:", cleanMembers);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/CreateGroup`, {
        method: "POST",
        headers:  {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(formData),
      });  

      const data = await response.json();
      if (response.ok) {
        alert("Group Created Successfully!");
      navigate('/Dashboard'); // Send user to login page
      } else {
        alert("Error: " + data.message); // Show backend error (e.g. "User already exists")
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server is not running. Please start backend.");
      
    }
  };


  return (
    <div className="dashboard-container">
      <nav className="top-navbar">
        <div className="nav-brand"><div className="brand-logo">S</div> SplitX</div>
        <div className="nav-center">
          <a onClick={() => handleClick('/Dashboard')} className="nav-link">Dashboard</a>
          <a onClick={() => handleClick('/Groups')} className="nav-link active">Groups</a>
          <a onClick={() => handleClick('/Profile')} className="nav-link">Profile</a>
        </div>
        <div className="nav-right"><span>Hey, {user?.name}</span></div>
      </nav>

      <main className="main-content">
        <div style={{marginBottom: '20px'}}>
           <a onClick={() => handleClick('/Dashboard')} className="view-all-link">← Back to groups</a>
        </div>
{/* // Heading */}
        <div className="center-container">
          <div className="form-card">
            <h2 style={{margin: '0 0 24px 0', textAlign: 'center'}}>Start a new group</h2>
{/* // CreateGroup Form */}
            <form onSubmit={handleGroup}>
              <div className="form-group" >
                {/* // Group Name */}
                <label className="form-label">Group Name</label>
                <input type="text" 
                  className="form-input" 
                  placeholder="e.g. Summer Trip"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)} 
                  required 
                  />
              </div>

              {/* //Group Type */}

              <div className="form-group">
                 <label className="form-label">Type</label>
                 <div className="group-type-row">
                    <div 
                      className={`type-option ${selectedType === 'hostel' ? 'selected' : ''}`}
                      onClick={() => setSelectedType('hostel')}
                    >
                       <span className="type-icon">🏢</span>
                       <span>Hostel</span>
                    </div>
                    <div 
                      className={`type-option ${selectedType === 'trip' ? 'selected' : ''}`}
                      onClick={() => setSelectedType('trip')}
                    >
                       <span className="type-icon">✈️</span>
                       <span>Trip</span>
                    </div>
                    <div 
                      className={`type-option ${selectedType === 'other' ? 'selected' : ''}`}
                      onClick={() => setSelectedType('other')}
                    >
                       <span className="type-icon">≡</span>
                       <span>Other</span>
                    </div>
                 </div>
              </div>

              {/* // Group members */}

              <div className="form-group">
                <label className="form-label">Group Members</label>
                {members.map((member, index) => (
                  <div key={index} style={{display: 'flex', gap: '12px', marginBottom: '12px'}}>
                     <input 
                       type="text" 
                       className="form-input" 
                       placeholder="Name" 
                       style={{flex: 1}}
                       value={member.name}
                       onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                     />
                     <input 
                       type="email" 
                       className="form-input" 
                       placeholder="Email" 
                       style={{flex: 1.5}} 
                       value={member.email}
                       onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                     />
                  </div>
                ))}

                <button type="button" className="btn-outline" style={{width: '100%', justifyContent: 'center'}} onClick={addMemberSlot}>+ Add another person</button>
              </div>

              <button type="submit" className="btn-primary btn-full">Save Group</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
export default CreateGroup;
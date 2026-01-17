import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/JoinGroup.css';

const JoinGroup = () => {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState("");

  const handleClick = (page) => {
    navigate(page);
  };

  const joinGroup = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!joinCode || joinCode.length !== 6) {
      alert("Please enter a valid 6-digit code");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/groups/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          joinCode: joinCode.toUpperCase(),
          userId: user.id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Joined successfully");
        navigate("/GroupList");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="modal-overlay-mimic">
      <div className="modal-card">
        <a onClick={() => handleClick('/GroupList')} className="modal-close">×</a>

        <h2 style={{ margin: '0 0 8px 0' }}>Join a Group</h2>
        <p className="subtitle">Ask a group member for the invite code</p>

        <input
          type="text"
          className="join-input"
          placeholder="ENTER CODE"
          maxLength="6"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
        />

        <button className="btn-primary btn-full" onClick={joinGroup}>
          Join Group
        </button>
      </div>
    </div>
  );
};

export default JoinGroup;

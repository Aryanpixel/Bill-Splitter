import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../styles/Settlement.css";

const Settlement = () => {
  const { groupId, from, to } = useParams();


  const navigate = useNavigate();
  const location = useLocation();

  /* ---------- Amount Handling Safely ---------- */
  const totalAmount =
    typeof location.state?.amount === "number"
      ? location.state.amount
      : 0;

  const [payingNow, setPayingNow] = useState(totalAmount);
  const remaining = totalAmount - payingNow;

  /* ---------- User mapping ---------- */
  const [userMap, setUserMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/auth/${groupId}`)
      .then(res => res.json())
      .then(group => {
        const map = {};

        group.members.forEach(member => {
          map[member._id] = member.name;
        });

        setUserMap(map);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [groupId]);


  /* ---------- Handling Payment ---------- */
const handleRecordPayment = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/record-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      groupId,
      from,
      to,
      amount: payingNow
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    alert("Payment recorded successfully");
    navigate(`/Groups/${groupId}`);

  } catch (error) {
    console.error("Payment failed:", error);
    alert("Server error");
  }
};


  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="main-content">Loading...</div>
      </div>
    );
  }


  return (
    <div className="dashboard-container">
      <nav className="top-navbar">
        <div className="nav-brand">
          <div className="brand-logo">S</div> SplitX
        </div>
        <div className="nav-center">
          <a onClick={() => navigate("/Dashboard")} className="nav-link">
            Dashboard
          </a>
          <a onClick={() => navigate("/GroupList")} className="nav-link active">
            Groups
          </a>
          <a onClick={() => navigate("/Profile")} className="nav-link">
            Profile
          </a>
        </div>
        <div className="nav-right">
          <span>Record Payment</span>
        </div>
      </nav>

      <main className="main-content">
        <div className="back-nav">
          <a
            onClick={() => navigate(`/Groups/${groupId}`)}
            className="back-link"
          >
            ← Back to Group
          </a>
        </div>

        <div className="center-container">
          <div className="settlement-card">
            <h2 className="settle-title">Record Payment</h2>

            {/* PAYER → RECEIVER */}
            <div className="payer-payee-visual">
              <div className="user-column">
                <div className="avatar-xl bg-indigo">
                  {userMap[from]?.charAt(0).toUpperCase()}
                </div>
                <span className="user-label">{userMap[from]}</span>
              </div>

              <div className="flow-arrow-container">
                <div className="flow-line"></div>
                <div className="flow-arrow">→</div>
                <div className="flow-text">Paying</div>
              </div>

              <div className="user-column">
               <div className="avatar-xl bg-indigo">
               {userMap[to]?.charAt(0).toUpperCase() || "?"}
               </div>
               <span className="user-label">
               {userMap[to] || "Unknown"}
               </span>

              </div>
            </div>

            {/* AMOUNT INPUT */}
            <div className="amount-section">
              <label className="input-label">Payment Amount (₹)</label>
              <input
                type="number"
                className="amount-input"
                value={payingNow}
                min={0}
                max={totalAmount}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val > totalAmount) {
                    setPayingNow(totalAmount);
                  } else {
                    setPayingNow(val);
                  }
                }}
              />
            </div>

            {/* CALCULATION */}
            <div className="calculation-box">
              <div className="calc-row">
                <span>Total Owed:</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="calc-row text-green">
                <span>Paying Now:</span>
                <span>-₹{payingNow.toFixed(2)}</span>
              </div>
              <div className="divider"></div>
              <div className="calc-row total-row">
                <span>Remaining:</span>
                <span>₹{remaining.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="btn-primary"
              disabled={payingNow <= 0}
              onClick={handleRecordPayment}
            >
              Record Payment
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settlement;

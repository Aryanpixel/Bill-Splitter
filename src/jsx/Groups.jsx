import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation} from 'react-router-dom';
import '../styles/Groups.css';

const Groups = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [settlements, setSettlements] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);


  const location = useLocation();

  useEffect(() => {
    if (!groupId) {
      navigate("/GroupList");
    }
  }, [groupId, navigate]);

  const handleClick = (page) => {
    navigate(page);
  };

  // Load user
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) throw new Error();
      setUser(storedUser);
    } catch {
      navigate("/Login");
    }
  }, [navigate]);

  // Fetch group details
  useEffect(() => {
    if (!groupId) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/auth/${groupId}`)
      .then(res => res.json())
      .then(data => setGroup(data))
      .catch(err => console.error(err));
  }, [groupId]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/group/${groupId}`
        );
        const data = await res.json();

        setExpenses(data);

        const total = data.reduce((sum, e) => sum + e.amount, 0);
        setTotalSpent(total);
      } catch (err) {
        console.error(err);
      }
    };

    fetchExpenses();
  }, [groupId]);


  useEffect(() => {
  if (!groupId) return;

  fetch(`${import.meta.env.VITE_API_URL}/api/auth/payment/${groupId}/settlements`)
    .then(res => res.json())
    .then(data => {
      console.log("BACKEND SETTLEMENTS:", data);
      setSettlements(Array.isArray(data) ? data : []);
    })
    .catch(err => console.error("Settlement fetch error:", err));
  }, [groupId, location.state?.refresh]);


  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/auth/payment/${groupId}/history`)
      .then(res => res.json())
      .then(data => setPaymentHistory(Array.isArray(data) ? data : []));
  }, [groupId]);

  if (!group || !user) return <div className="main-content">Loading...</div>;




  const userMap = {};

// from expenses → paidBy
  expenses.forEach((expense) => {
    userMap[expense.paidBy._id] = expense.paidBy;

    expense.splitAmong.forEach((item) => {
      userMap[item.user._id] = item.user;
    });
  });


  const mySettlements = settlements.filter(
    s => String(s.from) === String(user.id)
  );


  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="top-navbar">
        <div className="nav-brand"><div className="brand-logo">S</div> SplitX</div>
        <div className="nav-center">
          <a onClick={() => handleClick('/Dashboard')} className="nav-link">Dashboard</a>
          <a onClick={() => handleClick('/GroupList')} className="nav-link active">Groups</a>
          <a onClick={() => handleClick('/Profile')} className="nav-link">Profile</a>
        </div>
        <div className="nav-right"><span>Hey, {user.name}</span></div>
      </nav>

      <main className="main-content">
        <div style={{ marginBottom: '20px' }}>
          <a onClick={() => handleClick('/GroupList')} className="view-all-link">
            ← Back to GroupList
          </a>
        </div>

        {/* Group Header */}
        <div className="group-header-container">
          <div className="group-info">
            <div className="group-icon-large">
              {group.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1>{group.name}</h1>
              <p className="group-code">Code: {group.joinCode}</p>
            </div>
          </div>
          <a
            onClick={() => handleClick(`/AddExpense/${group._id}`)}
            className="btn-primary"
          >
            + Add Expense
          </a>
        </div>

        <div className="dashboard-content-grid">
          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="stat-card" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div className="stat-label">Total Spent</div>
                <div className="stat-value">₹{totalSpent.toFixed(2)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="stat-label">Members</div>
                <div className="stat-value" style={{ fontSize: '1.5rem' }}>
                  {group.members.length}
                </div>
              </div>
            </div>

            <div>
              <h3>Expenses</h3>
                {expenses.length === 0 ? (
                  <div className="empty-box">No expenses yet</div>
                ) : (
                  expenses.map((expense) => {
                    const splitCount = expense.splitAmong.length;
                    const perPerson = (expense.amount / splitCount).toFixed(2);

                    return (
                      <div key={expense._id} className="expense-list-item">
                        <div className="group-item-left">
                          <div className="expense-icon-circle">💸</div>
                          <div>
                            <div className="group-info-title">
                              {expense.description}
                            </div>
                            <div className="group-info-sub">
                              Paid by {expense.paidBy.name} • Split {splitCount} ways • ₹{perPerson} each
                            </div>
                          </div>
                        </div>
                        <div className="expense-amount">
                          Rs{expense.amount}
                        </div>
                      </div>
                    );
                  })
                )}

            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="stat-card">
              <h3>Members</h3>

              {group.members.map((member, index) => (
                <div key={index} className="member-item">
                  <div className="member-info">
                    <div className="member-avatar bg-blue">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <strong>
                      {member.name}
                      {member.email === user.email && " (you)"}
                    </strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="stat-card">
              <h3>Settle Up</h3>

                {expenses.length > 0 && mySettlements.length === 0 ? (
                  <div className="empty-box" style={{ color: "green", marginTop: "10px" }}>
                    ✔ All settled
                  </div>
                  ) : expenses.length === 0 ? (
                    <div className="empty-box">
                      No expenses yet
                    </div>
                  ) : (
                settlements
                .filter(s => String(s.from) === String(user.id))
                .map((s, idx) => {
                  return (
                    <div
                      key={idx}
                      className="settle-up-item"
                      onClick={() => {
                        navigate(`/Settlement/${groupId}/${s.from}/${s.to}`, {
                          state: { amount: s.amount }
                        });
                      }}
                    >
                      <div className="settle-row">
                        <div className="settle-avatar-small bg-indigo">
                          {userMap[s.from]?.name[0]}
                        </div>
                        <span className="arrow">→</span>
                        <div className="settle-avatar-small bg-blue">
                          {userMap[s.to]?.name[0]}
                        </div>
                      </div>

                      <div className="settle-details">
                        <span>
                          You should pay {userMap[s.to]?.name}
                        </span>
                        <span className="text-green">
                          Rs{s.amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}

              {/* PAYMENT HISTORY */}
              {paymentHistory.length > 0 && (
                <div style={{ marginTop: "16px" }}>
                  <h4 style={{ marginBottom: "8px" }}> All Payments History</h4>

                  {paymentHistory.map((p, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "6px 0",
                        fontSize: "14px",
                        opacity: 0.8
                      }}
                    >
                      <span>
                       {p.from.name} paid {p.to.name}
                      </span>
                      <span>₹{p.amount}</span>
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

export default Groups;

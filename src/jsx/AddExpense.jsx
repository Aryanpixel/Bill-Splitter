import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/AddExpense.css';

const AddExpense = () => {

  // handling navigation
  const navigate = useNavigate();

  const { groupId } = useParams();

  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("other");
  const [splitMethod, setSplitMethod] = useState("Split Equally");

  const [splitMembers, setSplitMembers] = useState([]);

  // User Loading
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) throw new Error();
      setUser(storedUser);
    } catch {
      navigate("/Login");
    }
  }, [navigate]);

  // Group fetching
  useEffect(() => {
    if (!groupId) return navigate("/GroupList");

    fetch(`http://localhost:5000/api/auth/${groupId}`)
      .then(res => res.json())
      .then(data => {
        setGroup(data);

        // initialize split members
        setSplitMembers(
          data.members.map(m => ({
            name: m.name,
            email: m.email,
            checked: true,
            percentage: 0
          }))
        );
      })
      .catch(err => {
        console.error(err);
        navigate("/GroupList");
      });
  }, [groupId, navigate]);

  // handling expense submit
  const handleSubmit = async () => {
    if (!description || !amount) {
      return alert("Description and amount required");
    }

    let splitAmong = [];


    if (splitMethod === "Split Equally") 
    {
      splitAmong = splitMembers
        .filter(m => m.checked)
        .map(m => ({
          user: m.email // backend maps email → user
        }));
    } 
    else 
    {
      const totalPercent = splitMembers.reduce(
        (sum, m) => sum + Number(m.percentage),
        0
      );

      if (Math.abs(totalPercent - 100) > 0.01) {
        alert(`Total percentage must be 100%. Current: ${totalPercent}`);
        return;
      }

      splitAmong = splitMembers.map(m => ({
        user: m.email,
        amount: Number(
          ((Number(amount) * Number(m.percentage)) / 100).toFixed(2)
        )
      }));
    }


    try {
      const token = localStorage.getItem('token');
      const res = await fetch("http://localhost:5000/api/auth/AddExpense", {
        method: "POST",
        headers: { "Content-Type": "application/json",
                   "Authorization": `Bearer ${token}`
         },
        body: JSON.stringify({
          groupId,
          description,
          amount: Number(amount),
          category,
          splitMethod,
          paidBy: user.id,
          splitAmong,
        }),
      });

      const data = await res.json();

      if (res.ok) 
      {
        alert("Expense added");
        navigate(`/Groups/${groupId}`);
      } 
      else 
      {
        alert(data.message);
      }
    } catch (err) 
    {
      console.error(err);
      alert("Server error");
    }
  };

  if (!user || !group) return <div className="main-content">Loading...</div>;

  return (
    <div className="dashboard-container">
      <nav className="top-navbar">
        <div className="nav-brand"><div className="brand-logo">S</div> SplitWise</div>
        <div className="nav-center">
          <a onClick={() => navigate('/Dashboard')} className="nav-link">Dashboard</a>
          <a onClick={() => navigate('/GroupList')} className="nav-link active">Groups</a>
          <a onClick={() => navigate('/Profile')} className="nav-link">Profile</a>
        </div>
        <div className="nav-right"><span>Hey, {user.name}</span></div>
      </nav>

      <main className="main-content">
        <div className="back-btn">
          <a onClick={() => navigate(`/Groups/${groupId}`)} className="back-link">
            ← Back to Group
          </a>
        </div>

        <div className="center-container">
          <div className="form-header">
            <div className="page-header-center">
              <div className="header-icon-circle">🧾</div>
              <h2 className="header-title">Add Expense</h2>
              <p className="header-desc">Record a new expense</p>
            </div>

            <form>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Amount</label>
                <div className="currency-wrapper">
                  <span className="currency-symbol">₹</span>
                  <input
                    type="number"
                    className="form-input input-with-icon"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Split Method</label>
                <div className="split-toggle">
                  <button
                    type="button"
                    className={`toggle-option ${splitMethod === 'Split Equally' ? 'active' : ''}`}
                    onClick={() => setSplitMethod("Split Equally")}
                  >
                    Split Equally
                  </button>
                  <button
                    type="button"
                    className={`toggle-option ${splitMethod === 'By Percentage' ? 'active' : ''}`}
                    onClick={() => setSplitMethod("By Percentage")}
                  >
                    By Percentage
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Split Among</label>
                {splitMembers.map((m, index) => (
                  <div key={index} className="member-split">
                    <div className="member-user-info">
                      <div className="avatar-small bg-indigo">
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{m.name}</span>
                    </div>

                    {splitMethod === "Split Equally" ? (
                      <input
                        type="checkbox"
                        checked={m.checked}
                        onChange={() => {
                          const copy = [...splitMembers];
                          copy[index].checked = !copy[index].checked;
                          setSplitMembers(copy);
                        }}
                        className="checkbox-custom"
                      />
                    ) : (
                      <div className="percent-input-group">
                        <input
                          type="number"
                          className="form-input input-percentage"
                          value={m.percentage}
                          onChange={(e) => {
                            const copy = [...splitMembers];
                            copy[index].percentage = e.target.value;
                            setSplitMembers(copy);
                          }}
                        />
                        <span>%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="btn-primary btn-full"
                onClick={handleSubmit}
              >
                Add Expense
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddExpense;

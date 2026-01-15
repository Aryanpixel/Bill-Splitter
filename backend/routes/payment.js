import express from "express";
import Payment from "../models/Payment.js";
import Expense from "../models/Expense.js";

const router = express.Router();

// Recording Payment

router.post("/record-payment", async (req, res) => {
  try {
    const { groupId, from, to, amount } = req.body;

    if (!groupId || !from || !to || !amount) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const payment = await Payment.create({
      groupId,
      from,
      to,
      amount
    });

    return res.status(201).json({
      message: "Payment recorded",
      payment
    });

  } catch (err) {
    console.error("Record payment error:", err);
    res.status(500).json({ message: err.message });
  }
});


// payment.js
router.get("/payment/:groupId/settlements", async (req, res) => {
  try {
    const { groupId } = req.params;

    const payments = await Payment.find({ groupId });

    const expenses = await Expense.find({ group: groupId })
  .populate("paidBy")
  .populate("splitAmong.user");

    // building balance map
    const balanceMap = {};

    // Applying expenses
    expenses.forEach(expense => {
      const paidById = String(expense.paidBy._id);

      if (!balanceMap[paidById]) balanceMap[paidById] = 0;
      balanceMap[paidById] += expense.amount;

      const splitAmount = expense.amount / expense.splitAmong.length;

      expense.splitAmong.forEach(s => {
        const uid = String(s.user._id);
        if (!balanceMap[uid]) balanceMap[uid] = 0;
        balanceMap[uid] -= splitAmount;
      });

    });


    payments.forEach(p => {
        const from = String(p.from);
        const to = String(p.to);
      if (!balanceMap[from]) balanceMap[from] = 0;
      if (!balanceMap[to]) balanceMap[to] = 0;

      balanceMap[from] += p.amount;
      balanceMap[to] -= p.amount;
    });

    const debtors = [];
    const creditors = [];

    Object.entries(balanceMap).forEach(([userId, amount]) => {
      if (amount < 0) debtors.push({ userId, amount: -amount });
      if (amount > 0) creditors.push({ userId, amount });
    });

    const settlements = [];
    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
      const pay = Math.min(debtors[i].amount, creditors[j].amount);

      settlements.push({
        from: debtors[i].userId,
        to: creditors[j].userId,
        amount: pay
      });

      debtors[i].amount -= pay;
      creditors[j].amount -= pay;

      if (debtors[i].amount === 0) i++;
      if (creditors[j].amount === 0) j++;
    }

    return res.json(settlements);

  } catch (err) {
    res.status(500).json([]);
  }
});



// payment history
router.get("/payment/:groupId/history", async (req, res) => {
  try {
    const { groupId } = req.params;

    const payments = await Payment.find({ groupId })
      .populate("from", "name")
      .populate("to", "name")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json([]);
  }
});

// DASHBOARD SUMMARY
router.get("/dashboardSummary/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Getting all settlements (from all groups)
    const expenses = await Expense.find({})
      .populate("paidBy")
      .populate("splitAmong.user");

    const payments = await Payment.find({});

    const balanceMap = {};

    // Applying expenses
    expenses.forEach(exp => {
      const paidBy = String(exp.paidBy._id);
      if (!balanceMap[paidBy]) balanceMap[paidBy] = 0;
      balanceMap[paidBy] += exp.amount;

      const splitAmount = exp.amount / exp.splitAmong.length;
      exp.splitAmong.forEach(s => {
        const uid = String(s.user._id);
        if (!balanceMap[uid]) balanceMap[uid] = 0;
        balanceMap[uid] -= splitAmount;
      });
    });

    // Applying payments 
    payments.forEach(p => {
      const from = String(p.from);
      const to = String(p.to);

      if (balanceMap[from] < 0) balanceMap[from] += p.amount;
      if (balanceMap[to] > 0) balanceMap[to] -= p.amount;
    });

    const myBalance = balanceMap[userId] || 0;

    res.json({
      youAreOwed: myBalance > 0 ? myBalance : 0,
      youOwe: myBalance < 0 ? Math.abs(myBalance) : 0,
      netBalance: myBalance
    });

  } catch (err) {
    res.status(500).json({
      youAreOwed: 0,
      youOwe: 0,
      netBalance: 0
    });
  }
});




// User activity (expenses + payments)
router.get("/activity/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const expenses = await Expense.find({ paidBy: userId })
      .populate("group", "name")
      .sort({ createdAt: -1 });

    const payments = await Payment.find({ from: userId })
      .populate("to", "name")
      .sort({ createdAt: -1 });

    res.json({ expenses, payments });

  } catch (err) {
    res.status(500).json({ expenses: [], payments: [] });
  }
});



export default router;

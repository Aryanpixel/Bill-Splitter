import express from "express";
import Expense from "../models/Expense.js";
import Group from "../models/Group.js";
import User from "../models/User.js";
import protect from '../middleware/authMiddleware.js';


const router = express.Router();



router.post("/AddExpense", protect, async (req, res) => {
  try {
    const { groupId, description, amount, category, splitMethod, paidBy, splitAmong} = req.body;

    if ( !groupId || !description || !amount || !category || !splitMethod || !paidBy || !splitAmong || splitAmong.length === 0) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    
    const resolvedSplitAmong = [];

    for (const item of splitAmong) {
      const userDoc = await User.findOne({ email: item.user });

      if (!userDoc) {
        return res.status(400).json({
          message: `User not found for email ${item.user}`,
        });
      }

      resolvedSplitAmong.push({
        user: userDoc._id,
        percentage: item.percentage || null,
        amount: item.amount || null,
      });
    }



    let finalSplit = [];

    //  Split equal
    if (splitMethod === "Split Equally") {
      const perPersonAmount = amount / splitAmong.length;

      finalSplit = splitAmong.map((item) => ({
        user: item.user,
        amount: Number(perPersonAmount.toFixed(2)),
        percentage: null,
      }));
    }

    //  Splitt by %
    if (splitMethod === "By Percentage") {
      const totalPercentage = splitAmong.reduce(
        (sum, item) => sum + item.percentage,
        0
      );

      if (totalPercentage !== 100) {
        return res
          .status(400)
          .json({ message: "Total percentage must be 100%" });
      }

      finalSplit = splitAmong.map((item) => ({
        user: item.user,
        percentage: item.percentage,
        amount: Number(((amount * item.percentage) / 100).toFixed(2)),
      }));
    }

    // Creating Expendse
    const expense = await Expense.create({ 
      group: groupId,
      description,
      amount,
      category,
      splitMethod,
      paidBy,
      splitAmong: resolvedSplitAmong,
    });

    res.status(201).json({
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});



router.get("/group/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;

    const expenses = await Expense.find({ group: groupId })
      .populate("paidBy", "name email")
      .populate("splitAmong.user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



export default router;

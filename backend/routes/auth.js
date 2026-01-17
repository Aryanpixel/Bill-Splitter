import User from '../models/User.js';
import express from 'express';
import bcrypt from 'bcrypt';
import Expense from '../models/Expense.js';
import Group from '../models/Group.js';
import Payment from '../models/Payment.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Signup Route
router.post('/Signup', async (req, res) => {
    try{
        const{name,email,password} = req.body;

        //checking Validation
        if(!name || !email || !password){
           return  res.status(400).json({ message: "All fields are required"})
        };

        const existingUser = await User.findOne({email});
        if(existingUser)
        {
            return res.status(409).json({message : "User already exists"})
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);  //hash password


        const newUser = await User.create({                       // creating user
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "Signup successful",
            token: generateToken(newUser._id || User._id),
            user:{
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } 
    catch(error){
        console.log("Signup Error:", error);
        res.status(500).json({message: error.message})
    }
});


//Login Route

router.post("/Login", async (req, res) => {
    
    try
    {
        const {email,password} =  req.body;

        if(!email || !password)
        {
            return res.status(400).json({message: "All fields are required"});
        }

            // Find user
    const user = await User.findOne({ email });
    if (!user) 
    {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect Password" });
    }

    res.status(200).json({
      message: 'Login successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        },
    });

    } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Delete Account Route
router.delete("/delete-account/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    //  Removes user from all groups they are members of
    await Group.updateMany(
      { members: userId },
      { $pull: { members: userId } }
    );

    //  Delete groups created by this user
    await Group.deleteMany({ createdBy: userId });

    // Delete expenses paid by this user
    await Expense.deleteMany({ paidBy: userId });

    //  Removes user from splitAmong arrays in other expenses
    await Expense.updateMany(
      { "splitAmong.user": userId },
      { $pull: { splitAmong: { user: userId } } }
    );

    // Delete payments involving this user
    await Payment.deleteMany({
      $or: [{ from: userId }, { to: userId }]
    });

    //  delete the user document
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Account and all associated data wiped successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ message: "Server error during account deletion" });
  }
});


export default router;




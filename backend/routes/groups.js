import express from 'express';
import Group from '../models/Group.js';
import User from "../models/User.js"
import mongoose from 'mongoose';

const router = express.Router();

// Coode Generation
const generateGroupCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};


const generateUniqueGroupCode = async () => {
  let code;
  let exists = true;

  while (exists) {
    code = generateGroupCode();
    exists = await Group.findOne({ joinCode: code });
  }

  return code;
};


//Group Creation

router.post("/CreateGroup", async (req, res) => {
    try{
        const{name, createdBy, type, creatorName, creatorEmail, members} = req.body;


        if(!name || !type || !members){
           return  res.status(400).json({ message: "All fields are required"})
        };

        const existingGroup = await Group.findOne({name});
        if(existingGroup){
            return res.status(409).json({message: "This GroupName is already used"});
        }

        const joinCode = await generateUniqueGroupCode();
        

        const creatorUser = await User.findById(createdBy);
        if (!creatorUser) {
          return res.status(400).json({ message: "Creator user not found" });
        } 

        const emails = members
          .map(m => m.email.trim().toLowerCase())
          .filter(email => email !== creatorUser.email.toLowerCase());




        const invitedUsers = await User.find({
          email: { $in: emails }
        });

        if (invitedUsers.length !== emails.length) {
          return res.status(400).json({
            message: "One or more invited users do not exist"
          });
        }

        const memberIds = [
          creatorUser._id,
          ...invitedUsers
            .filter(u => u._id.toString() !== creatorUser._id.toString())
            .map(u => u._id)
        ];

        const newGroup = await Group.create({
          name,
          type,
          createdBy: creatorUser._id,
          joinCode,
          members: memberIds,
        });


        res.status(201).json({
            message: "Group Created Successfully",
            group:{
                id: newGroup._id,
                name: newGroup.name,
                type: newGroup.type,
                members: newGroup.members,
                createdBy: newGroup.createdBy,
                joinCode: newGroup.joinCode,

            }
        });
        } catch(error){
            res.status(500).json({message: error.message})
        }


    });

// Group Fetching

router.get("/user/:userId", async (req,res) => {
    try{

        const {userId} = req.params;

        const groups = await Group.findOne({
      $or: [
        { createdBy: userId },
        { members: userId }
      ]
        }).sort({createdAt : -1});

        res.status(200).json(groups);



    } catch(error) {
        res.status(500).json({ message: error.message });
    }

})


// Group fetching for dashboard
router.get('/dashboard/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);


      const groups = await Group.find({
      $or: [
        { createdBy: objectUserId },
        { members: objectUserId }
      ]
      }).sort({createdAt : -1});

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Group fetching for GroupList
router.get("/groups/:userId", async (req, res) => {
  try {
    // const { email } = req.query;
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);


    const groups = await Group.find({
      $or: [
        { createdBy: objectUserId },
        { members: objectUserId }
      ]
    }).sort({createdAt : -1});


    res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});





// Getting single group details
router.get('/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId)
      .populate("members", "name email");

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Join Group

router.post("/groups/join", async (req, res) => {
  try {
    const { joinCode, userId } = req.body;
    


    if (!joinCode || !userId) {
      return res.status(400).json({ message: "All fields required" });
    }

    const group = await Group.findOne({ joinCode });

    if (!group) {
      return res.status(404).json({ message: "Invalid group code" });
    }

    // It prevent duplicate joins (by email)
    if (group.members.includes(userId)) {
      return res.status(409).json({ message: "Already a member of this group" });
    }

    group.members.push(userId);
    await group.save();

    res.status(200).json({
      message: "Joined group successfully",
      group,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





export default router;

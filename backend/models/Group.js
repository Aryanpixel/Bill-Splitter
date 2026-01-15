import mongoose from "mongoose";


const groupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        createdBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            
        },

        joinCode: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            length: 6,
        },
        
        type:{
            type: String,
            required: true,
            enum: ['hostel', 'trip', 'other']
        },
        

        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
    },  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);
export default Group;
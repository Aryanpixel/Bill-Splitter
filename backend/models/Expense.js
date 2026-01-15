import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
    {
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Groups",
            required: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        amount: {
            type: Number,
            required: true,
        },

        category: {
            type: String,
            required: true,
            enum: ['food', 'transport', 'other']
        },

        splitMethod: {
            type: String,
            required: true,
            enum: ['Split Equally', 'By Percentage']
        },

        paidBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        splitAmong: [
            {
                user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
                },

                percentage: {
                type: Number,
                default: null, // used only for percentage split
                },

                amount: {
                type: Number,
                default: null, // calculated value (optional cache)
                },
            },
        ],
    },
    { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
import mongoose from "mongoose";
const settlementSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: mongoose.Schema.Types.Decimal128,
        ref: "Expense",
        required: true,
    },

    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Groups',
      required: true,
    },

    expenseRelated: {
      type: Boolean,
      default: false, // manual settlement vs expense-related
    },

}, { timestamps: true }
);

const Settlement = mongoose.model("Settlement", settlementSchema);
export default Settlement;
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import auth from "./routes/auth.js";
import groupRoutes from "./routes/groups.js"
import expenseRoutes from "./routes/expenses.js";
import paymentRoutes from "./routes/payment.js";
import dotenv from 'dotenv';



dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Bill-Splitter';



// Middleware
app.use(cors({origin:'https://bill-splitter-6pz4euyax-aryans-projects-f7ef1de3.vercel.app/'}));
app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/auth", groupRoutes);
app.use("/api/auth", expenseRoutes);
app.use("/api/auth", paymentRoutes);


// MongoDB Connection
mongoose.connect(MONGODB_URI)
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Error:', err));

app.get('/', (req, res) => {
  res.send('Backend running');
});


// Server Start

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

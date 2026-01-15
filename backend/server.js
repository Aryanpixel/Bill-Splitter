import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import auth from "./routes/auth.js";
import groupRoutes from "./routes/groups.js"
import expenseRoutes from "./routes/expenses.js";
import paymentRoutes from "./routes/payment.js";







const app = express();
const PORT = 5000;



// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/auth", groupRoutes);
app.use("/api/auth", expenseRoutes);
app.use("/api/auth", paymentRoutes);


// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/SplitX')
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Error:', err));

app.get('/', (req, res) => {
  res.send('Backend running');
});


// Server Start

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

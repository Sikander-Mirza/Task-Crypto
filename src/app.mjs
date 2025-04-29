import express from 'express';
// import dotenv from 'dotenv';
import cors from 'cors';
// import helmet from 'helmet';
import connectDB from './Infractructure/db.mjs';

import authRoutes from './Routes/authRoute.mjs';
// import kycRoutes from './routes/kycRoutes.js';
import transactionRoutes from './Routes/transactionRoute.mjs';
import bankRoutes from './Routes/bankRoute.mjs';
// import utilityBillRoutes from './routes/utilityBillRoutes.js';
// import rewardRoutes from './routes/rewardRoutes.js';
// import aiRoutes from './routes/aiRoutes.js';
// import notificationRoutes from './routes/notificationRoutes.js';
// import adminRoutes from './routes/adminRoutes.js';

// dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
// app.use(helmet());

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/kyc', kycRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/bank', bankRoutes);
// app.use('/api/bills', utilityBillRoutes);
// app.use('/api/rewards', rewardRoutes);
// app.use('/api/ai', aiRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/admin', adminRoutes);



const start = () => {
  connectDB()  
    .then(() => {
      
      app.listen(9000, '0.0.0.0', () => {
        console.log("Server is running on port 9000");  
      });
      console.log("DB connected successfully");  
    })
    .catch((err) => {
      console.error("Error connecting to DB:", err);  
    });
};

export default start;  

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); 
dotenv.config(); 

const connectDB = require('./config/db');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');

connectDB();
const app = express();
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",   // for local dev
    "https://washtep-web-app.vercel.app", // vercel
    "https://yourdomain.com"   // custom domain
  ],
  credentials: true
}));

// API Routes
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));


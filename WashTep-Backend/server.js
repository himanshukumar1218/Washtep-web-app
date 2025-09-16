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
    "http://localhost:5173",             // For local development
    "https://washtep-web-app.vercel.app",  // Your Vercel deployment URL
    "https://washtep.tech",              // Your custom domain
    "https://www.washtep.tech"           // The 'www' version of your domain
  ],
  credentials: true
}));

// API Routes
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));


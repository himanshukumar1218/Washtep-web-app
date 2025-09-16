// WashTep-Backend/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// All chat interactions will go through this single route
router.post('/', protect, handleChat);

module.exports = router;
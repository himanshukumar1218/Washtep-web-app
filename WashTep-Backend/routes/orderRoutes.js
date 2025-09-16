const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getAllOrders, 
  updateOrderStatus,
  getMyOrders 
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Logged-in user 
router.get('/myorders', protect, getMyOrders);

//  (must be logged in)
router.post('/', protect, createOrder);

// Admin-only
router.get('/', protect, admin, getAllOrders);

// Admin-only: update order status
router.put('/:id', protect, admin, updateOrderStatus);

module.exports = router;

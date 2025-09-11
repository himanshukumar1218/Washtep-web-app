const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getAllOrders, 
  updateOrderStatus,
  getMyOrders 
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Logged-in user gets their own orders
router.get('/myorders', protect, getMyOrders);

// Place a new order (must be logged in)
router.post('/', protect, createOrder);

// Admin-only: get all orders
router.get('/', protect, admin, getAllOrders);

// Admin-only: update order status
router.put('/:id', protect, admin, updateOrderStatus);

module.exports = router;

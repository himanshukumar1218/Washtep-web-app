const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // --- ADD THIS ---
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // This creates the connection to your User model
  },
  // --- END ADD ---
  serviceName: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  approxGarments: { type: Number },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: 'Scheduled' },
  orderDate: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;

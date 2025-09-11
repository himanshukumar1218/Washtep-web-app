const Order = require('../models/orderModel');
const nodemailer = require('nodemailer');

// --- Configure Email Transporter ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * @desc    Create a new order and send a notification email
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = async (req, res) => {
  try {
    const { service, ...formData } = req.body;

    if (!service || !formData.fullName || !formData.phone) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required fields' });
    }

    const newOrder = new Order({
      user: req.user._id, // linked user
      serviceName: service.name,
      fullName: formData.fullName,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      pincode: formData.pincode,
      approxGarments: formData.garments,
      paymentMethod: formData.paymentMethod,
    });

    const savedOrder = await newOrder.save();
    console.log('Order saved:', savedOrder);

    // --- Send Notification Email ---
    const mailOptions = {
      from: `"WashTep" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Laundry Order! #${savedOrder._id
        .toString()
        .slice(-6)
        .toUpperCase()}`,
      html: `
        <h1>You have a new pickup scheduled!</h1>
        <p><strong>Order ID:</strong> #${savedOrder._id
          .toString()
          .slice(-6)
          .toUpperCase()}</p>
        <p><strong>User ID:</strong> ${req.user._id}</p>
        <p><strong>Customer:</strong> ${savedOrder.fullName}</p>
        <p><strong>Phone:</strong> ${savedOrder.phone}</p>
        <p><strong>Service:</strong> ${savedOrder.serviceName}</p>
        <p><strong>Address:</strong> ${savedOrder.address}, ${savedOrder.city}, ${savedOrder.pincode}</p>
        <p>Please log in to the admin dashboard to manage this order.</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending notification email:', error);
      } else {
        console.log('Notification Email sent:', info.response);
      }
    });

    res
      .status(201)
      .json({ success: true, message: 'Order created successfully!', order: savedOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res
      .status(500)
      .json({ success: false, message: 'Server error. Please try again.' });
  }
};

/**
 * @desc    Get all orders (Admin only)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email') // include user details
      .sort({ orderDate: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * @desc    Update an order's status (Admin only)
 * @route   PUT /api/orders/:id
 * @access  Private/Admin
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }

    order.status = status || order.status;
    const updatedOrder = await order.save();

    res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * @desc    Get logged-in user's orders
 * @route   GET /api/orders/myorders
 * @access  Private
 */
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      orderDate: -1,
    });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getMyOrders,
};

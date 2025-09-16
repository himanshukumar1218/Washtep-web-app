// WashTep-Backend/controllers/chatController.js

const { GoogleGenerativeAI } = require('@google/generative-ai');
const Order = require('../models/orderModel');
const User = require('../models/userModel');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const tools = [
  {
    functionDeclarations: [
      {
        name: 'getLatestOrderStatus',
        description: "Get the status of the user's most recent laundry order.",
        parameters: { type: 'object', properties: {} },
      },
      {
        name: 'getPastOrders',
        description: "Get a summary of the user's last 5 orders.",
        parameters: { type: 'object', properties: {} },
      },
    ],
  },
];

const toolFunctions = {
  getLatestOrderStatus: async (userId) => {
    const latestOrder = await Order.findOne({ user: userId }).sort({ orderDate: -1 });
    if (!latestOrder) {
      return { status: 'No orders found.' };
    }
    return {
      orderId: latestOrder._id.toString().slice(-6).toUpperCase(),
      service: latestOrder.serviceName,
      status: latestOrder.status,
      date: latestOrder.orderDate.toDateString(),
    };
  },
  getPastOrders: async (userId) => {
    const orders = await Order.find({ user: userId }).sort({ orderDate: -1 }).limit(5);
    if (!orders || orders.length === 0) {
      return { orders: 'No past orders found.' };
    }
    return {
      orders: orders.map(o => ({
        orderId: o._id.toString().slice(-6).toUpperCase(),
        service: o.serviceName,
        status: o.status,
        date: o.orderDate.toDateString(),
      })),
    };
  },
};

const handleChat = async (req, res) => {
  try {
    const { message, history: chatHistory } = req.body;
    const userId = req.user._id;

    // --- THIS IS THE FIX ---
    // We are changing "gemini-pro" to "gemini-1.5-flash", a modern and efficient model.
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', tools });
    // --- END OF FIX ---

    if (chatHistory.length > 0 && chatHistory[0].role === 'model') {
      chatHistory.shift();
    }

    const chat = model.startChat({
      history: chatHistory
    });

    const result = await chat.sendMessage(message);
    const call = result.response.functionCalls()?.[0];

    if (call) {
      const apiResponse = await toolFunctions[call.name](userId);
      const result2 = await chat.sendMessage([
        { functionResponse: { name: call.name, response: apiResponse } },
      ]);
      const finalResponse = result2.response.text();
      return res.json({ success: true, message: finalResponse });
    } else {
      const text = result.response.text();
      return res.json({ success: true, message: text });
    }

  } catch (error) {
    console.error("Error in chat controller:", error);
    res.status(500).json({ success: false, message: 'AI service error.' });
  }
};

module.exports = { handleChat };
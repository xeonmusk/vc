const Order = require('../models/order');

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'username')
      .populate('items.product');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const newOrder = new Order({
      ...req.body,
      customer: req.user.id
    });
    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getOrderAnalytics = async (req, res) => {
  try {
    const analytics = await Order.aggregate([
      {
        $group: {
          _id: "$orderType",
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
          averageOrderValue: { $avg: "$totalAmount" }
        }
      }
    ]);
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllOrders,
  createOrder,
  updateOrderStatus,
  getOrderAnalytics
};

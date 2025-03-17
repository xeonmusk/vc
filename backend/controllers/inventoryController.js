const Inventory = require('../models/inventory');

const getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().populate('productId');
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addInventoryItem = async (req, res) => {
  try {
    const newItem = new Inventory(req.body);
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateInventory = async (req, res) => {
  try {
    const updated = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const checkInventoryAlerts = async (req, res) => {
  try {
    const alerts = await Inventory.find({
      $where: function() {
        return this.quantity <= this.minimumThreshold;
      }
    });
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInventoryAnalytics = async (req, res) => {
  try {
    const analytics = await Inventory.aggregate([
      {
        $group: {
          _id: "$category",
          totalQuantity: { $sum: "$quantity" },
          totalValue: { $sum: { $multiply: ["$quantity", "$cost"] } },
          averageAge: { $avg: "$age" }
        }
      }
    ]);
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllInventory,
  addInventoryItem,
  updateInventory,
  checkInventoryAlerts,
  getInventoryAnalytics
};

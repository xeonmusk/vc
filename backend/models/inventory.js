const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, required: true },
  batchNumber: String,
  productionDate: Date,
  expiryDate: Date,
  location: String,
  lastUpdated: { type: Date, default: Date.now },
  category: { type: String, enum: ['live_chicken', 'eggs', 'feed', 'medicine'], required: true },
  weight: { type: Number }, // For live chickens
  age: { type: Number }, // Age in days for chickens
  healthStatus: { type: String, enum: ['healthy', 'sick', 'quarantine'] },
  supplier: { type: String },
  cost: { type: Number },
  minimumThreshold: { type: Number }, // Alert threshold
  notes: { type: String }
});

module.exports = mongoose.model('Inventory', inventorySchema);

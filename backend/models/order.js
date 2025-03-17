const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderType: { type: String, enum: ['wholesale', 'retail'], required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    category: { type: String, enum: ['live_chicken', 'eggs', 'processed'] },
    quantity: Number,
    price: Number,
    weight: Number, // For live chickens
    specifications: {
      size: String,
      grade: String,
      packaging: String
    }
  }],
  totalAmount: Number,
  status: { type: String, enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  specialInstructions: String,
  preferredDeliveryTime: Date,
  transportationType: { type: String, enum: ['standard', 'refrigerated'] },
  temperature: { type: Number }, // For refrigerated transport
  qualityCheck: {
    checkedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    checkedAt: Date,
    status: { type: String, enum: ['pending', 'passed', 'failed'] }
  },
  orderDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);

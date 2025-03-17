const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  batchNumber: { type: String, required: true, unique: true },
  breed: { type: String, required: true },
  quantity: { type: Number, required: true },
  arrivalDate: { type: Date, required: true },
  expectedHarvestDate: Date,
  currentAge: { type: Number, default: 0 }, // in days
  mortality: { type: Number, default: 0 },
  feedConsumption: [{
    date: Date,
    amount: Number,
    feedType: String
  }],
  healthRecords: [{
    date: Date,
    condition: String,
    treatment: String,
    medication: String
  }],
  weightRecords: [{
    date: Date,
    averageWeight: Number,
    sampleSize: Number
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'terminated'],
    default: 'active'
  }
});

module.exports = mongoose.model('Batch', batchSchema);

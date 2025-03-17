const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: Date,
  category: { 
    type: String, 
    enum: [
      'feeding', 'cleaning', 'maintenance', 'health', 
      'egg_collection', 'vaccination', 'inventory_check',
      'chicken_transfer', 'equipment_maintenance', 'other'
    ] 
  },
  completedAt: Date,
  requiredEquipment: [String],
  recurring: { type: Boolean, default: false },
  recurrencePattern: {
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'] },
    interval: Number
  },
  estimatedDuration: Number, // in minutes
  actualDuration: Number, // in minutes
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['inventory_alert', 'task_due', 'order_status', 'health_alert'],
    required: true 
  },
  message: { type: String, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  relatedId: mongoose.Schema.Types.ObjectId,
  category: String
});

module.exports = mongoose.model('Notification', notificationSchema);

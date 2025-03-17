const Notification = require('../models/notification');

const createNotification = async (type, message, userId, priority = 'medium', relatedId = null) => {
  try {
    const notification = new Notification({
      type,
      message,
      userId,
      priority,
      relatedId
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Notification creation failed:', error);
    return null;
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead
};

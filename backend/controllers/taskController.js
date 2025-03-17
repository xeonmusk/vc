const Task = require('../models/task');

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'username')
      .populate('createdBy', 'username');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const newTask = new Task({
      ...req.body,
      createdBy: req.user.id
    });
    const saved = await newTask.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTaskAnalytics = async (req, res) => {
  try {
    const analytics = await Task.aggregate([
      {
        $group: {
          _id: "$category",
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
          },
          avgDuration: { $avg: "$actualDuration" }
        }
      }
    ]);
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, actualDuration } = req.body;
    const task = await Task.findByIdAndUpdate(
      id,
      { 
        status,
        actualDuration,
        completedAt: status === 'completed' ? Date.now() : null 
      },
      { new: true }
    );
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  getTaskAnalytics,
  updateTaskStatus
};

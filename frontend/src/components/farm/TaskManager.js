import React, { useState } from 'react';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);

  return (
    <div className="task-manager">
      <h2>Task Manager</h2>
      <div className="task-list">
        {/* Task list will go here */}
      </div>
    </div>
  );
};

export default TaskManager;

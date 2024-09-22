// src/components/tasks/TaskItem.js
import React from 'react';

const TaskItem = ({ task }) => {
  return (
    <li>
      <span>{task.shortDescription}</span>
    </li>
  );
};

export default TaskItem;
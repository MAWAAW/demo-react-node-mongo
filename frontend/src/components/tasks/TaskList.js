import React from 'react';
import { List, ListItem, ListItemButton, ListItemText, Checkbox } from '@mui/material';
import taskService from '../../services/taskService';

function TaskList({ tasks, setSelectedTask, fetchTasks }) {
  const toggleCompleted = async (task) => {
    try {
      await taskService.updateTask(task._id, { completed: !task.completed });
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la mise à jour de la tâche');
    }
  };

  return (
    <List>
      {tasks.map(task => (
        <ListItem key={task._id} disablePadding>
          <ListItemButton onClick={() => setSelectedTask(task)}>
            <ListItemText primary={task.shortDescription} />
          </ListItemButton>
          <Checkbox
            edge="end"
            onChange={() => toggleCompleted(task)}
            checked={task.completed}
          />
        </ListItem>
      ))}
    </List>
  );
}

export default TaskList;

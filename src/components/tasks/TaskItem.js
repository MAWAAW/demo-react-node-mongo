// src/components/tasks/TaskItem.js
import React from 'react';
import axios from 'axios';

const TaskItem = ({ task, onTaskUpdated }) => {
  const handleToggleComplete = () => {
    const token = localStorage.getItem('token');

    axios.put(`http://localhost:5000/tasks/${task._id}`, { completed: !task.completed }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('Tâche mise à jour:', response.data);
      onTaskUpdated(response.data);  // Mettre à jour la tâche dans la liste via callback
    })
    .catch(error => {
      console.error('Erreur lors de la mise à jour de la tâche', error);
    });
  };

  const handleDeleteTask = () => {
    const token = localStorage.getItem('token');
  
    axios.delete(`http://localhost:5000/tasks/${task._id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('Tâche supprimée:', response.data);
      onTaskUpdated(null, task._id);  // Utiliser callback pour supprimer la tâche de la liste
    })
    .catch(error => {
      console.error('Erreur lors de la suppression de la tâche', error);
    });
  };

  return (
    <li>
      <span>{task.description}</span>
      <button onClick={handleToggleComplete}>
        {task.completed ? 'Marquer comme non terminée' : 'Marquer comme terminée'}
      </button>
      <button onClick={handleDeleteTask}>Supprimer</button>
    </li>
  );
};

export default TaskItem;

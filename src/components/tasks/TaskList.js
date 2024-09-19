// src/components/tasks/TaskList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskItem from './TaskItem';
import AddTask from './AddTask';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Charger les tâches depuis l'API lors du premier rendu
  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:5000/tasks', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setTasks(response.data);  // Charger les tâches récupérées
    })
    .catch(error => {
      setErrorMessage('Erreur lors de la récupération des tâches');
    });
  }, []);

  // Fonction pour mettre à jour une tâche dans l'état local
  const handleTaskUpdated = (updatedTask, taskIdToDelete = null) => {
    if (taskIdToDelete) {
      // Supprimer la tâche de l'état
      setTasks(tasks.filter(task => task._id !== taskIdToDelete));
    } else {
      // Mettre à jour une tâche existante dans l'état
      setTasks(tasks.map(task => (task._id === updatedTask._id ? updatedTask : task)));
    }
  };

  // Fonction pour ajouter une nouvelle tâche à la liste
  const handleTaskAdded = (newTask) => {
    setTasks([...tasks, newTask]);  // Ajouter la nouvelle tâche à l'état
  };

  return (
    <div>
      <h2>Mes Tâches</h2>

      {/* Formulaire pour ajouter une nouvelle tâche */}
      <AddTask onTaskAdded={handleTaskAdded} />

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <ul>
        {tasks.map(task => (
          <TaskItem key={task._id} task={task} onTaskUpdated={handleTaskUpdated} />
        ))}
      </ul>
    </div>
  );
};

export default TaskList;

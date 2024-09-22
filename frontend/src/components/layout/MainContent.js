// src/components/layout/MainContent.js
import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';  // Pour la redirection
import AddTask from '../tasks/AddTask';
import TaskList from '../tasks/TaskList';

function MainContent({ selectedTaskList, setSelectedTask, tasks, setTasks, fetchTasks }) {
  const [showCompleted, setShowCompleted] = useState(false);
  const navigate = useNavigate();  // Hook pour redirection

  // Fonction de déconnexion
  const handleLogout = () => {
    // Supprimer le token JWT de localStorage
    localStorage.removeItem('token');
      
    // Rediriger vers la page d'authentification
    navigate('/auth');
  };

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  if (!selectedTaskList) {
    return (
      <Box sx={{ p: 2, position: 'relative' }}>
        <Button
          variant="contained"
          color="error"
          sx={{ position: 'absolute', top: 10, right: 10 }}
          onClick={handleLogout}
        >
          Déconnexion
        </Button>
        <Typography variant="h6">Veuillez sélectionner une liste de tâches.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, position: 'relative' }}>
      <Button
        variant="contained"
        color="error"
        sx={{ position: 'absolute', top: 10, right: 10 }}
        onClick={handleLogout}
      >
        Déconnexion
      </Button>

      <Typography variant="h4">{selectedTaskList.nom}</Typography>
      <AddTask taskListId={selectedTaskList._id} fetchTasks={fetchTasks} />
      <TaskList tasks={pendingTasks} setSelectedTask={setSelectedTask} fetchTasks={fetchTasks} />

      <Button onClick={() => setShowCompleted(!showCompleted)} sx={{ mt: 2 }}>
        {showCompleted ? 'Masquer' : 'Afficher'} les tâches terminées
      </Button>

      {showCompleted && (
        <>
          <Typography variant="h5" sx={{ mt: 2 }}>Tâches terminées</Typography>
          <TaskList tasks={completedTasks} setSelectedTask={setSelectedTask} fetchTasks={fetchTasks} />
        </>
      )}
    </Box>
  );
}

export default MainContent;
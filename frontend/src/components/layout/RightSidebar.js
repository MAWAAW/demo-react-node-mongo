import React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { Close as CloseIcon, Delete as DeleteIcon } from '@mui/icons-material';
import taskService from '../../services/taskService';

function RightSidebar({ selectedTask, setSelectedTask, tasks, setTasks }) {
  if (!selectedTask) return null;

  const deleteTask = async () => {
    if (window.confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
      try {
        await taskService.deleteTask(selectedTask._id);
        setTasks(tasks.filter(task => task._id !== selectedTask._id));
        setSelectedTask(null);
      } catch (err) {
        console.error(err);
        alert('Erreur lors de la suppression de la tâche');
      }
    }
  };

  return (
    <Box
      sx={{
        width: 300,
        borderLeft: '1px solid #ddd',
        overflowY: 'auto',
      }}
    >
      <Box sx={{ width: '100%', p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5">{selectedTask.shortDescription}</Typography>
          <IconButton onClick={() => setSelectedTask(null)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body1">{selectedTask.longDescription}</Typography>
        <Typography variant="body2">
          Date d'échéance : {new Date(selectedTask.dateEcheance).toLocaleDateString()}
        </Typography>
        <Typography variant="body2">
          Date de création : {new Date(selectedTask.dateCreation).toLocaleDateString()}
        </Typography>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={deleteTask}
          sx={{ mt: 2 }}
        >
          Supprimer la tâche
        </Button>
      </Box>
    </Box>
  );
}

export default RightSidebar;
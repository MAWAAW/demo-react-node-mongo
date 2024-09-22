import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import taskService from '../../services/taskService';

function AddTask({ taskListId, fetchTasks }) {
  const [formData, setFormData] = useState({
    shortDescription: '',
    longDescription: '',
    dateEcheance: ''
  });

  const { shortDescription, longDescription, dateEcheance } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await taskService.createTask({ ...formData, taskListId });
      setFormData({ shortDescription: '', longDescription: '', dateEcheance: '' });
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la création de la tâche');
    }
  };

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Description courte"
        name="shortDescription"
        value={shortDescription}
        onChange={onChange}
        required
      />
      <TextField
        fullWidth
        label="Description longue"
        name="longDescription"
        value={longDescription}
        onChange={onChange}
        multiline
        rows={4}
        sx={{ mt: 2 }}
      />
      <TextField
        fullWidth
        label="Date d'échéance"
        name="dateEcheance"
        type="date"
        value={dateEcheance}
        onChange={onChange}
        required
        sx={{ mt: 2 }}
      />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Ajouter la tâche
      </Button>
    </Box>
  );
}

export default AddTask;

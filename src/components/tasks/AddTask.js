// src/components/tasks/AddTask.js
import React, { useState } from 'react';
import axios from 'axios';

const AddTask = ({ onTaskAdded }) => {
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');

    axios.post('http://localhost:5000/tasks', { description }, {
      headers: {
        Authorization: `Bearer ${token}`  // Ajouter le token JWT dans les headers
      }
    })
    .then(response => {
      onTaskAdded(response.data);  // Ajouter la tâche à la liste
      setDescription('');
    })
    .catch(error => {
      setErrorMessage('Erreur lors de la création de la tâche');
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nouvelle tâche"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Ajouter</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default AddTask;
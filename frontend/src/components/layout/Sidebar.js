// src/components/layout/Sidebar.js
import React, { useState, useEffect } from 'react';
import { Box, IconButton, TextField, Button, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Menu as MenuIcon, Delete as DeleteIcon } from '@mui/icons-material';
import taskListService from '../../services/taskListService';

function Sidebar({ selectedTaskList, setSelectedTaskList, setSelectedTask }) {
  const [taskLists, setTaskLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const fetchTaskLists = async () => {
    try {
      const lists = await taskListService.getTaskLists();
      setTaskLists(lists);
    } catch (err) {
      console.error(err);
      alert('Erreur lors du chargement des listes de tâches');
    }
  };

  useEffect(() => {
    fetchTaskLists();
  }, []);

  const createTaskList = async () => {
    if (newListName.trim() === '') return;
    try {
      await taskListService.createTaskList({ nom: newListName });
      setNewListName('');
      fetchTaskLists();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la création de la liste de tâches');
    }
  };

  const deleteTaskList = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette liste ?')) {
      try {
        await taskListService.deleteTaskList(id);
        fetchTaskLists();
        setSelectedTaskList(null);
        setSelectedTask(null);
      } catch (err) {
        console.error(err);
        alert('Erreur lors de la suppression de la liste de tâches');
      }
    }
  };

  return (
    <Box
      sx={{
        width: isExpanded ? 240 : 60,
        transition: 'width 0.3s',
        overflowX: 'hidden',
        borderRight: '1px solid #ddd',
      }}
    >
      <IconButton onClick={() => setIsExpanded(!isExpanded)}>
        <MenuIcon />
      </IconButton>
      {isExpanded && (
        <Box sx={{ p: 2 }}>
          <TextField
            label="Nouvelle liste"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            fullWidth
          />
          <Button onClick={createTaskList} variant="contained" sx={{ mt: 1 }}>
            Ajouter
          </Button>
          <List>
            {taskLists.map(list => (
              <ListItem key={list._id} disablePadding>
                <ListItemButton
                  selected={selectedTaskList && selectedTaskList._id === list._id}
                  onClick={() => { setSelectedTaskList(list); setSelectedTask(null); }}
                >
                  <ListItemText primary={list.nom} />
                </ListItemButton>
                <IconButton edge="end" onClick={() => deleteTaskList(list._id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}

export default Sidebar;
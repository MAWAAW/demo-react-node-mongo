// src/pages/MainPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/layout/Sidebar';
import MainContent from '../components/layout/MainContent';
import RightSidebar from '../components/layout/RightSidebar';
import taskService from '../services/taskService';

function MainPage() {
  const [selectedTaskList, setSelectedTaskList] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const [tasks, setTasks] = useState([]);

  const fetchTasks = useCallback(async () => {
    if (selectedTaskList) {
      try {
        const tasksData = await taskService.getTasks(selectedTaskList._id);
        setTasks(tasksData);
      } catch (err) {
        console.error(err);
        alert('Erreur lors du chargement des tâches');
      }
    } else {
      setTasks([]);
    }
  }, [selectedTaskList]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar
        selectedTaskList={selectedTaskList}
        setSelectedTaskList={setSelectedTaskList}
        setSelectedTask={setSelectedTask}
      />
      <Box sx={{ flexGrow: 1 }}>
        <MainContent
          selectedTaskList={selectedTaskList}
          setSelectedTask={setSelectedTask}
          tasks={tasks}
          setTasks={setTasks}
          fetchTasks={fetchTasks}
        />
      </Box>
      {selectedTask && (
        <RightSidebar
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
          tasks={tasks}
          setTasks={setTasks}
          fetchTasks={fetchTasks}
        />
      )}
    </Box>
  );
}

export default MainPage;
// src/services/taskListService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/tasklists/';

const getTaskLists = async () => {
  const res = await axios.get(API_URL, {
    headers: { 'x-auth-token': localStorage.getItem('token') },
  });
  return res.data;
};

const createTaskList = async (data) => {
  const res = await axios.post(API_URL, data, {
    headers: { 'x-auth-token': localStorage.getItem('token') },
  });
  return res.data;
};

const deleteTaskList = async (id) => {
  const res = await axios.delete(API_URL + id, {
    headers: { 'x-auth-token': localStorage.getItem('token') },
  });
  return res.data;
};

const taskListService = {
  getTaskLists,
  createTaskList,
  deleteTaskList,
};

export default taskListService;
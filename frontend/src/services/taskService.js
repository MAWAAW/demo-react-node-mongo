import axios from 'axios';

const API_URL = 'http://localhost:5000/tasks/';

const getTasks = async (taskListId) => {
  const res = await axios.get(API_URL + taskListId, {
    headers: { 'x-auth-token': localStorage.getItem('token') },
  });
  return res.data;
};

const createTask = async (data) => {
  const res = await axios.post(API_URL, data, {
    headers: { 'x-auth-token': localStorage.getItem('token') },
  });
  return res.data;
};

const updateTask = async (id, data) => {
  const res = await axios.put(API_URL + id, data, {
    headers: { 'x-auth-token': localStorage.getItem('token') },
  });
  return res.data;
};

const deleteTask = async (id) => {
  const res = await axios.delete(API_URL + id, {
    headers: { 'x-auth-token': localStorage.getItem('token') },
  });
  return res.data;
};

const taskService = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};

export default taskService;
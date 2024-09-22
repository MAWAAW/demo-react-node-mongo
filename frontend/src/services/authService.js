import axios from 'axios';

const API_URL = 'http://localhost:5000/';

const register = async (userData) => {
  const res = await axios.post(API_URL + 'register', userData);
  localStorage.setItem('token', res.data.token);
};

const login = async (userData) => {
  const res = await axios.post(API_URL + 'login', userData);
  localStorage.setItem('token', res.data.token);
};

const logout = () => {
  localStorage.removeItem('token');
};

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

const authService = {
  register,
  login,
  logout,
  isAuthenticated,
};

export default authService;
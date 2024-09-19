// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import MainContent from './components/layout/MainContent';  // Page principale (tâches)
import PrivateRoute from './components/PrivateRoute';  // Route protégée

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Route protégée par PrivateRoute */}
        <Route 
          path="/tasks" 
          element={
            <PrivateRoute>
              <MainContent />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
// src/components/auth/Login.js
import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errorMsg, setErrorMsg] = useState('');

  const { email, password } = formData;

  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await authService.login({ email, password });
      navigate('/');
    } catch (err) {
      console.error(err);
      setErrorMsg('Erreur lors de la connexion');
    }
  };

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Connexion
      </Typography>
      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      <TextField
        margin="normal"
        required
        fullWidth
        label="Email"
        name="email"
        value={email}
        onChange={onChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Mot de passe"
        type="password"
        name="password"
        value={password}
        onChange={onChange}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
        Connexion
      </Button>
    </Box>
  );
}

export default Login;
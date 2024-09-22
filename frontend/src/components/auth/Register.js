import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

function Register() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    emailConfirm: '',
    password: '',
    passwordConfirm: '',
  });

  const [errorMsg, setErrorMsg] = useState('');

  const { nom, prenom, email, emailConfirm, password, passwordConfirm } = formData;

  const navigate = useNavigate();

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();

    if (email !== emailConfirm) {
      setErrorMsg('Les emails ne correspondent pas');
      return;
    }
    if (password !== passwordConfirm) {
      setErrorMsg('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      await authService.register({
        nom,
        prenom,
        email,
        emailConfirm,
        password,
        passwordConfirm,
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.errors) {
        const errors = err.response.data.errors;
        setErrorMsg(errors.map(error => error.msg).join('\n'));
      } else {
        setErrorMsg("Erreur lors de l'inscription");
      }
    }
  };

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Inscription
      </Typography>
      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      <TextField
        margin="normal"
        required
        fullWidth
        label="Nom"
        name="nom"
        value={nom}
        onChange={onChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Prénom"
        name="prenom"
        value={prenom}
        onChange={onChange}
      />
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
        label="Confirmez l'email"
        name="emailConfirm"
        value={emailConfirm}
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
      <TextField
        margin="normal"
        required
        fullWidth
        label="Confirmez le mot de passe"
        type="password"
        name="passwordConfirm"
        value={passwordConfirm}
        onChange={onChange}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
        S'inscrire
      </Button>
    </Box>
  );
}

export default Register;
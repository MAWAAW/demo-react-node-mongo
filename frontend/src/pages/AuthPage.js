import React, { useState } from 'react';
import { Container, Box, Card, CardContent, Typography, Link } from '@mui/material';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
        <Card sx={{ width: '100%', padding: 2 }}>
          <CardContent>
            {isLogin ? <Login /> : <Register />}
            <Box sx={{ textAlign: 'center', marginTop: 2 }}>
              {isLogin ? (
                <Typography variant="body2">
                  Pas de compte ?{' '}
                  <Link href="#" onClick={toggleForm}>
                    Inscrivez-vous
                  </Link>
                </Typography>
              ) : (
                <Typography variant="body2">
                  Déjà inscrit ?{' '}
                  <Link href="#" onClick={toggleForm}>
                    Connectez-vous
                  </Link>
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default AuthPage;
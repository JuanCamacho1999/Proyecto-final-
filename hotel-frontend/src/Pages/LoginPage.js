import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tokens = await loginUser(username, password);
      if (tokens) {
        navigate('/role-redirect');
      }
    } catch (error) {
      setError('Nombre de usuario o contraseña incorrectos');
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#0F172A', // Fondo oscuro
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            padding: '40px',
            borderRadius: '15px',
            backgroundColor: '#1E293B',
            color: '#E2E8F0',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{ color: '#A5B4FC', fontWeight: 'bold' }}
          >
            Iniciar sesión
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: '#94A3B8' } }}
              InputProps={{
                style: { color: '#E2E8F0' },
                sx: { backgroundColor: '#334155', borderRadius: '5px' },
              }}
            />
            <TextField
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: '#94A3B8' } }}
              InputProps={{
                style: { color: '#E2E8F0' },
                sx: { backgroundColor: '#334155', borderRadius: '5px' },
              }}
            />
            {error && (
              <Typography
                color="error"
                sx={{ marginTop: '10px', textAlign: 'center' }}
              >
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                marginTop: '20px',
                backgroundColor: '#3B82F6',
                color: '#E2E8F0',
                '&:hover': { backgroundColor: '#1D4ED8' },
              }}
            >
              Iniciar sesión
            </Button>
          </form>
          <Typography
            variant="body2"
            align="center"
            sx={{ marginTop: '15px', color: '#94A3B8' }}
          >
            ¿No tienes una cuenta?{' '}
            <a
              href="/register"
              style={{
                color: '#A5B4FC',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              Registrarse aquí
            </a>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;

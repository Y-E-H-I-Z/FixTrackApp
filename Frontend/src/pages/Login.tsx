import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { 
  Container, Box, Typography, TextField, 
  Button, Alert, Paper 
} from '@mui/material';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/Auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError('Usuario o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Paper elevation={4} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 3 }}>
        <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
          Acceso Técnico
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Ingresa tus credenciales para administrar
        </Typography>

        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
          <TextField
            fullWidth margin="normal" label="Usuario" required
            value={username} onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth margin="normal" label="Contraseña" type="password" required
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit" fullWidth variant="contained" color="primary"
            size="large" sx={{ mt: 3, mb: 2 }} disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Typography variant="body2" color="textSecondary">
              ¿Tu taller aún no usa FixTrack?{' '}
              <Link to="/register" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}>
                Crea una cuenta gratis
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
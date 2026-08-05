import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { 
  Container, Box, Typography, TextField, 
  Button, Alert, Paper 
} from '@mui/material';

export default function Register() {
  const [formData, setFormData] = useState({
    businessName: '',
    fullName: '',
    username: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/Auth/register', formData);
      setSuccess('¡Taller registrado con éxito! Redirigiendo al login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError('Hubo un error al registrar el taller. Verifica los datos e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={4} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 3 }}>
        <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
          Nuevo Taller
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3, textAlign: 'center' }}>
          Registra tu negocio para empezar a gestionar tus reparaciones
        </Typography>

        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleRegister} sx={{ width: '100%' }}>
          <TextField
            fullWidth margin="dense" label="Nombre del Negocio (Ej: PC Master)" name="businessName" 
            value={formData.businessName} onChange={handleInputChange} required
          />
          <TextField
            fullWidth margin="dense" label="Tu Nombre Completo" name="fullName" 
            value={formData.fullName} onChange={handleInputChange} required
          />
          <TextField
            fullWidth margin="dense" label="Usuario para iniciar sesión" name="username" 
            value={formData.username} onChange={handleInputChange} required
          />
          <TextField
            fullWidth margin="dense" label="Contraseña" type="password" name="password" 
            value={formData.password} onChange={handleInputChange} required
          />
          
          <Button
            type="submit" fullWidth variant="contained" color="primary"
            size="large" sx={{ mt: 3, mb: 2 }} disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrar Taller'}
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Typography variant="body2" color="textSecondary">
              ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}>Inicia sesión aquí</Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Si estamos en el dashboard (/admin), no mostramos esta barra porque el dashboard ya tiene su propio botón de "Cerrar Sesión"
  if (location.pathname === '/admin') {
    return null;
  }

  return (
    <AppBar position="sticky" elevation={1} sx={{ backgroundColor: '#ffffff', color: '#333' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', maxWidth: 'lg', width: '100%', mx: 'auto' }}>
        
        {/* Logo / Nombre de la App */}
        <Typography 
          variant="h6" 
          sx={{ fontWeight: 'bold', cursor: 'pointer', color: 'primary.main' }}
          onClick={() => navigate('/')}
        >
          FixTrack 🛠️
        </Typography>

        {/* Botones de Navegación */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {location.pathname === '/' ? (
            <>
              <Button color="inherit" onClick={() => navigate('/login')} sx={{ fontWeight: 'medium' }}>
                Acceso Talleres
              </Button>
              <Button variant="contained" color="primary" onClick={() => navigate('/register')}>
                Registrar mi Taller Gratis
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate('/')}>
              ← Volver al buscador
            </Button>
          )}
        </Box>

      </Toolbar>
    </AppBar>
  );
}
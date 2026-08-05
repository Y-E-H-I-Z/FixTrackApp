import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/admin') {
    return null;
  }

  return (
    <AppBar position="sticky" elevation={1} sx={{ backgroundColor: '#ffffff', color: '#333' }}>
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        maxWidth: 'lg', 
        width: '100%', 
        mx: 'auto',
        px: { xs: 2, sm: 3 } // Padding adaptable según el tamaño de pantalla
      }}>
        
        {/* Logo */}
        <Typography 
          variant="h6" 
          sx={{ fontWeight: 'bold', cursor: 'pointer', color: 'primary.main', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
          onClick={() => navigate('/')}
        >
          FixTrack 🛠️
        </Typography>

        {/* Botones Adaptables */}
        <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, alignItems: 'center' }}>
          {location.pathname === '/' ? (
            <>
              <Button 
                color="inherit" 
                onClick={() => navigate('/login')} 
                sx={{ fontSize: { xs: '0.8rem', sm: '0.95rem' }, p: { xs: 0.5, sm: 1 } }}
              >
                Acceso
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/register')}
                sx={{ fontSize: { xs: '0.75rem', sm: '0.9rem' }, px: { xs: 1, sm: 2 } }}
              >
                Registrar Taller
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate('/')} sx={{ fontSize: { xs: '0.8rem', sm: '0.95rem' } }}>
              ← Volver
            </Button>
          )}
        </Box>

      </Toolbar>
    </AppBar>
  );
}
import { useState } from 'react';
import { api } from '../services/api';
import type { Ticket } from '../interfaces/ticket';
import { 
  Container, Typography, TextField, Button, 
  Card, CardContent, Box, Alert, CircularProgress 
} from '@mui/material';

export default function Home() {
  const [trackingCode, setTrackingCode] = useState('');
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const buscarTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingCode.trim()) return;

    setLoading(true);
    setError('');
    setTicket(null);

    try {
      const response = await api.get(`/Tickets/Track/${trackingCode.trim()}`);
      setTicket(response.data);
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setError('No se encontró ninguna reparación con ese código.');
      } else {
        setError('Ocurrió un error al buscar. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
      <Typography variant="h3" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
        FixTrack
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Consulta el estado de tu reparación en tiempo real
      </Typography>

      <Box component="form" onSubmit={buscarTicket} sx={{ mt: 4, mb: 4, display: 'flex', gap: 1 }}>
        <TextField 
          fullWidth 
          variant="outlined" 
          label="Ingresa tu código (Ej: FIX-A1B2C3)" 
          value={trackingCode}
          onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
        />
        <Button 
          type="submit" 
          variant="contained" 
          size="large" 
          disabled={loading}
          sx={{ px: 4 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Buscar'}
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {ticket && (
        <Card elevation={4} sx={{ mt: 3, textAlign: 'left', borderRadius: 3 }}>
          <CardContent>
            <Typography variant="overline" color="textSecondary">
              Código: {ticket.trackingCode}
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              {ticket.deviceInfo}
            </Typography>
            
            <Box sx={{ my: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <Typography variant="body2" color="textSecondary">Problema reportado:</Typography>
              <Typography variant="body1">{ticket.reportedIssue}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
              <Typography variant="subtitle1">Estado actual:</Typography>
              <Typography 
                variant="h6" 
                color={ticket.status === 'Listo' || ticket.status === 'Entregado' ? 'success.main' : 'warning.main'}
                sx={{ fontWeight: 'bold' }}
              >
                {ticket.status}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
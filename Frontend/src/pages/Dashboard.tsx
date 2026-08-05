import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { Ticket } from '../interfaces/ticket'; 
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Typography, Container, 
  Button, Box, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, Select, MenuItem, IconButton 
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp'; 
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Dashboard() {
  const navigate = useNavigate(); 
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    dni: '',
    deviceInfo: '',
    reportedIssue: '',
    estimatedPrice: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    cargarTickets();
  }, [navigate]);

  const cargarTickets = async () => {
    try {
      const response = await api.get('/Tickets');
      setTickets(response.data);
    } catch (error) {
      console.error("Error cargando los tickets:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const abrirModalNuevo = () => {
    setEditandoId(null);
    setFormData({ fullName: '', phoneNumber: '', dni: '', deviceInfo: '', reportedIssue: '', estimatedPrice: 0 });
    setOpenModal(true);
  };

  const abrirModalEdicion = (ticket: Ticket) => {
    setEditandoId(ticket.id);
    setFormData({
      fullName: ticket.customer?.fullName || '',
      phoneNumber: ticket.customer?.phoneNumber || '',
      dni: ticket.customer?.dni || '',
      deviceInfo: ticket.deviceInfo,
      reportedIssue: ticket.reportedIssue,
      estimatedPrice: ticket.estimatedPrice
    });
    setOpenModal(true);
  };

  const handleGuardarTicket = async () => {
    setGuardando(true); 
    try {
      const ticketData = {
        deviceInfo: formData.deviceInfo,
        reportedIssue: formData.reportedIssue,
        status: "Recibido",
        estimatedPrice: formData.estimatedPrice,
        customer: {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          dni: formData.dni
        }
      };

      if (editandoId === null) {
        await api.post('/Tickets', ticketData);
      } else {
        const ticketParaActualizar = { ...ticketData, id: editandoId };
        await api.put(`/Tickets/${editandoId}`, ticketParaActualizar);
      }
      
      setOpenModal(false);
      cargarTickets(); 
    } catch (error) {
      console.error("Error al guardar el ticket:", error);
      alert("Hubo un error al guardar el ticket.");
    } finally {
      setGuardando(false); 
    }
  };

  const handleEliminarTicket = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este ticket permanentemente?")) {
      try {
        await api.delete(`/Tickets/${id}`);
        cargarTickets();
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("No se pudo eliminar el ticket.");
      }
    }
  };

  const handleStatusChange = async (ticket: Ticket, event: SelectChangeEvent) => {
    const nuevoEstado = event.target.value;
    try {
      const ticketActualizado = { ...ticket, status: nuevoEstado };
      await api.put(`/Tickets/${ticket.id}`, ticketActualizado);
      cargarTickets();
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      alert("No se pudo actualizar el estado.");
    }
  };

  const notificarWhatsApp = (ticket: Ticket) => {
    if (!ticket.customer?.phoneNumber) {
      alert("Este cliente no registró un número de teléfono.");
      return;
    }
    let telefono = ticket.customer.phoneNumber.replace(/\s+/g, '');
    if (!telefono.startsWith('51') && !telefono.startsWith('+')) {
      telefono = `51${telefono}`;
    }
    const mensaje = `Hola ${ticket.customer.fullName}, te saludamos del servicio técnico. Te informamos que tu equipo (${ticket.deviceInfo}) actualmente se encuentra: *${ticket.status}*. Puedes hacer el seguimiento con tu código ${ticket.trackingCode} aquí: http://localhost:5173/`;
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Panel de Control - FixTrackApp
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" color="error" onClick={() => {
            localStorage.removeItem('token'); 
            navigate('/login'); 
          }}>
            Cerrar Sesión
          </Button>
          <Button variant="contained" color="primary" onClick={abrirModalNuevo}>
            + Nuevo Ingreso
          </Button>
        </Box>
      </Box>
      
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Código</strong></TableCell>
              <TableCell><strong>Cliente</strong></TableCell>
              <TableCell><strong>Equipo</strong></TableCell>
              <TableCell><strong>Falla Reportada</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>  
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No hay tickets registrados aún.</TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => (
                <TableRow key={ticket.id} hover>
                  <TableCell>{ticket.trackingCode}</TableCell>
                  <TableCell>{ticket.customer?.fullName}</TableCell>
                  <TableCell>{ticket.deviceInfo}</TableCell>
                  <TableCell>{ticket.reportedIssue}</TableCell>
                  <TableCell>
                    <Select
                      value={ticket.status}
                      size="small"
                      onChange={(e) => handleStatusChange(ticket, e)}
                      sx={{ 
                          minWidth: 140, 
                          backgroundColor: ticket.status === 'Listo' ? '#e8f5e9' : 'white'
                      }}
                    >
                      <MenuItem value="Recibido">Recibido</MenuItem>
                      <MenuItem value="En Diagnóstico">En Diagnóstico</MenuItem>
                      <MenuItem value="En Reparación">En Reparación</MenuItem>
                      <MenuItem value="Listo">Listo</MenuItem>
                      <MenuItem value="Entregado">Entregado</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => abrirModalEdicion(ticket)} title="Editar Ticket">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleEliminarTicket(ticket.id)} title="Eliminar Ticket">
                      <DeleteIcon />
                    </IconButton>
                    <IconButton color="success" onClick={() => notificarWhatsApp(ticket)} title="Notificar por WhatsApp">
                      <WhatsAppIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {editandoId ? 'Editar Equipo' : 'Registrar Nuevo Equipo'}
        </DialogTitle>
        <DialogContent dividers>
          
          <Typography variant="subtitle2" color="primary" gutterBottom>
            Datos del Cliente
          </Typography>
          <TextField fullWidth margin="dense" label="Nombre Completo" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField fullWidth margin="dense" label="WhatsApp (Teléfono)" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
            <TextField fullWidth margin="dense" label="DNI (Opcional)" name="dni" value={formData.dni} onChange={handleInputChange} />
          </Box>

          <Typography variant="subtitle2" color="primary" sx={{ mt: 3, mb: 1 }}>
            Detalles de la Reparación
          </Typography>
          <TextField fullWidth margin="dense" label="Equipo (Ej: Laptop Lenovo T480)" name="deviceInfo" value={formData.deviceInfo} onChange={handleInputChange} required />
          <TextField fullWidth margin="dense" label="Falla Reportada" name="reportedIssue" value={formData.reportedIssue} onChange={handleInputChange} multiline rows={3} required />
          <TextField fullWidth margin="dense" label="Precio Estimado (S/)" name="estimatedPrice" type="number" value={formData.estimatedPrice} onChange={handleInputChange} />
          
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenModal(false)} color="inherit">Cancelar</Button>
          <Button variant="contained" onClick={handleGuardarTicket} color="primary" disabled={guardando}>
            {guardando ? 'Guardando...' : (editandoId ? 'Actualizar Ticket' : 'Guardar Ticket')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
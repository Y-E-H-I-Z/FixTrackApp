using FixTrackApp.API.DTOs;
using FixTrackApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FixTrackApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // <-- ¡CANDADO PUESTO! Nadie entra sin token
    public class TicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // Inyección de dependencias: Le pasamos la base de datos al controlador
        public TicketsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Tickets (Obtener todos los tickets - Para el panel del técnico)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetTickets()
        {
            return await _context.Tickets.Include(t => t.Customer).ToListAsync();
        }

        // GET: api/Tickets/5 (Obtener un ticket por ID)
        [HttpGet("{id}")]
        public async Task<ActionResult<Ticket>> GetTicket(int id)
        {
            var ticket = await _context.Tickets.Include(t => t.Customer)
                                               .FirstOrDefaultAsync(t => t.Id == id);

            if (ticket == null)
            {
                return NotFound("No se encontró la orden de reparación.");
            }

            return ticket;
        }

        // GET: api/Tickets/Track/FIX-001 (Obtener por Código - Para el portal público del cliente)
        [HttpGet("Track/{trackingCode}")]
        [AllowAnonymous] // <-- Permite que los clientes consulten su estado sin login
        public async Task<ActionResult<Ticket>> TrackTicket(string trackingCode)
        {
            var ticket = await _context.Tickets.FirstOrDefaultAsync(t => t.TrackingCode == trackingCode);

            if (ticket == null)
            {
                return NotFound("Código de seguimiento inválido.");
            }

            return ticket; // El cliente solo necesita ver esto, no toda su info personal
        }

        // POST: api/Tickets
        [HttpPost]
        public async Task<ActionResult<Ticket>> PostTicket(TicketCreateDto dto)
        {
            // Mapeamos el DTO hacia nuestra entidad real de base de datos
            var ticket = new Ticket
            {
                TrackingCode = $"FIX-{Guid.NewGuid().ToString().Substring(0, 6).ToUpper()}",
                DeviceInfo = dto.DeviceInfo,
                ReportedIssue = dto.ReportedIssue,
                Status = dto.Status,
                EstimatedPrice = dto.EstimatedPrice,
                Customer = dto.Customer
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTicket", new { id = ticket.Id }, ticket);
        }

        // PUT: api/Tickets/5 (EDITAR)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTicket(int id, Ticket ticketActualizado)
        {
            if (id != ticketActualizado.Id)
            {
                return BadRequest("El ID del ticket no coincide.");
            }

            // Buscamos el ticket en la BD incluyendo los datos del cliente
            var ticketDB = await _context.Tickets
                .Include(t => t.Customer)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (ticketDB == null)
            {
                return NotFound();
            }

            // Actualizamos solo los campos permitidos (No tocamos el TrackingCode ni el TenantId)
            ticketDB.DeviceInfo = ticketActualizado.DeviceInfo;
            ticketDB.ReportedIssue = ticketActualizado.ReportedIssue;
            ticketDB.Status = ticketActualizado.Status;
            ticketDB.EstimatedPrice = ticketActualizado.EstimatedPrice;

            // Actualizamos los datos del cliente
            ticketDB.Customer.FullName = ticketActualizado.Customer.FullName;
            ticketDB.Customer.PhoneNumber = ticketActualizado.Customer.PhoneNumber;
            ticketDB.Customer.Dni = ticketActualizado.Customer.Dni;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return NoContent(); // 204: Todo salió bien, no hay contenido que devolver
        }

        // DELETE: api/Tickets/5 (ELIMINAR)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            // Buscamos el ticket
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
            {
                return NotFound();
            }

            // Lo borramos de la base de datos
            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
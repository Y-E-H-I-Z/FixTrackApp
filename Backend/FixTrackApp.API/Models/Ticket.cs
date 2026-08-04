using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FixTrackApp.API.Models
{
    public class Ticket
    {
        [Key]
        public int Id { get; set; }

        // Este es el código que el cliente usará para consultar su estado (Ej. FIX-0012)
        [Required, MaxLength(20)]
        public string TrackingCode { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string DeviceInfo { get; set; } = string.Empty; // Ej: "Laptop Lenovo Thinkpad T480"

        [Required]
        public string ReportedIssue { get; set; } = string.Empty; // Ej: "No enciende, pantalla parpadea"

        [Required, MaxLength(50)]
        public string Status { get; set; } = "Recibido"; // Recibido, En Diagnóstico, Listo, Entregado

        [Column(TypeName = "decimal(10,2)")]
        public decimal EstimatedPrice { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Clave foránea para vincularlo al cliente
        public int CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;
        // Añade esto en Ticket.cs y en Customer.cs
        public int TenantId { get; set; }
        [JsonIgnore] // <-- 2. AÑADIR ESTO
        public Tenant? Tenant { get; set; }
    }
}
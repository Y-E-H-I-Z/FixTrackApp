using System.ComponentModel.DataAnnotations;
using System.Net.Sockets;
using System.Text.Json.Serialization;

namespace FixTrackApp.API.Models
{
    public class Customer
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [MaxLength(15)]
        public string? PhoneNumber { get; set; } // Opcional, pero vital para WhatsApp

        [MaxLength(8)]
        public string? Dni { get; set; }

        // Relación: Un cliente puede tener varios tickets de reparación
        public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();

        public int TenantId { get; set; }

        [JsonIgnore]
        public Tenant? Tenant { get; set; } = null!;
    }
}
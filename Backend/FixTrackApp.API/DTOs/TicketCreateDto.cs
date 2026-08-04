using FixTrackApp.API.Models;
using System.ComponentModel.DataAnnotations;

namespace FixTrackApp.API.DTOs
{
    public class TicketCreateDto
    {
        [Required, MaxLength(100)]
        public string DeviceInfo { get; set; } = string.Empty;

        [Required]
        public string ReportedIssue { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        public string Status { get; set; } = "Recibido";

        public decimal EstimatedPrice { get; set; }

        // Recibimos los datos del cliente
        public Customer Customer { get; set; } = null!;
    }
}
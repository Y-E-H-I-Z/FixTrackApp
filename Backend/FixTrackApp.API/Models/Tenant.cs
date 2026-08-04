using System.ComponentModel.DataAnnotations;

namespace FixTrackApp.API.Models
{
    public class Tenant
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string BusinessName { get; set; } = string.Empty; 

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
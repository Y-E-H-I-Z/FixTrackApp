using Microsoft.AspNetCore.Identity;

namespace FixTrackApp.API.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;

        // Relación crucial: Cada usuario (técnico/dueño) pertenece a un taller
        public int TenantId { get; set; }
        public Tenant Tenant { get; set; } = null!;
    }
}
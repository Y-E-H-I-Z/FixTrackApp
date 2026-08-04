using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using FixTrackApp.API.Services;

namespace FixTrackApp.API.Models
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        private readonly ITenantService _tenantService;

        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options,
            ITenantService tenantService) : base(options)
        {
            _tenantService = tenantService;
        }

        public DbSet<Tenant> Tenants { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Ticket> Tickets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Código de seguimiento único
            modelBuilder.Entity<Ticket>()
                .HasIndex(t => t.TrackingCode)
                .IsUnique();

            // Magia Multi-Tenant (Filtro Global)
            modelBuilder.Entity<Ticket>().HasQueryFilter(t =>
                _tenantService.GetTenantId() == 0 || t.TenantId == _tenantService.GetTenantId());

            modelBuilder.Entity<Customer>().HasQueryFilter(c =>
                _tenantService.GetTenantId() == 0 || c.TenantId == _tenantService.GetTenantId());

            // --- AQUI ESTÁ LA SOLUCIÓN AL ERROR DE CASCADE PATHS ---

            // Le decimos a SQL que si borramos un Taller, NO borre automáticamente sus tickets.
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Tenant)
                .WithMany()
                .HasForeignKey(t => t.TenantId)
                .OnDelete(DeleteBehavior.Restrict);

            // También evitamos que si borramos un Taller, borre a los clientes automáticamente.
            modelBuilder.Entity<Customer>()
                .HasOne(c => c.Tenant)
                .WithMany()
                .HasForeignKey(c => c.TenantId)
                .OnDelete(DeleteBehavior.Restrict);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var tenantId = _tenantService.GetTenantId();

            foreach (var entry in ChangeTracker.Entries())
            {
                if (entry.State == EntityState.Added)
                {
                    var property = entry.Entity.GetType().GetProperty("TenantId");
                    if (property != null && tenantId != 0)
                    {
                        property.SetValue(entry.Entity, tenantId);
                    }
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}